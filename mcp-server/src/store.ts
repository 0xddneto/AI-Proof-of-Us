import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ClaimBatch, ProtocolState, TaskSession, UsageReceipt } from "./types.js";

const emptyState = (): ProtocolState => ({ sessions: {}, receipts: [], completedEvidence: {}, batches: [] });
let mutationQueue: Promise<unknown> = Promise.resolve();

function dataDir(): string {
  return path.resolve(process.env.AIPOU_DATA_DIR || ".aipou");
}

function statePath(): string {
  return path.join(dataDir(), "state.json");
}

async function readState(): Promise<ProtocolState> {
  try {
    return JSON.parse(await readFile(statePath(), "utf8")) as ProtocolState;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return emptyState();
    throw error;
  }
}

async function writeState(state: ProtocolState): Promise<void> {
  await mkdir(dataDir(), { recursive: true });
  const temporary = `${statePath()}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(state, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
  await rename(temporary, statePath());
}

async function mutate<T>(operation: (state: ProtocolState) => Promise<T> | T): Promise<T> {
  const next = mutationQueue.then(async () => {
    const state = await readState();
    const result = await operation(state);
    await writeState(state);
    return result;
  });
  mutationQueue = next.catch(() => undefined);
  return next;
}

export async function saveSession(session: TaskSession): Promise<void> {
  await mutate((state) => {
    if (state.sessions[session.nonce]) throw new Error("Task nonce already exists");
    state.sessions[session.nonce] = session;
  });
}

export async function getSession(nonce: string): Promise<TaskSession | null> {
  return (await readState()).sessions[nonce] || null;
}

export async function saveCompletedReceipt(evidenceKey: string, receipt: UsageReceipt): Promise<void> {
  await mutate((state) => {
    const session = state.sessions[receipt.nonce];
    if (!session) throw new Error("Unknown task nonce");
    if (session.completedAt) throw new Error("Task nonce has already been completed");
    if (state.completedEvidence[evidenceKey]) {
      throw new Error(`Duplicate task/output evidence already recorded as ${state.completedEvidence[evidenceKey]}`);
    }
    if (state.receipts.some((item) => item.receiptId === receipt.receiptId)) {
      throw new Error("Receipt id has already been recorded");
    }

    session.completedAt = receipt.recordedAt;
    state.completedEvidence[evidenceKey] = receipt.receiptId;
    state.receipts.push(receipt);
  });
}

export async function exportStoredReceipts(wallet?: string): Promise<UsageReceipt[]> {
  const receipts = (await readState()).receipts;
  if (!wallet) return receipts;
  return receipts.filter((receipt) => receipt.wallet.toLowerCase() === wallet.toLowerCase());
}

export async function unsettledReceipts(limit: number): Promise<UsageReceipt[]> {
  return (await readState()).receipts.filter((receipt) => !receipt.claimTransaction).slice(0, limit);
}

export async function markBatchSettled(batch: ClaimBatch): Promise<void> {
  await mutate((state) => {
    const included = new Set(batch.receiptIds);
    for (const receipt of state.receipts) {
      if (included.has(receipt.receiptId)) {
        if (receipt.claimTransaction) throw new Error(`Receipt ${receipt.receiptId} is already settled`);
        receipt.batchRoot = batch.root;
        receipt.claimTransaction = batch.claimTransaction;
      }
    }
    state.batches.push(batch);
  });
}

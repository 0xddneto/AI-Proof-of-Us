import { mkdir, readFile, readdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { withFileLock } from "./lock.js";
import type { ClaimBatch, ProtocolState, TaskSession, UsageReceipt } from "./types.js";

const emptyState = (): ProtocolState => ({ sessions: {}, receipts: [], completedEvidence: {}, batches: [] });
let mutationQueue: Promise<unknown> = Promise.resolve();

function dataDir(): string {
  return path.resolve(process.env.AIPOU_DATA_DIR || ".aipou");
}

function statePath(): string {
  return path.join(dataDir(), "state.json");
}

function lockPath(): string {
  return `${statePath()}.lock`;
}

function archiveDir(): string {
  return path.join(dataDir(), "settled");
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
  const temporary = `${statePath()}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(state, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
  await rename(temporary, statePath());
}

// The in-process queue orders local callers; the file lock orders the multiple
// MCP server processes (Claude Code, OpenClaw, Codex) that share one data dir.
// Plain reads stay lock-free: writeState replaces state.json atomically via
// rename, and every authoritative check re-reads inside mutate().
async function mutate<T>(operation: (state: ProtocolState) => Promise<T> | T): Promise<T> {
  const next = mutationQueue.then(async () => {
    await mkdir(dataDir(), { recursive: true });
    return withFileLock(lockPath(), async () => {
      const state = await readState();
      const result = await operation(state);
      await writeState(state);
      return result;
    });
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
    if ((state.settledReceiptIds ?? []).includes(receipt.receiptId)) {
      throw new Error("Receipt id has already been settled and archived");
    }

    session.completedAt = receipt.recordedAt;
    state.completedEvidence[evidenceKey] = receipt.receiptId;
    state.receipts.push(receipt);
  });
}

async function readArchivedReceipts(): Promise<UsageReceipt[]> {
  let files: string[];
  try {
    files = await readdir(archiveDir());
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
  const receipts: UsageReceipt[] = [];
  for (const file of files.filter((name) => name.endsWith(".json")).sort()) {
    receipts.push(...(JSON.parse(await readFile(path.join(archiveDir(), file), "utf8")) as UsageReceipt[]));
  }
  return receipts;
}

export async function exportStoredReceipts(wallet?: string): Promise<UsageReceipt[]> {
  const receipts = [...(await readArchivedReceipts()), ...(await readState()).receipts];
  if (!wallet) return receipts;
  return receipts.filter((receipt) => receipt.wallet.toLowerCase() === wallet.toLowerCase());
}

export async function unsettledReceipts(limit: number): Promise<UsageReceipt[]> {
  return (await readState()).receipts.filter((receipt) => !receipt.claimTransaction).slice(0, limit);
}

export async function protocolStateCounts(): Promise<{
  sessions: number;
  completedSessions: number;
  incompleteSessions: number;
  batches: number;
}> {
  const state = await readState();
  const sessions = Object.values(state.sessions);
  return {
    sessions: sessions.length,
    completedSessions: sessions.filter((session) => session.completedAt).length,
    incompleteSessions: sessions.filter((session) => !session.completedAt).length,
    batches: state.batches.length
  };
}

export async function settledReceiptsSince(sinceMs: number): Promise<UsageReceipt[]> {
  const receipts = [...(await readArchivedReceipts()), ...(await readState()).receipts];
  return receipts.filter(
    (receipt) => receipt.claimTransaction && Date.parse(receipt.recordedAt) >= sinceMs
  );
}

export async function markBatchSettled(batch: ClaimBatch): Promise<void> {
  await mutate(async (state) => {
    const included = new Set(batch.receiptIds);
    const settled: UsageReceipt[] = [];
    for (const receipt of state.receipts) {
      if (included.has(receipt.receiptId)) {
        if (receipt.claimTransaction) throw new Error(`Receipt ${receipt.receiptId} is already settled`);
        receipt.batchRoot = batch.root;
        receipt.claimTransaction = batch.claimTransaction;
        settled.push(receipt);
      }
    }

    // Settled receipts move to per-batch archive files so state.json stays
    // small; their ids stay in state to keep the replay check O(state).
    await mkdir(archiveDir(), { recursive: true });
    const archivePath = path.join(archiveDir(), `batch-${batch.root.slice(2, 18)}.json`);
    await writeFile(archivePath, `${JSON.stringify(settled, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
    state.receipts = state.receipts.filter((receipt) => !included.has(receipt.receiptId));
    state.settledReceiptIds = [...(state.settledReceiptIds ?? []), ...batch.receiptIds];
    state.batches.push(batch);
  });
}

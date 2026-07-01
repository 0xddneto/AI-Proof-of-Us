import { canonicalJson, sha256Hex } from "./canonical.js";
import { getCollectorPublicKey, signCollectorPayload } from "./collector.js";
import { createTaskSession, verifyTaskAuthorization } from "./identity.js";
import { deriveTrustTier } from "./providers.js";
import { estimateReward } from "./rewards.js";
import { exportStoredReceipts, getSession, saveCompletedReceipt, saveSession } from "./store.js";
import type { CompleteTaskInput, TaskSession, UsageReceipt } from "./types.js";

export async function beginTask(input: {
  provider: string;
  model: string;
  taskHash: string;
  client: string;
  chainId: number;
  verifyingContract: string;
}): Promise<TaskSession> {
  const session = await createTaskSession(input);
  await saveSession(session);
  return session;
}

export async function completeTask(input: CompleteTaskInput): Promise<UsageReceipt> {
  const session = await getSession(input.nonce);
  if (!session) throw new Error("Unknown task nonce");
  if (session.completedAt) throw new Error("Task nonce has already been completed");
  if (!verifyTaskAuthorization(session)) throw new Error("Invalid EIP-712 wallet authorization");

  const trustTier = await deriveTrustTier(session, input, input.providerEvidence);
  const recordedAt = new Date().toISOString();
  const collectorPublicKey = await getCollectorPublicKey();
  const unsigned = {
    nonce: session.nonce,
    wallet: session.wallet,
    provider: session.provider,
    model: session.model,
    inputTokens: input.inputTokens,
    outputTokens: input.outputTokens,
    durationSeconds: input.durationSeconds,
    taskHash: session.taskHash,
    outputHash: input.outputHash,
    client: session.client,
    trustTier,
    walletAuthorization: session.walletAuthorization,
    authorizationIssuedAt: session.issuedAt,
    authorizationChainId: session.chainId,
    authorizationContract: session.verifyingContract,
    providerEvidence: input.providerEvidence,
    collectorPublicKey,
    recordedAt,
    estimatedReward: estimateReward({ ...input, trustTier })
  };
  const receiptId = sha256Hex(canonicalJson(unsigned));
  const collectorSignature = await signCollectorPayload({ receiptId, ...unsigned });
  const receipt: UsageReceipt = { receiptId, ...unsigned, collectorSignature };
  const evidenceKey = sha256Hex(canonicalJson({ taskHash: session.taskHash, outputHash: input.outputHash }));
  await saveCompletedReceipt(evidenceKey, receipt);
  return receipt;
}

export async function exportReceipts(wallet?: string): Promise<UsageReceipt[]> {
  return exportStoredReceipts(wallet);
}

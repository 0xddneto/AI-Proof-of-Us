import { canonicalJson, sha256Hex } from "./canonical.js";
import { receiptEvidenceReport, type EvidenceReport } from "./evidence.js";
import { verifyCollectorPayload } from "./collector.js";
import { verifyTaskAuthorization } from "./identity.js";
import type { TaskSession, UsageReceipt } from "./types.js";

export interface ReceiptVerificationResult {
  valid: boolean;
  errors: string[];
  workReceiptId: string | null;
  claimedWorkReceiptId: string | null;
  evidence: EvidenceReport;
}

function isBytes32(value: unknown): value is string {
  return typeof value === "string" && /^0x[0-9a-f]{64}$/i.test(value);
}

function assertReceiptShape(receipt: Partial<UsageReceipt>): string[] {
  const errors: string[] = [];
  const fields = new Set(["receiptId", "nonce", "wallet", "provider", "model", "inputTokens", "outputTokens", "durationSeconds", "taskHash", "outputHash", "client", "trustTier", "walletAuthorization", "authorizationIssuedAt", "authorizationChainId", "authorizationContract", "providerEvidence", "collectorPublicKey", "collectorSignature", "recordedAt", "estimatedReward", "batchRoot", "claimTransaction", "tokenUsageMeasurement"]);
  if (Object.keys(receipt).some(key => !fields.has(key))) return ["receipt contains unsupported fields"];
  for (const [key, value] of Object.entries(receipt)) {
    if (key === "providerEvidence") {
      if (value !== undefined && (!value || typeof value !== "object" || Array.isArray(value) || Object.keys(value).some(k => !["keyId", "signature"].includes(k)) || typeof value.keyId !== "string" || typeof value.signature !== "string" || value.keyId.length > 128 || value.signature.length > 2048)) return ["providerEvidence must contain bounded keyId and signature strings"];
    } else if (value !== undefined && typeof value !== "string" && typeof value !== "number") return ["receipt fields must be scalar values"];
    if (typeof value === "string" && value.length > 8192) return ["receipt field exceeds length limit"];
  }
  for (const field of ["receiptId", "nonce", "taskHash", "outputHash"] as const) {
    if (!isBytes32(receipt[field])) errors.push(`${field} must be a bytes32 hex value`);
  }
  if (typeof receipt.walletAuthorization !== "string" || !/^0x[0-9a-f]+$/i.test(receipt.walletAuthorization)) {
    errors.push("walletAuthorization must be a hex EIP-712 signature");
  }
  if (typeof receipt.wallet !== "string" || !/^0x[0-9a-f]{40}$/i.test(receipt.wallet)) errors.push("wallet must be an address");
  if (typeof receipt.authorizationContract !== "string" || !/^0x[0-9a-f]{40}$/i.test(receipt.authorizationContract)) {
    errors.push("authorizationContract must be an address");
  }
  for (const field of ["provider", "model", "client", "collectorPublicKey", "collectorSignature", "recordedAt", "estimatedReward"] as const) {
    if (typeof receipt[field] !== "string" || receipt[field].length === 0) errors.push(`${field} must be a non-empty string`);
  }
  for (const field of ["inputTokens", "outputTokens", "durationSeconds", "authorizationIssuedAt", "authorizationChainId"] as const) {
    if (!Number.isSafeInteger(receipt[field]) || Number(receipt[field]) < 0) errors.push(`${field} must be a non-negative safe integer`);
  }
  if (receipt.trustTier !== "client_signed" && receipt.trustTier !== "provider_signed") errors.push("trustTier is unsupported");
  if (receipt.tokenUsageMeasurement !== undefined && !["measured", "unmeasured", "unspecified"].includes(receipt.tokenUsageMeasurement)) errors.push("tokenUsageMeasurement is unsupported");
  if (receipt.tokenUsageMeasurement === "unmeasured" && (receipt.inputTokens !== 0 || receipt.outputTokens !== 0)) errors.push("unmeasured token usage must have zero counts");
  if (Number.isNaN(Date.parse(String(receipt.recordedAt)))) errors.push("recordedAt must be an ISO date");
  return errors;
}

/**
 * Verifies only the self-contained receipt facts. It does not check a
 * collector allowlist, an on-chain claim, delivery, or business acceptance.
 */
export function verifyAipouReceipt(candidate: unknown): ReceiptVerificationResult {
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    return {
      valid: false,
      errors: ["receipt must be an object"],
      workReceiptId: null,
      claimedWorkReceiptId: null,
      evidence: receiptEvidenceReport({ receiptIntegrity: false, walletAuthorization: false, collectorSignature: false })
    };
  }
  const receipt = candidate as UsageReceipt;
  const errors = assertReceiptShape(receipt);
  if (errors.length > 0) {
    return {
      valid: false,
      errors,
      workReceiptId: null,
      claimedWorkReceiptId: isBytes32(receipt.receiptId) ? receipt.receiptId.toLowerCase() : null,
      evidence: receiptEvidenceReport({ receiptIntegrity: false, walletAuthorization: false, collectorSignature: false })
    };
  }

  const { receiptId, collectorSignature: signature, batchRoot: _batchRoot, claimTransaction: _claimTransaction, ...unsigned } = receipt;
  const receiptIntegrity = sha256Hex(canonicalJson(unsigned)).toLowerCase() === receiptId.toLowerCase();
  if (!receiptIntegrity) errors.push("receiptId does not match canonical unsigned receipt payload");

  let collectorSignatureValid = false;
  try {
    collectorSignatureValid = verifyCollectorPayload({ receiptId, ...unsigned }, signature, receipt.collectorPublicKey);
  } catch {
    collectorSignatureValid = false;
  }
  if (!collectorSignatureValid) errors.push("collector signature is invalid");

  const session: TaskSession = {
    nonce: receipt.nonce,
    wallet: receipt.wallet,
    provider: receipt.provider,
    model: receipt.model,
    taskHash: receipt.taskHash,
    client: receipt.client,
    issuedAt: receipt.authorizationIssuedAt,
    chainId: receipt.authorizationChainId,
    verifyingContract: receipt.authorizationContract,
    walletAuthorization: receipt.walletAuthorization,
    completedAt: receipt.recordedAt
  };
  let walletAuthorization = false;
  try {
    walletAuthorization = verifyTaskAuthorization(session);
  } catch {
    walletAuthorization = false;
  }
  if (!walletAuthorization) errors.push("wallet authorization is invalid");

  return {
    valid: errors.length === 0,
    errors,
    workReceiptId: errors.length === 0 ? receiptId.toLowerCase() : null,
    claimedWorkReceiptId: errors.length === 0 ? null : receiptId.toLowerCase(),
    evidence: receiptEvidenceReport({
      receiptIntegrity,
      walletAuthorization,
      collectorSignature: collectorSignatureValid,
      hostExecution: receiptIntegrity && collectorSignatureValid ? "OBSERVED" : "UNKNOWN"
    })
  };
}

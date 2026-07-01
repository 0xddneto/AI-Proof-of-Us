export type TrustTier = "client_signed" | "provider_signed";

export interface TaskSession {
  nonce: string;
  wallet: string;
  provider: string;
  model: string;
  taskHash: string;
  client: string;
  issuedAt: number;
  chainId: number;
  verifyingContract: string;
  walletAuthorization: string;
  completedAt?: string;
}

export interface ProviderEvidence {
  keyId: string;
  signature: string;
}

export interface CompleteTaskInput {
  nonce: string;
  inputTokens: number;
  outputTokens: number;
  durationSeconds: number;
  outputHash: string;
  providerEvidence?: ProviderEvidence;
}

export interface UsageReceipt {
  receiptId: string;
  nonce: string;
  wallet: string;
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  durationSeconds: number;
  taskHash: string;
  outputHash: string;
  client: string;
  trustTier: TrustTier;
  walletAuthorization: string;
  authorizationIssuedAt: number;
  authorizationChainId: number;
  authorizationContract: string;
  providerEvidence?: ProviderEvidence;
  collectorPublicKey: string;
  collectorSignature: string;
  recordedAt: string;
  estimatedReward: string;
  batchRoot?: string;
  claimTransaction?: string;
}

export interface ClaimBatch {
  root: string;
  receiptIds: string[];
  publishTransaction: string;
  claimTransaction: string;
  settledAt: string;
}

export interface ProtocolState {
  sessions: Record<string, TaskSession>;
  receipts: UsageReceipt[];
  completedEvidence: Record<string, string>;
  batches: ClaimBatch[];
}

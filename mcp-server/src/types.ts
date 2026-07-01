export type TrustTier = "self_reported" | "client_signed" | "provider_signed" | "task_verified";

export interface UsageInput {
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
}

export interface UsageReceipt extends UsageInput {
  receiptId: string;
  recordedAt: string;
  estimatedReward: string;
  signature: string;
}


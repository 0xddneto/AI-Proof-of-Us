import type { TrustTier } from "./types.js";

const tierMultiplier: Record<TrustTier, number> = {
  client_signed: 0.75,
  provider_signed: 1.5
};

export function estimateReward(input: {
  inputTokens: number;
  outputTokens: number;
  durationSeconds: number;
  trustTier: TrustTier;
}): string {
  const totalTokens = Math.max(0, input.inputTokens) + Math.max(0, input.outputTokens);
  const tokenScore = Math.min(totalTokens / 1000, 30);
  const durationScore = Math.min(Math.max(0, input.durationSeconds) / 300, 12);
  const rawReward = (tokenScore + durationScore) * tierMultiplier[input.trustTier];
  const cappedReward = Math.min(rawReward, 50);

  return cappedReward.toFixed(4);
}

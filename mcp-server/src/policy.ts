import type { SkippedReceipt, UsageReceipt } from "./types.js";

export interface SettlementPolicy {
  minTotalTokens: number;
  maxDailyReceiptsPerWallet: number;
}

export const DAY_MS = 24 * 60 * 60 * 1000;

function positiveIntFromEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number.parseInt(raw, 10);
  if (!Number.isInteger(value) || value < 0) throw new Error(`${name} must be a non-negative integer`);
  return value;
}

// Both checks are opt-in: 0 (the default) disables them, keeping the original
// settlement behavior unless the operator explicitly sets the env vars.
export function settlementPolicyFromEnv(): SettlementPolicy {
  return {
    minTotalTokens: positiveIntFromEnv("AIPOU_MIN_RECEIPT_TOKENS", 0),
    maxDailyReceiptsPerWallet: positiveIntFromEnv("AIPOU_MAX_DAILY_RECEIPTS_PER_WALLET", 0)
  };
}

export function filterEligibleReceipts(
  candidates: UsageReceipt[],
  recentlySettled: UsageReceipt[],
  policy: SettlementPolicy,
  now = Date.now()
): { eligible: UsageReceipt[]; skipped: SkippedReceipt[] } {
  const windowStart = now - DAY_MS;
  const dailyCount = new Map<string, number>();
  for (const receipt of recentlySettled) {
    if (Date.parse(receipt.recordedAt) >= windowStart) {
      const wallet = receipt.wallet.toLowerCase();
      dailyCount.set(wallet, (dailyCount.get(wallet) ?? 0) + 1);
    }
  }

  const eligible: UsageReceipt[] = [];
  const skipped: SkippedReceipt[] = [];
  for (const receipt of candidates) {
    const totalTokens = receipt.inputTokens + receipt.outputTokens;
    if (policy.minTotalTokens > 0 && totalTokens < policy.minTotalTokens) {
      skipped.push({
        receiptId: receipt.receiptId,
        wallet: receipt.wallet,
        reason: `below minimum work floor (${totalTokens} < ${policy.minTotalTokens} tokens)`
      });
      continue;
    }
    const wallet = receipt.wallet.toLowerCase();
    const used = dailyCount.get(wallet) ?? 0;
    if (policy.maxDailyReceiptsPerWallet > 0 && used >= policy.maxDailyReceiptsPerWallet) {
      skipped.push({
        receiptId: receipt.receiptId,
        wallet: receipt.wallet,
        reason: `daily receipt limit reached (${policy.maxDailyReceiptsPerWallet} per wallet per 24h)`
      });
      continue;
    }
    dailyCount.set(wallet, used + 1);
    eligible.push(receipt);
  }

  return { eligible, skipped };
}

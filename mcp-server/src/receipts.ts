import { createHash, createHmac } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { UsageInput, UsageReceipt } from "./types.js";
import { estimateReward } from "./rewards.js";

function stableJson(value: unknown): string {
  return JSON.stringify(value, Object.keys(value as Record<string, unknown>).sort());
}

function dataDir(): string {
  return path.resolve(process.env.AIPOU_DATA_DIR || ".aipou");
}

function receiptFile(): string {
  return path.join(dataDir(), "receipts.jsonl");
}

function signingSecret(): string {
  return process.env.AIPOU_RECEIPT_SECRET || "dev-only-aipou-secret";
}

export function hashReceipt(input: UsageInput, recordedAt: string): string {
  const payload = stableJson({ ...input, recordedAt });
  return `0x${createHash("sha256").update(payload).digest("hex")}`;
}

export function signReceipt(receiptId: string): string {
  return `0x${createHmac("sha256", signingSecret()).update(receiptId).digest("hex")}`;
}

export async function recordReceipt(input: UsageInput): Promise<UsageReceipt> {
  const recordedAt = new Date().toISOString();
  const receiptId = hashReceipt(input, recordedAt);
  const receipt: UsageReceipt = {
    ...input,
    receiptId,
    recordedAt,
    estimatedReward: estimateReward(input),
    signature: signReceipt(receiptId)
  };

  await mkdir(dataDir(), { recursive: true });
  await writeFile(receiptFile(), `${JSON.stringify(receipt)}\n`, { flag: "a" });

  return receipt;
}

export async function exportReceipts(wallet?: string): Promise<UsageReceipt[]> {
  try {
    const content = await readFile(receiptFile(), "utf8");
    const receipts = content
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as UsageReceipt);

    if (!wallet) {
      return receipts;
    }

    return receipts.filter((receipt) => receipt.wallet.toLowerCase() === wallet.toLowerCase());
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }
}


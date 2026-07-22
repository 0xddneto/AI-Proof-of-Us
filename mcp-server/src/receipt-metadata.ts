import { collectorFingerprint } from "./collector.js";

export const AIPOU_RECEIPT_META_KEY = "io.github.0xddneto/aipou-receipt";

export function buildReceiptResultMeta(receipt: {
  receiptId: string;
  collectorPublicKey: string;
}): Record<string, unknown> {
  const digest = receipt.receiptId.replace(/^0x/, "").toLowerCase();

  return {
    [AIPOU_RECEIPT_META_KEY]: {
      id: receipt.receiptId,
      uri: `aipou://receipts/${receipt.receiptId}`,
      issuer: collectorFingerprint(receipt.collectorPublicKey),
      digest: `sha256:${digest}`,
      evidenceClass: "issuer_asserted",
      scheme: "aipou-receipt-v1",
      status: "local"
    }
  };
}

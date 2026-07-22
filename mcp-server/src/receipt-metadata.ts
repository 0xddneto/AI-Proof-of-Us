import { collectorFingerprint } from "./collector.js";

export const AIPOU_RECEIPT_META_KEY = "io.github.0xddneto/aipou-receipt";

export const AIPOU_SPAN_ATTRIBUTE_NAMES = {
  workReceiptId: "aipou.work_receipt_id",
  evidenceClass: "aipou.evidence_class",
  scheme: "aipou.scheme",
  validationStatus: "aipou.validation_status"
} as const;

export function buildReceiptSpanAttributes(receipt: {
  receiptId: string;
}): Record<string, string> {
  return {
    [AIPOU_SPAN_ATTRIBUTE_NAMES.workReceiptId]: receipt.receiptId,
    [AIPOU_SPAN_ATTRIBUTE_NAMES.evidenceClass]: "issuer_asserted",
    [AIPOU_SPAN_ATTRIBUTE_NAMES.scheme]: "aipou-receipt-v1",
    [AIPOU_SPAN_ATTRIBUTE_NAMES.validationStatus]: "local"
  };
}

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

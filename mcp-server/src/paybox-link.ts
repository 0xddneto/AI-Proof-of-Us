import { canonicalJson, sha256Hex } from "./canonical.js";

export const PAYBOX_OPERATION_SCHEME = "paybox-operation-v1";
export const EXTERNAL_EVIDENCE_LINK_SCHEME = "external-evidence-link-v1";

export type PayboxWorkLinkInput = {
  workReceiptId: string;
  payboxOperationId: string;
  payboxOperationDigest: string;
  issuedAt: string;
};

export type PayboxWorkLink = {
  scheme: typeof EXTERNAL_EVIDENCE_LINK_SCHEME;
  relation: "supports";
  source: {
    kind: "receipt";
    scheme: "aipou-receipt-v1";
    id: string;
    digest: string;
  };
  target: {
    kind: "payment-operation";
    scheme: typeof PAYBOX_OPERATION_SCHEME;
    id: string;
    digest: string;
  };
  privacy: "digest_only";
  issuedAt: string;
  linkDigest: string;
};

const receiptIdPattern = /^0x[0-9a-f]{64}$/;
const sha256Pattern = /^sha256:[0-9a-f]{64}$/;

function assertValidInput(input: PayboxWorkLinkInput): void {
  if (!receiptIdPattern.test(input.workReceiptId)) {
    throw new Error("workReceiptId must be a lowercase 0x-prefixed SHA-256 identifier");
  }
  if (!sha256Pattern.test(input.payboxOperationDigest)) {
    throw new Error("payboxOperationDigest must be a lowercase sha256 digest");
  }
  if (input.payboxOperationId.length < 1 || input.payboxOperationId.length > 256) {
    throw new Error("payboxOperationId must be an opaque reference between 1 and 256 characters");
  }
  if (!Number.isFinite(Date.parse(input.issuedAt))) {
    throw new Error("issuedAt must be an ISO-8601 timestamp");
  }
}

/**
 * Creates a correlation artifact only. It neither calls Paybox nor establishes
 * payment, settlement, claim eligibility, or any authority beyond the link.
 */
export function createPayboxWorkLink(input: PayboxWorkLinkInput): PayboxWorkLink {
  assertValidInput(input);

  const payload = {
    scheme: EXTERNAL_EVIDENCE_LINK_SCHEME as typeof EXTERNAL_EVIDENCE_LINK_SCHEME,
    relation: "supports" as const,
    source: {
      kind: "receipt" as const,
      scheme: "aipou-receipt-v1" as const,
      id: input.workReceiptId,
      digest: `sha256:${input.workReceiptId.slice(2)}`
    },
    target: {
      kind: "payment-operation" as const,
      scheme: PAYBOX_OPERATION_SCHEME as typeof PAYBOX_OPERATION_SCHEME,
      id: input.payboxOperationId,
      digest: input.payboxOperationDigest
    },
    privacy: "digest_only" as const,
    issuedAt: input.issuedAt
  };

  return {
    ...payload,
    linkDigest: `sha256:${sha256Hex(canonicalJson(payload)).slice(2)}`
  };
}

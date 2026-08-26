import { canonicalJson, sha256Hex } from "./canonical.js";

export const TECHNOCORE_TRANSPORT_SCHEME = "technocore-room-receipt-v1";
export const EXTERNAL_EVIDENCE_LINK_SCHEME = "external-evidence-link-v1";

export type TechnocoreWorkLinkInput = {
  workReceiptId: string;
  transportArtifactId: string;
  transportArtifactDigest: string;
  issuedAt: string;
};

export type TechnocoreWorkLink = {
  scheme: typeof EXTERNAL_EVIDENCE_LINK_SCHEME;
  /** Stable logical identity that excludes issuedAt for retry-safe deduplication. */
  linkId: string;
  relation: "supports";
  source: {
    kind: "receipt";
    scheme: "aipou-receipt-v1";
    id: string;
    digest: string;
  };
  target: {
    kind: "transport-record";
    scheme: typeof TECHNOCORE_TRANSPORT_SCHEME;
    id: string;
    digest: string;
  };
  privacy: "digest_only";
  issuedAt: string;
  linkDigest: string;
};

const receiptIdPattern = /^0x[0-9a-f]{64}$/;
const sha256Pattern = /^sha256:[0-9a-f]{64}$/;

function assertValidInput(input: TechnocoreWorkLinkInput): void {
  if (!receiptIdPattern.test(input.workReceiptId)) {
    throw new Error("workReceiptId must be a lowercase 0x-prefixed SHA-256 identifier");
  }
  if (!sha256Pattern.test(input.transportArtifactDigest)) {
    throw new Error("transportArtifactDigest must be a lowercase sha256 digest");
  }
  if (input.transportArtifactId.length < 1 || input.transportArtifactId.length > 256) {
    throw new Error("transportArtifactId must be an opaque reference between 1 and 256 characters");
  }
  if (!Number.isFinite(Date.parse(input.issuedAt))) {
    throw new Error("issuedAt must be an ISO-8601 timestamp");
  }
}

/**
 * Creates a digest-only correlation artifact. It never calls Technocore or
 * upgrades a supplied snapshot into verified signed transport evidence.
 */
export function createTechnocoreWorkLink(input: TechnocoreWorkLinkInput): TechnocoreWorkLink {
  assertValidInput(input);

  const identity = {
    scheme: EXTERNAL_EVIDENCE_LINK_SCHEME as typeof EXTERNAL_EVIDENCE_LINK_SCHEME,
    relation: "supports" as const,
    source: {
      kind: "receipt" as const,
      scheme: "aipou-receipt-v1" as const,
      id: input.workReceiptId,
      digest: `sha256:${input.workReceiptId.slice(2)}`
    },
    target: {
      kind: "transport-record" as const,
      scheme: TECHNOCORE_TRANSPORT_SCHEME as typeof TECHNOCORE_TRANSPORT_SCHEME,
      id: input.transportArtifactId,
      digest: input.transportArtifactDigest
    },
    privacy: "digest_only" as const
  };

  const payload = { ...identity, issuedAt: input.issuedAt };
  return {
    ...payload,
    linkId: `sha256:${sha256Hex(canonicalJson(identity)).slice(2)}`,
    linkDigest: `sha256:${sha256Hex(canonicalJson(payload)).slice(2)}`
  };
}

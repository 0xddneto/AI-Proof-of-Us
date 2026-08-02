import {
  createHash,
  sign as signEd25519,
  verify as verifyEd25519
} from "node:crypto";

export const FOREIGN_ATTESTATION_SCHEME = "foreign-attestation-v1";
export const FOREIGN_ATTESTATION_EVIDENCE_CLASS = "issuer_asserted";
export const FOREIGN_ATTESTATION_VERDICTS = Object.freeze({
  VERIFIED_FOREIGN: "verified_foreign",
  UNVERIFIABLE: "unverifiable",
  REJECTED: "rejected"
});
export const FOREIGN_TRUST_CLASSES = new Set([
  "operator",
  "workspace",
  "first_party",
  "third_party",
  "public"
]);

const ENVELOPE_FIELDS = new Set([
  "scheme",
  "issuanceScope",
  "evidenceClass",
  "issuer",
  "claimedSubject",
  "contentHash",
  "trustClass",
  "signature"
]);
const PARTY_FIELDS = new Set(["kind", "id"]);
const SIGNATURE_FIELDS = new Set(["algorithm", "signature"]);
const SHA256_PATTERN = /^sha256:[a-f0-9]{64}$/;
const BASE64_PATTERN = /^[A-Za-z0-9+/]+={0,2}$/;
const PRIVATE_CONTENT_FIELDS = new Set([
  "content",
  "prompt",
  "output",
  "raw",
  "rawPrompt",
  "rawOutput",
  "wallet",
  "rewardAmount",
  "claimStatus"
]);

export function canonicalizeForeignAttestation(value) {
  if (Array.isArray(value)) {
    return `[${value.map(canonicalizeForeignAttestation).join(",")}]`;
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value)
      .filter(([, entryValue]) => entryValue !== undefined)
      .sort(([left], [right]) => left.localeCompare(right));
    return `{${entries.map(([key, entryValue]) => (
      `${JSON.stringify(key)}:${canonicalizeForeignAttestation(entryValue)}`
    )).join(",")}}`;
  }
  return JSON.stringify(value);
}

export function sha256ForeignAttestation(value) {
  const bytes = Buffer.isBuffer(value) ? value : Buffer.from(value);
  return `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
}

function requireIdentifier(value, label) {
  if (typeof value !== "string" || value.length === 0 || value.length > 512) {
    throw new Error(`${label} must be a non-empty string of at most 512 characters`);
  }
}

function rejectUnknownFields(value, allowedFields, label) {
  for (const field of Object.keys(value)) {
    if (!allowedFields.has(field)) {
      throw new Error(`${label} contains unsupported field: ${field}`);
    }
  }
}

function validateParty(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} is required`);
  }
  rejectUnknownFields(value, PARTY_FIELDS, label);
  requireIdentifier(value.kind, `${label} kind`);
  requireIdentifier(value.id, `${label} id`);
}

function unsignedPayload(attestation) {
  const { signature, ...payload } = attestation;
  return payload;
}

export function createForeignAttestation({
  issuer,
  claimedSubject,
  contentHash,
  trustClass = "third_party",
  issuanceScope = "foreign"
}) {
  const attestation = {
    scheme: FOREIGN_ATTESTATION_SCHEME,
    issuanceScope,
    evidenceClass: FOREIGN_ATTESTATION_EVIDENCE_CLASS,
    issuer: { kind: issuer?.kind, id: issuer?.id },
    claimedSubject: {
      kind: claimedSubject?.kind,
      id: claimedSubject?.id
    },
    contentHash,
    trustClass
  };
  validateForeignAttestationEnvelope(attestation);
  return attestation;
}

export function signForeignAttestation(attestation, privateKey) {
  validateForeignAttestationEnvelope(attestation);
  const signature = signEd25519(
    null,
    Buffer.from(canonicalizeForeignAttestation(unsignedPayload(attestation))),
    privateKey
  ).toString("base64");
  return {
    ...attestation,
    signature: {
      algorithm: "Ed25519",
      signature
    }
  };
}

export function validateForeignAttestationEnvelope(attestation) {
  if (!attestation || typeof attestation !== "object" || Array.isArray(attestation)) {
    throw new Error("Foreign attestation envelope is required");
  }
  rejectUnknownFields(attestation, ENVELOPE_FIELDS, "Foreign attestation envelope");
  if (attestation.scheme !== FOREIGN_ATTESTATION_SCHEME) {
    throw new Error("Unsupported foreign attestation scheme");
  }
  if (!["foreign", "local"].includes(attestation.issuanceScope)) {
    throw new Error("Foreign attestation issuanceScope must be foreign or local");
  }
  if (attestation.evidenceClass !== FOREIGN_ATTESTATION_EVIDENCE_CLASS) {
    throw new Error("Foreign attestations must remain issuer_asserted");
  }
  validateParty(attestation.issuer, "Foreign attestation issuer");
  validateParty(attestation.claimedSubject, "Foreign attestation claimedSubject");
  if (!SHA256_PATTERN.test(attestation.contentHash ?? "")) {
    throw new Error("Foreign attestation contentHash must be lowercase sha256");
  }
  if (!FOREIGN_TRUST_CLASSES.has(attestation.trustClass)) {
    throw new Error("Foreign attestation trustClass is not recognized");
  }
  for (const field of Object.keys(attestation)) {
    if (PRIVATE_CONTENT_FIELDS.has(field)) {
      throw new Error("Foreign attestations must not embed private content or settlement fields");
    }
  }
  if (attestation.signature !== undefined) {
    if (!attestation.signature || typeof attestation.signature !== "object") {
      throw new Error("Foreign attestation signature must be an object");
    }
    rejectUnknownFields(attestation.signature, SIGNATURE_FIELDS, "Foreign attestation signature");
    if (attestation.signature.algorithm !== "Ed25519") {
      throw new Error("Unsupported foreign attestation signature algorithm");
    }
    if (
      typeof attestation.signature.signature !== "string" ||
      !BASE64_PATTERN.test(attestation.signature.signature)
    ) {
      throw new Error("Foreign attestation signature must be base64");
    }
  }
  return true;
}

function verdict(verdictName, attestation, reason, extra = {}) {
  return {
    verdict: verdictName,
    reason,
    issuer: attestation?.issuer,
    claimedSubject: attestation?.claimedSubject,
    contentHash: attestation?.contentHash,
    claimedTrustClass: attestation?.trustClass,
    ...extra
  };
}

export function verifyForeignAttestation(attestation, { issuerPublicKey } = {}) {
  try {
    validateForeignAttestationEnvelope(attestation);
  } catch (error) {
    return verdict(
      FOREIGN_ATTESTATION_VERDICTS.UNVERIFIABLE,
      attestation,
      error.message
    );
  }

  if (attestation.issuanceScope === "local") {
    return verdict(
      FOREIGN_ATTESTATION_VERDICTS.REJECTED,
      attestation,
      "Foreign attestation claims local issuance"
    );
  }
  if (!attestation.signature) {
    return verdict(
      FOREIGN_ATTESTATION_VERDICTS.UNVERIFIABLE,
      attestation,
      "Foreign attestation has no issuer signature"
    );
  }
  if (!issuerPublicKey) {
    return verdict(
      FOREIGN_ATTESTATION_VERDICTS.UNVERIFIABLE,
      attestation,
      "Foreign attestation verification requires explicit issuer key material"
    );
  }

  let valid = false;
  try {
    valid = verifyEd25519(
      null,
      Buffer.from(canonicalizeForeignAttestation(unsignedPayload(attestation))),
      issuerPublicKey,
      Buffer.from(attestation.signature.signature, "base64")
    );
  } catch {
    valid = false;
  }
  if (!valid) {
    return verdict(
      FOREIGN_ATTESTATION_VERDICTS.UNVERIFIABLE,
      attestation,
      "Foreign attestation issuer signature did not verify"
    );
  }

  return verdict(
    FOREIGN_ATTESTATION_VERDICTS.VERIFIED_FOREIGN,
    attestation,
    "Foreign issuer signature verified; no local trust upgrade applied",
    { effectiveTrustClass: "third_party" }
  );
}

function hostMaterialOnly(lineageRecord) {
  const metadata = lineageRecord?.metadata ?? {};
  const { externalAttestations, ...hostMetadata } = metadata;
  return {
    ...lineageRecord,
    metadata: hostMetadata
  };
}

export function hostMaterialDigest(lineageRecord) {
  return sha256ForeignAttestation(
    canonicalizeForeignAttestation(hostMaterialOnly(lineageRecord))
  );
}

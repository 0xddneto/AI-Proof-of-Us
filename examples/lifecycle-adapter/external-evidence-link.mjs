import {
  createHash,
  createPublicKey,
  sign as signEd25519,
  verify as verifyEd25519
} from "node:crypto";

export const EXTERNAL_EVIDENCE_LINK_SCHEME = "external-evidence-link-v1";
export const EXTERNAL_EVIDENCE_RELATIONS = new Set([
  "input_to",
  "output_of",
  "supports",
  "derived_from"
]);

const SHA256_PATTERN = /^sha256:[a-f0-9]{64}$/;
const PRIVATE_CONTENT_FIELDS = new Set([
  "content",
  "prompt",
  "output",
  "raw",
  "rawPrompt",
  "rawOutput"
]);

function canonicalize(value) {
  if (Array.isArray(value)) {
    return `[${value.map(canonicalize).join(",")}]`;
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value)
      .filter(([, entryValue]) => entryValue !== undefined)
      .sort(([left], [right]) => left.localeCompare(right));
    return `{${entries.map(([key, entryValue]) => `${JSON.stringify(key)}:${canonicalize(entryValue)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export function sha256Digest(value) {
  const bytes = Buffer.isBuffer(value) ? value : Buffer.from(value);
  return `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
}

function linkPayload(link) {
  return {
    scheme: link.scheme,
    relation: link.relation,
    source: link.source,
    target: link.target,
    privacy: link.privacy,
    issuedAt: link.issuedAt
  };
}

function validateArtifactReference(reference, label) {
  if (!reference || typeof reference !== "object") {
    throw new Error(`${label} artifact reference is required`);
  }
  for (const field of ["kind", "scheme", "id", "digest"]) {
    if (typeof reference[field] !== "string" || !reference[field]) {
      throw new Error(`${label} artifact reference requires ${field}`);
    }
  }
  if (!SHA256_PATTERN.test(reference.digest)) {
    throw new Error(`${label} artifact digest must be lowercase sha256`);
  }
  for (const field of Object.keys(reference)) {
    if (PRIVATE_CONTENT_FIELDS.has(field)) {
      throw new Error("External evidence links must not embed private content");
    }
  }
}

export function createExternalEvidenceLink({ relation, source, target, issuedAt }) {
  const link = {
    scheme: EXTERNAL_EVIDENCE_LINK_SCHEME,
    relation,
    source,
    target,
    privacy: "digest_only",
    issuedAt
  };
  validateExternalEvidenceLink({
    ...link,
    linkDigest: sha256Digest(canonicalize(link))
  });
  return {
    ...link,
    linkDigest: sha256Digest(canonicalize(link))
  };
}

export function signExternalEvidenceLink(link, privateKey) {
  validateExternalEvidenceLink(link);
  const publicKey = createPublicKey(privateKey).export({ format: "pem", type: "spki" }).toString();
  const signature = signEd25519(null, Buffer.from(link.linkDigest), privateKey).toString("base64");
  return {
    ...link,
    attestation: {
      algorithm: "Ed25519",
      publicKey,
      signature
    }
  };
}

export function validateExternalEvidenceLink(link, { requireSignature = false } = {}) {
  if (link?.scheme !== EXTERNAL_EVIDENCE_LINK_SCHEME) {
    throw new Error("Unsupported external evidence link scheme");
  }
  if (!EXTERNAL_EVIDENCE_RELATIONS.has(link.relation)) {
    throw new Error("Unsupported external evidence relation");
  }
  if (link.privacy !== "digest_only") {
    throw new Error("External evidence links must be digest_only");
  }
  if (typeof link.issuedAt !== "string" || Number.isNaN(Date.parse(link.issuedAt))) {
    throw new Error("External evidence links require an ISO timestamp");
  }
  validateArtifactReference(link.source, "Source");
  validateArtifactReference(link.target, "Target");
  if (link.source.scheme === link.target.scheme && link.source.id === link.target.id) {
    throw new Error("External evidence links require distinct artifacts");
  }
  const expectedDigest = sha256Digest(canonicalize(linkPayload(link)));
  if (link.linkDigest !== expectedDigest) {
    throw new Error("External evidence link digest mismatch");
  }
  if (requireSignature && !link.attestation) {
    throw new Error("Signed external evidence link required");
  }
  if (link.attestation) {
    if (link.attestation.algorithm !== "Ed25519") {
      throw new Error("Unsupported external evidence signature algorithm");
    }
    const signature = Buffer.from(link.attestation.signature, "base64");
    const valid = verifyEd25519(
      null,
      Buffer.from(link.linkDigest),
      link.attestation.publicKey,
      signature
    );
    if (!valid) throw new Error("Invalid external evidence link signature");
  }
  return true;
}

export function validateArtifactContent(reference, content) {
  validateArtifactReference(reference, "Artifact");
  if (sha256Digest(content) !== reference.digest) {
    throw new Error("Artifact content does not match its digest");
  }
  return true;
}

import { createHash, createPublicKey } from "node:crypto";

export const AIPOU_EVIDENCE_CLASS = "issuer_asserted";
export const AIPOU_RECEIPT_SCHEME = "aipou-receipt-v1";
export const REGISTRY_STATUSES = new Set(["active", "superseded", "revoked"]);

export function collectorFingerprint(publicKey) {
  const der = createPublicKey(publicKey).export({ format: "der", type: "spki" });
  return `sha256:${createHash("sha256").update(der).digest("hex")}`;
}

export function deriveFactId(publicKey, nonce) {
  const fingerprint = collectorFingerprint(publicKey);
  const material = `${AIPOU_RECEIPT_SCHEME}\n${fingerprint}\n${nonce.toLowerCase()}`;
  return `0x${createHash("sha256").update(material).digest("hex")}`;
}

export function validateAipouReference(reference) {
  if (reference.evidenceClass !== AIPOU_EVIDENCE_CLASS) {
    throw new Error("aipou-receipt-v1 must be issuer_asserted");
  }
  if (reference.scheme !== AIPOU_RECEIPT_SCHEME) {
    throw new Error("Unsupported AIPOU receipt scheme");
  }
  if (!REGISTRY_STATUSES.has(reference.registryStatus)) {
    throw new Error("Unsupported registry status");
  }
  if (reference.registryStatus === "superseded" && !reference.supersededBy) {
    throw new Error("Superseded references must identify their successor");
  }
  if (reference.registryStatus === "revoked" && reference.supersededBy) {
    throw new Error("Revoked references are terminal");
  }
  return true;
}

export function validateActiveFactSet(references) {
  const activeFacts = new Set();
  for (const reference of references) {
    validateAipouReference(reference);
    if (reference.registryStatus !== "active") continue;
    const key = `${reference.subject.kind}:${reference.subject.id}:${reference.factId}`;
    if (activeFacts.has(key)) throw new Error("Duplicate active fact");
    activeFacts.add(key);
  }
  return true;
}

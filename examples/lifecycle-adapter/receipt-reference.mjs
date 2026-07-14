import { createHash, createPublicKey } from "node:crypto";

export const AIPOU_EVIDENCE_CLASS = "issuer_asserted";
export const AIPOU_RECEIPT_SCHEME = "aipou-receipt-v1";
export const AUTHORITY_WORK_LINK_SCHEME = "aipou-authority-work-link-v1";
export const ENFORCEMENT_CHECK_SCHEME = "aipou-enforcement-check-v1";
export const REGISTRY_STATUSES = new Set(["active", "superseded", "revoked"]);
export const ENFORCEMENT_VERIFICATION_STATUSES = new Set(["local_test", "external_verified"]);
export const CHAIN_AUTHORITY_SCHEMES = new Set(["delegation-scope-v1"]);

const SHA256_DIGEST = /^sha256:[0-9a-f]{64}$/;
const BYTES32 = /^0x[0-9a-f]{64}$/;

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

export function createAuthorityWorkLink({ authorityReceiptId, actionRef, traceLink, workReference }) {
  validateAipouReference(workReference);
  return {
    scheme: AUTHORITY_WORK_LINK_SCHEME,
    relation: "authorized_then_work_recorded",
    authority: { receiptId: authorityReceiptId, actionRef, phase: "pre_action" },
    work: {
      receiptId: workReference.workReceiptId,
      factId: workReference.factId,
      phase: "post_work"
    },
    traceLink
  };
}

export function validateAuthorityWorkLink(link, workReference) {
  validateAipouReference(workReference);
  if (link.scheme !== AUTHORITY_WORK_LINK_SCHEME) {
    throw new Error("Unsupported authority/work link scheme");
  }
  if (link.relation !== "authorized_then_work_recorded") {
    throw new Error("Unsupported authority/work relation");
  }
  if (link.authority?.phase !== "pre_action" || link.work?.phase !== "post_work") {
    throw new Error("Authority must precede post-work evidence");
  }
  if (!link.authority.receiptId || !link.authority.actionRef || !link.traceLink) {
    throw new Error("Authority/work links require receipt, action, and trace references");
  }
  if (!link.work.receiptId || !link.work.factId) {
    throw new Error("Authority/work links require work receipt and fact references");
  }
  if (link.authority.receiptId === link.work.receiptId) {
    throw new Error("Authority and work receipts must be separate artifacts");
  }
  if (link.work.receiptId !== workReference.workReceiptId || link.work.factId !== workReference.factId) {
    throw new Error("Authority/work link does not match the work receipt");
  }
  for (const field of ["claimStatus", "rewardAmount", "claimReceiptId", "settlementTxHash"]) {
    if (field in link.authority) {
      throw new Error("Claim and reward fields cannot establish authority");
    }
  }
  return true;
}

export function validateAuthorityWorkConformanceLink(link, workReference) {
  validateAuthorityWorkLink(link, workReference);
  if (link.authority.evidenceClass !== "chain_derivable" ||
      !CHAIN_AUTHORITY_SCHEMES.has(link.authority.scheme)) {
    throw new Error("Conformance authority must use a supported chain-derivable scheme");
  }
  if (!link.authority.subject?.kind || !link.authority.subject?.id ||
      !BYTES32.test(link.authority.factId || "")) {
    throw new Error("Conformance authority requires a subject and deterministic factId");
  }
  if (link.work.evidenceClass !== AIPOU_EVIDENCE_CLASS || link.work.scheme !== AIPOU_RECEIPT_SCHEME) {
    throw new Error("Conformance work evidence must remain issuer_asserted aipou-receipt-v1");
  }
  if (link.work.subject?.kind !== workReference.subject?.kind ||
      link.work.subject?.id !== workReference.subject?.id) {
    throw new Error("Conformance work subject does not match the AIPOU receipt");
  }
  if (link.work.preActionFactId !== link.authority.factId) {
    throw new Error("Post-work evidence must reference the authority factId");
  }
  return true;
}

export function validateEnforcementCheck(check, authorityWorkLink) {
  if (check.scheme !== ENFORCEMENT_CHECK_SCHEME) {
    throw new Error("Unsupported enforcement check scheme");
  }
  if (check.evidenceClass !== AIPOU_EVIDENCE_CLASS) {
    throw new Error("Enforcement checks must remain issuer_asserted");
  }
  if (check.relation !== "pre_action_receipt_required") {
    throw new Error("Unsupported enforcement relation");
  }
  if (check.relianceBoundary !== "enforcement-point-test-only") {
    throw new Error("Enforcement checks must state their narrow reliance boundary");
  }
  if (!ENFORCEMENT_VERIFICATION_STATUSES.has(check.verificationStatus)) {
    throw new Error("Unsupported enforcement verification status");
  }
  if (check.authorityReceiptId !== authorityWorkLink.authority?.receiptId ||
      check.actionRef !== authorityWorkLink.authority?.actionRef) {
    throw new Error("Enforcement check does not match the authority artifact");
  }
  if (!check.enforcementPoint?.kind || !check.enforcementPoint?.id) {
    throw new Error("Enforcement checks require a concrete enforcement point");
  }
  if (!SHA256_DIGEST.test(check.policyDigest || "")) {
    throw new Error("Enforcement checks require a lowercase SHA-256 policy digest");
  }

  const withoutAuthority = check.observations?.withoutAuthority;
  const withAuthority = check.observations?.withAuthority;
  if (withoutAuthority?.attempted !== true || withoutAuthority?.authorityReceiptPresent !== false ||
      withoutAuthority?.outcome !== "denied" || !SHA256_DIGEST.test(withoutAuthority?.evidenceDigest || "")) {
    throw new Error("The no-authority attempt must be observed and denied with digest-bound evidence");
  }
  if (withAuthority?.attempted !== true || withAuthority?.authorityReceiptPresent !== true ||
      withAuthority?.authorityReceiptId !== check.authorityReceiptId || withAuthority?.outcome !== "allowed" ||
      !SHA256_DIGEST.test(withAuthority?.evidenceDigest || "")) {
    throw new Error("The authorized attempt must be observed and allowed with digest-bound evidence");
  }
  if (check.verificationStatus === "external_verified" &&
      (!check.externalVerifier?.id || !SHA256_DIGEST.test(check.externalVerifier?.evidenceDigest || ""))) {
    throw new Error("External verification requires a verifier ID and evidence digest");
  }
  for (const field of ["claimStatus", "rewardAmount", "claimReceiptId", "settlementTxHash"]) {
    if (field in check) throw new Error("Claim and reward fields cannot establish enforcement");
  }
  return true;
}

import { createHash, createPublicKey } from "node:crypto";

export const AIPOU_EVIDENCE_CLASS = "issuer_asserted";
export const AIPOU_RECEIPT_SCHEME = "aipou-receipt-v1";
export const AUTHORITY_WORK_LINK_SCHEME = "aipou-authority-work-link-v1";
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

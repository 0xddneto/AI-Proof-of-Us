import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import test from "node:test";
import {
  AIPOU_EVIDENCE_CLASS,
  AIPOU_RECEIPT_SCHEME,
  createAuthorityWorkLink,
  deriveFactId,
  validateActiveFactSet,
  validateAipouReference,
  validateAuthorityWorkLink
} from "./receipt-reference.mjs";

const publicKey = generateKeyPairSync("ed25519").publicKey
  .export({ format: "pem", type: "spki" })
  .toString();
const nonce = `0x${"12".repeat(32)}`;
const base = {
  workReceiptId: `0x${"34".repeat(32)}`,
  receiptId: `0x${"34".repeat(32)}`,
  evidenceClass: AIPOU_EVIDENCE_CLASS,
  scheme: AIPOU_RECEIPT_SCHEME,
  subject: { kind: "wallet", id: "eip155:8453:0xabc" },
  factId: deriveFactId(publicKey, nonce),
  registryStatus: "active"
};

const authorityWorkLink = createAuthorityWorkLink({
  authorityReceiptId: `0x${"56".repeat(32)}`,
  actionRef: "autogen:canonical-envelope:run-123",
  traceLink: "trace:run-123",
  workReference: base
});

test("factId is deterministic for collector and nonce", () => {
  assert.equal(deriveFactId(publicKey, nonce), deriveFactId(publicKey, nonce.toUpperCase()));
});

test("rejects unknown schemes and mismatched evidence classes", () => {
  assert.throws(() => validateAipouReference({ ...base, scheme: "aipou-receipt-v2" }));
  assert.throws(() => validateAipouReference({ ...base, evidenceClass: "chain_derivable" }));
});

test("rejects two active records for the same subject and fact", () => {
  assert.throws(() => validateActiveFactSet([base, { ...base }]));
});

test("treats revoked as terminal and superseded as a version-chain link", () => {
  assert.throws(() => validateAipouReference({ ...base, registryStatus: "revoked", supersededBy: "0xnext" }));
  assert.throws(() => validateAipouReference({ ...base, registryStatus: "superseded" }));
  assert.equal(validateAipouReference({ ...base, registryStatus: "superseded", supersededBy: "0xnext" }), true);
});

test("links pre-action authority to a separate post-work receipt", () => {
  assert.equal(validateAuthorityWorkLink(authorityWorkLink, base), true);
});

test("rejects post-work evidence masquerading as authority", () => {
  assert.throws(() => validateAuthorityWorkLink({
    ...authorityWorkLink,
    authority: { ...authorityWorkLink.authority, phase: "post_work" }
  }, base));
  assert.throws(() => validateAuthorityWorkLink({
    ...authorityWorkLink,
    authority: { ...authorityWorkLink.authority, receiptId: base.workReceiptId }
  }, base));
});

test("rejects mismatched work and claim fields presented as authority", () => {
  assert.throws(() => validateAuthorityWorkLink({
    ...authorityWorkLink,
    work: { ...authorityWorkLink.work, factId: `0x${"78".repeat(32)}` }
  }, base));
  assert.throws(() => validateAuthorityWorkLink({
    ...authorityWorkLink,
    authority: { ...authorityWorkLink.authority, rewardAmount: "100" }
  }, base));
});

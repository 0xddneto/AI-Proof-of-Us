import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import test from "node:test";
import {
  AIPOU_EVIDENCE_CLASS,
  AIPOU_RECEIPT_SCHEME,
  ENFORCEMENT_CHECK_SCHEME,
  createAuthorityWorkLink,
  deriveFactId,
  runEnforcementBenchmark,
  validateActiveFactSet,
  validateAipouReference,
  validateAuthorityWorkLink,
  validateAuthorityWorkConformanceLink,
  validateEnforcementCheck
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

const enforcementCheck = {
  scheme: ENFORCEMENT_CHECK_SCHEME,
  evidenceClass: AIPOU_EVIDENCE_CLASS,
  relation: "pre_action_receipt_required",
  authorityReceiptId: authorityWorkLink.authority.receiptId,
  actionRef: authorityWorkLink.authority.actionRef,
  enforcementPoint: {
    kind: "protected_branch",
    id: "github:example/project:refs/heads/main"
  },
  policyDigest: `sha256:${"90".repeat(32)}`,
  observations: {
    withoutAuthority: {
      attempted: true,
      authorityReceiptPresent: false,
      outcome: "denied",
      evidenceDigest: `sha256:${"91".repeat(32)}`
    },
    withAuthority: {
      attempted: true,
      authorityReceiptPresent: true,
      authorityReceiptId: authorityWorkLink.authority.receiptId,
      outcome: "allowed",
      evidenceDigest: `sha256:${"92".repeat(32)}`
    }
  },
  verificationStatus: "local_test",
  relianceBoundary: "enforcement-point-test-only"
};

const conformanceLink = {
  ...authorityWorkLink,
  authority: {
    ...authorityWorkLink.authority,
    evidenceClass: "chain_derivable",
    scheme: "delegation-scope-v1",
    subject: { kind: "delegation", id: "eip155:8453:registry:owner:signer" },
    factId: `0x${"93".repeat(32)}`
  },
  work: {
    ...authorityWorkLink.work,
    evidenceClass: AIPOU_EVIDENCE_CLASS,
    scheme: AIPOU_RECEIPT_SCHEME,
    subject: base.subject,
    preActionFactId: `0x${"93".repeat(32)}`
  }
};

test("factId is deterministic for collector and nonce", () => {
  assert.equal(deriveFactId(publicKey, nonce), deriveFactId(publicKey, nonce.toUpperCase()));
  assert.notEqual(deriveFactId(publicKey, nonce), deriveFactId(publicKey, `0x${"13".repeat(32)}`));
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

test("records a point-specific enforcement test separately from receipt evidence", () => {
  assert.equal(validateEnforcementCheck(enforcementCheck, authorityWorkLink), true);
});

test("executes the protected action without and with the authority receipt", async () => {
  const protectedMutations = [];
  const check = await runEnforcementBenchmark({
    authorityWorkLink,
    enforcementPoint: enforcementCheck.enforcementPoint,
    policyDigest: enforcementCheck.policyDigest,
    attemptAction: async ({ authorityReceiptId }) => {
      if (authorityReceiptId !== authorityWorkLink.authority.receiptId) {
        return { outcome: "denied", reason: "missing_or_invalid_authority" };
      }
      protectedMutations.push(authorityWorkLink.authority.actionRef);
      return { outcome: "allowed", result: "protected_mutation_applied" };
    }
  });

  assert.equal(check.observations.withoutAuthority.outcome, "denied");
  assert.equal(check.observations.withAuthority.outcome, "allowed");
  assert.deepEqual(protectedMutations, [authorityWorkLink.authority.actionRef]);
});

test("executable benchmark fails when the untrusted path reaches the action", async () => {
  await assert.rejects(() => runEnforcementBenchmark({
    authorityWorkLink,
    enforcementPoint: enforcementCheck.enforcementPoint,
    policyDigest: enforcementCheck.policyDigest,
    attemptAction: async () => ({ outcome: "allowed" })
  }));
});

test("fails closed when execution without authority is possible", () => {
  assert.throws(() => validateEnforcementCheck({
    ...enforcementCheck,
    observations: {
      ...enforcementCheck.observations,
      withoutAuthority: { ...enforcementCheck.observations.withoutAuthority, outcome: "allowed" }
    }
  }, authorityWorkLink));
});

test("rejects mismatched authority links and unverifiable external enforcement", () => {
  assert.throws(() => validateEnforcementCheck({
    ...enforcementCheck,
    actionRef: "autogen:canonical-envelope:other-run"
  }, authorityWorkLink));
  assert.throws(() => validateEnforcementCheck({
    ...enforcementCheck,
    verificationStatus: "external_verified"
  }, authorityWorkLink));
});

test("maps a chain-derived authority fact to issuer-asserted post-work evidence", () => {
  assert.equal(validateAuthorityWorkConformanceLink(conformanceLink, base), true);
});

test("fails closed on conformance trust-model downgrade", () => {
  assert.throws(() => validateAuthorityWorkConformanceLink({
    ...conformanceLink,
    authority: { ...conformanceLink.authority, evidenceClass: AIPOU_EVIDENCE_CLASS }
  }, base));
  assert.throws(() => validateAuthorityWorkConformanceLink({
    ...conformanceLink,
    work: { ...conformanceLink.work, evidenceClass: "chain_derivable" }
  }, base));
});

test("fails closed when post-work evidence points to another authority fact", () => {
  assert.throws(() => validateAuthorityWorkConformanceLink({
    ...conformanceLink,
    work: { ...conformanceLink.work, preActionFactId: `0x${"94".repeat(32)}` }
  }, base));
});

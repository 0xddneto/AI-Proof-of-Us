import assert from "node:assert/strict";
import test from "node:test";
import { createPayboxWorkLink } from "./paybox-link.js";

const input = {
  workReceiptId: `0x${"ab".repeat(32)}`,
  payboxOperationId: "pbx_op_synthetic_delivery_001",
  payboxOperationDigest: `sha256:${"cd".repeat(32)}`,
  issuedAt: "2026-07-30T13:30:00.000Z"
};

test("creates a digest-only Paybox to AIPOU work link without payment authority", () => {
  const link = createPayboxWorkLink(input);

  assert.equal(link.scheme, "external-evidence-link-v1");
  assert.equal(link.relation, "supports");
  assert.equal(link.source.id, input.workReceiptId);
  assert.equal(link.target.scheme, "paybox-operation-v1");
  assert.equal(link.target.id, input.payboxOperationId);
  assert.equal(link.target.digest, input.payboxOperationDigest);
  assert.match(link.linkId, /^sha256:[0-9a-f]{64}$/);
  assert.match(link.linkDigest, /^sha256:[0-9a-f]{64}$/);
  assert.equal("wallet" in link, false);
  assert.equal("paymentStatus" in link, false);
  assert.equal("claimStatus" in link, false);
  assert.equal("reward" in link, false);
});

test("is deterministic and changes when the external artifact changes", () => {
  assert.equal(createPayboxWorkLink(input).linkDigest, createPayboxWorkLink(input).linkDigest);
  assert.equal(
    createPayboxWorkLink(input).linkId,
    createPayboxWorkLink({ ...input, issuedAt: "2026-07-30T14:30:00.000Z" }).linkId
  );
  assert.notEqual(
    createPayboxWorkLink(input).linkDigest,
    createPayboxWorkLink({ ...input, issuedAt: "2026-07-30T14:30:00.000Z" }).linkDigest
  );
  assert.notEqual(
    createPayboxWorkLink(input).linkId,
    createPayboxWorkLink({ ...input, payboxOperationDigest: `sha256:${"ef".repeat(32)}` }).linkId
  );
});

test("rejects malformed receipt, digest, opaque reference, and timestamp inputs", () => {
  assert.throws(() => createPayboxWorkLink({ ...input, workReceiptId: "0xabc" }));
  assert.throws(() => createPayboxWorkLink({ ...input, payboxOperationDigest: "sha256:ABC" }));
  assert.throws(() => createPayboxWorkLink({ ...input, payboxOperationId: "" }));
  assert.throws(() => createPayboxWorkLink({ ...input, issuedAt: "not-a-date" }));
});

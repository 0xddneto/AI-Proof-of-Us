import assert from "node:assert/strict";
import test from "node:test";
import { createTechnocoreWorkLink } from "./technocore-link.js";

const input = {
  workReceiptId: `0x${"ab".repeat(32)}`,
  transportArtifactId: "technocore:lobby:receipt-synthetic-001",
  transportArtifactDigest: `sha256:${"cd".repeat(32)}`,
  issuedAt: "2026-08-26T14:30:00.000Z"
};

test("creates a digest-only Technocore to AIPOU work link without transport authority", () => {
  const link = createTechnocoreWorkLink(input);

  assert.equal(link.scheme, "external-evidence-link-v1");
  assert.equal(link.relation, "supports");
  assert.equal(link.source.id, input.workReceiptId);
  assert.equal(link.target.scheme, "technocore-room-receipt-v1");
  assert.equal(link.target.id, input.transportArtifactId);
  assert.equal(link.target.digest, input.transportArtifactDigest);
  assert.match(link.linkId, /^sha256:[0-9a-f]{64}$/);
  assert.match(link.linkDigest, /^sha256:[0-9a-f]{64}$/);
  assert.equal("did" in link, false);
  assert.equal("signature" in link, false);
  assert.equal("deliveryStatus" in link, false);
  assert.equal("claimStatus" in link, false);
});

test("is deterministic and changes when the transport artifact changes", () => {
  assert.equal(createTechnocoreWorkLink(input).linkDigest, createTechnocoreWorkLink(input).linkDigest);
  assert.equal(
    createTechnocoreWorkLink(input).linkId,
    createTechnocoreWorkLink({ ...input, issuedAt: "2026-08-26T15:30:00.000Z" }).linkId
  );
  assert.notEqual(
    createTechnocoreWorkLink(input).linkDigest,
    createTechnocoreWorkLink({ ...input, issuedAt: "2026-08-26T15:30:00.000Z" }).linkDigest
  );
  assert.notEqual(
    createTechnocoreWorkLink(input).linkId,
    createTechnocoreWorkLink({ ...input, transportArtifactDigest: `sha256:${"ef".repeat(32)}` }).linkId
  );
});

test("rejects malformed receipt, digest, opaque reference, and timestamp inputs", () => {
  assert.throws(() => createTechnocoreWorkLink({ ...input, workReceiptId: "0xabc" }));
  assert.throws(() => createTechnocoreWorkLink({ ...input, transportArtifactDigest: "sha256:ABC" }));
  assert.throws(() => createTechnocoreWorkLink({ ...input, transportArtifactId: "" }));
  assert.throws(() => createTechnocoreWorkLink({ ...input, issuedAt: "not-a-date" }));
});

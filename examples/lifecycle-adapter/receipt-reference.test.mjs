import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import test from "node:test";
import {
  AIPOU_EVIDENCE_CLASS,
  AIPOU_RECEIPT_SCHEME,
  deriveFactId,
  validateActiveFactSet,
  validateAipouReference
} from "./receipt-reference.mjs";

const publicKey = generateKeyPairSync("ed25519").publicKey
  .export({ format: "pem", type: "spki" })
  .toString();
const nonce = `0x${"12".repeat(32)}`;
const base = {
  evidenceClass: AIPOU_EVIDENCE_CLASS,
  scheme: AIPOU_RECEIPT_SCHEME,
  subject: { kind: "wallet", id: "eip155:8453:0xabc" },
  factId: deriveFactId(publicKey, nonce),
  registryStatus: "active"
};

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

import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  createExternalEvidenceLink,
  sha256Digest,
  signExternalEvidenceLink,
  validateArtifactContent,
  validateExternalEvidenceLink
} from "./external-evidence-link.mjs";

const issuedAt = "2026-07-14T15:30:00.000Z";
const canonicalVectors = JSON.parse(readFileSync(
  new URL("./external-evidence-test-vectors.json", import.meta.url),
  "utf8"
));
const aipouReceipt = Buffer.from("aipou-receipt-fixture-v1");
const aiirBundle = Buffer.from("aiir-bundle-fixture-v1");

const aipouAiirLink = createExternalEvidenceLink({
  relation: "input_to",
  issuedAt,
  source: {
    kind: "receipt",
    scheme: "aipou-receipt-v1",
    id: "0xaipou-fixture",
    digest: sha256Digest(aipouReceipt)
  },
  target: {
    kind: "bundle",
    scheme: "aiir-agent-receipt-bundle-v1",
    id: "aiir:fixture:1",
    digest: sha256Digest(aiirBundle)
  }
});

const nonAipouLinks = [
  createExternalEvidenceLink({
    relation: "supports",
    issuedAt,
    source: {
      kind: "attestation",
      scheme: "slsa-provenance-v1",
      id: "slsa:fixture:1",
      digest: sha256Digest("slsa-provenance-fixture")
    },
    target: {
      kind: "artifact",
      scheme: "oci-image-manifest-v1",
      id: "oci:fixture:1",
      digest: sha256Digest("oci-manifest-fixture")
    }
  }),
  createExternalEvidenceLink({
    relation: "output_of",
    issuedAt,
    source: {
      kind: "receipt",
      scheme: "x402-payment-receipt-v1",
      id: "x402:fixture:1",
      digest: sha256Digest("x402-payment-fixture")
    },
    target: {
      kind: "trace",
      scheme: "opentelemetry-trace-v1",
      id: "otel:fixture:1",
      digest: sha256Digest("otel-trace-fixture")
    }
  })
];

test("creates a digest-bound AIPOU to AIIR artifact relation", () => {
  assert.equal(validateExternalEvidenceLink(aipouAiirLink), true);
  assert.equal(validateArtifactContent(aipouAiirLink.source, aipouReceipt), true);
  assert.equal(validateArtifactContent(aipouAiirLink.target, aiirBundle), true);
});

test("is scheme-neutral across two non-AIPOU receipt families", () => {
  for (const link of nonAipouLinks) {
    assert.equal(validateExternalEvidenceLink(link), true);
  }
});

test("matches the published canonical link digests", () => {
  assert.deepEqual(
    [aipouAiirLink, ...nonAipouLinks].map((link) => link.linkDigest),
    canonicalVectors.map((link) => link.linkDigest)
  );
  for (const vector of canonicalVectors) {
    assert.equal(validateExternalEvidenceLink(vector), true);
  }
});

test("signs and verifies the canonical link digest with Ed25519", () => {
  const { privateKey } = generateKeyPairSync("ed25519");
  const signed = signExternalEvidenceLink(aipouAiirLink, privateKey);
  assert.equal(validateExternalEvidenceLink(signed, { requireSignature: true }), true);
  assert.throws(() => validateExternalEvidenceLink({
    ...signed,
    attestation: { ...signed.attestation, signature: Buffer.alloc(64).toString("base64") }
  }, { requireSignature: true }));
});

test("fails closed on digest mutation, raw content, and unsupported relations", () => {
  assert.throws(() => validateExternalEvidenceLink({
    ...aipouAiirLink,
    source: { ...aipouAiirLink.source, id: "mutated" }
  }));
  assert.throws(() => createExternalEvidenceLink({
    relation: "endorses",
    issuedAt,
    source: aipouAiirLink.source,
    target: aipouAiirLink.target
  }));
  assert.throws(() => createExternalEvidenceLink({
    relation: "supports",
    issuedAt,
    source: { ...aipouAiirLink.source, rawPrompt: "private" },
    target: aipouAiirLink.target
  }));
  assert.throws(() => validateArtifactContent(aipouAiirLink.source, "different-content"));
});

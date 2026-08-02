import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  FOREIGN_ATTESTATION_VERDICTS,
  createForeignAttestation,
  hostMaterialDigest,
  signForeignAttestation,
  validateForeignAttestationEnvelope,
  verifyForeignAttestation
} from "./foreign-attestation.mjs";
import {
  attachExternalAttestationToLineage,
  createExternalAttestationReference
} from "./lineage-attestation.mjs";

const fixtures = JSON.parse(readFileSync(
  new URL("./foreign-attestation-fixtures.json", import.meta.url),
  "utf8"
));
const { privateKey, publicKey } = generateKeyPairSync("ed25519");

test("verifies a signed foreign envelope without upgrading its trust", () => {
  const signed = signForeignAttestation(fixtures.positive, privateKey);
  const result = verifyForeignAttestation(signed, { issuerPublicKey: publicKey });

  assert.equal(result.verdict, FOREIGN_ATTESTATION_VERDICTS.VERIFIED_FOREIGN);
  assert.equal(result.effectiveTrustClass, "third_party");
  assert.equal(result.claimedTrustClass, "third_party");
});

test("returns unverifiable for absent keys, malformed envelopes, and forged signatures", () => {
  assert.equal(
    verifyForeignAttestation(fixtures.unverifiable).verdict,
    FOREIGN_ATTESTATION_VERDICTS.UNVERIFIABLE
  );

  const signed = signForeignAttestation(fixtures.positive, privateKey);
  const forged = {
    ...signed,
    signature: {
      ...signed.signature,
      signature: Buffer.alloc(64).toString("base64")
    }
  };
  const forgedResult = verifyForeignAttestation(forged, { issuerPublicKey: publicKey });
  assert.equal(forgedResult.verdict, FOREIGN_ATTESTATION_VERDICTS.UNVERIFIABLE);

  const malformed = { ...fixtures.positive, contentHash: "sha256:bad" };
  assert.equal(
    verifyForeignAttestation(malformed, { issuerPublicKey: publicKey }).verdict,
    FOREIGN_ATTESTATION_VERDICTS.UNVERIFIABLE
  );
});

test("rejects an envelope that asserts local issuance", () => {
  const result = verifyForeignAttestation(fixtures.rejectedLocalIssuance, {
    issuerPublicKey: publicKey
  });

  assert.equal(result.verdict, FOREIGN_ATTESTATION_VERDICTS.REJECTED);
  assert.match(result.reason, /local issuance/);
});

test("fails closed on unknown fields and private settlement content", () => {
  for (const field of ["raw", "prompt", "output", "wallet", "rewardAmount", "claimStatus"]) {
    assert.throws(() => validateForeignAttestationEnvelope({
      ...fixtures.positive,
      [field]: "forbidden"
    }));
  }
  assert.throws(() => validateForeignAttestationEnvelope({
    ...fixtures.positive,
    unsupported: true
  }));
});

test("keeps the host-chain verification input byte-identical with or without foreign metadata", () => {
  const lineage = {
    artifactId: "artifact:report:42",
    metadata: {
      status: "verified",
      externalAttestations: []
    }
  };
  const reference = createExternalAttestationReference({
    scheme: "bernstein-foreign-attestation-v1",
    ref: "bernstein:attestation:42",
    issuer: { kind: "bernstein-issuer", id: "bernstein:fixture-issuer" }
  });
  const populated = attachExternalAttestationToLineage(lineage, reference);

  assert.equal(hostMaterialDigest(lineage), hostMaterialDigest(populated));
});

test("preserves the claimed subject and content hash as typed foreign fields", () => {
  const attestation = createForeignAttestation({
    issuer: fixtures.positive.issuer,
    claimedSubject: fixtures.positive.claimedSubject,
    contentHash: fixtures.positive.contentHash,
    trustClass: "workspace"
  });
  assert.equal(attestation.claimedSubject.id, "artifact:report:42");
  assert.equal(attestation.contentHash, fixtures.positive.contentHash);
  assert.equal(verifyForeignAttestation(
    signForeignAttestation(attestation, privateKey),
    { issuerPublicKey: publicKey }
  ).effectiveTrustClass, "third_party");
});

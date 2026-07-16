import assert from "node:assert/strict";
import test from "node:test";
import {
  attachExternalAttestationToLineage,
  createExternalAttestationReference,
  mirrorLineageAttestationsToRunSummary,
  validateExternalAttestationReference,
  validateLineageAttestationMirror
} from "./lineage-attestation.mjs";

const aipouReference = createExternalAttestationReference({
  scheme: "aipou-receipt-v1",
  ref: `0x${"34".repeat(32)}`,
  issuer: { kind: "collector", id: `sha256:${"56".repeat(32)}` }
});

const slsaReference = createExternalAttestationReference({
  scheme: "slsa-provenance-v1",
  ref: "https://example.invalid/attestations/build-42",
  issuer: { kind: "builder", id: "builder:example:release" }
});

test("attaches an opaque issuer-asserted reference to artifact lineage", () => {
  const lineage = attachExternalAttestationToLineage({
    artifactId: "artifact:report:42",
    metadata: { mediaType: "application/pdf" }
  }, aipouReference);

  assert.deepEqual(lineage.metadata.externalAttestations, [aipouReference]);
  assert.equal(lineage.metadata.mediaType, "application/pdf");
});

test("mirrors the exact lineage references into the run audit summary", () => {
  const lineage = attachExternalAttestationToLineage({ artifactId: "artifact:report:42" }, aipouReference);
  const summary = mirrorLineageAttestationsToRunSummary(lineage, {
    runId: "run:42",
    metadata: { status: "completed" }
  });

  assert.equal(validateLineageAttestationMirror(lineage, summary), true);
  assert.deepEqual(summary.metadata.externalAttestations, lineage.metadata.externalAttestations);
  assert.equal(summary.metadata.status, "completed");
});

test("is provider-neutral, deterministic, and idempotent", () => {
  const first = attachExternalAttestationToLineage(
    attachExternalAttestationToLineage({ artifactId: "artifact:bundle:7" }, aipouReference),
    slsaReference
  );
  const second = attachExternalAttestationToLineage(
    attachExternalAttestationToLineage({ artifactId: "artifact:bundle:7" }, slsaReference),
    aipouReference
  );
  const duplicate = attachExternalAttestationToLineage(first, aipouReference);

  assert.deepEqual(first, second);
  assert.deepEqual(duplicate, first);
});

test("fails closed on trust upgrades, raw content, wallet, reward, and claim fields", () => {
  assert.throws(() => validateExternalAttestationReference({
    ...aipouReference,
    trustModel: "chain_derivable"
  }));
  for (const field of ["raw", "prompt", "wallet", "rewardAmount", "claimStatus"]) {
    assert.throws(() => validateExternalAttestationReference({
      ...aipouReference,
      [field]: "forbidden"
    }));
  }
});

test("fails closed when the run summary mirrors a different reference", () => {
  const lineage = attachExternalAttestationToLineage({ artifactId: "artifact:report:42" }, aipouReference);
  const summary = mirrorLineageAttestationsToRunSummary(lineage, { runId: "run:42" });
  summary.metadata.externalAttestations[0] = {
    ...summary.metadata.externalAttestations[0],
    ref: `0x${"78".repeat(32)}`
  };

  assert.throws(() => validateLineageAttestationMirror(lineage, summary));
});

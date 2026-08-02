import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { validateExternalEvidenceLink, verifyExternalEvidenceArtifacts } from "./external-evidence-link.mjs";
import { validateAuthorityWorkLink } from "./receipt-reference.mjs";

const fixtures = JSON.parse(readFileSync(
  new URL("./agentgraph-cross-fixtures.json", import.meta.url),
  "utf8"
));

const aipouWorkReceiptBytes = Buffer.from("aipou-work-receipt-fixture-v0.4");
const agentgraphEnvelopeBytes = Buffer.from("agentgraph-canonical-envelope-run-123");

test("freezes the public actionRef and authority/work link shape", () => {
  assert.equal(fixtures.version, "v0.4-canonical");
  assert.equal(
    fixtures.validAuthorityWorkLink.authority.actionRef,
    "autogen:canonical-envelope:run-123"
  );
  assert.equal(
    validateAuthorityWorkLink(fixtures.validAuthorityWorkLink, fixtures.workReference),
    true
  );
});

test("fails closed on phase inversion in the public cross-fixture", () => {
  assert.throws(() => validateAuthorityWorkLink(
    fixtures.phaseInversionVariant,
    fixtures.workReference
  ));
});

test("validates the digest-bound AgentGraph to AIPOU evidence link", async () => {
  assert.equal(validateExternalEvidenceLink(fixtures.externalEvidenceLink), true);
  assert.equal(
    await verifyExternalEvidenceArtifacts(fixtures.externalEvidenceLink, {
      resolveArtifact: async (reference) => {
        if (reference.id === fixtures.externalEvidenceLink.source.id) {
          return aipouWorkReceiptBytes;
        }
        if (reference.id === fixtures.externalEvidenceLink.target.id) {
          return agentgraphEnvelopeBytes;
        }
        return null;
      },
      verifyArtifact: async () => true
    }),
    true
  );
});

test("fails closed on the AIPOU-side artifact digest mismatch", async () => {
  assert.equal(validateExternalEvidenceLink(fixtures.digestMismatchVariant), true);
  await assert.rejects(
    verifyExternalEvidenceArtifacts(fixtures.digestMismatchVariant, {
      resolveArtifact: async (reference) => {
        if (reference.id === fixtures.digestMismatchVariant.source.id) {
          return aipouWorkReceiptBytes;
        }
        if (reference.id === fixtures.digestMismatchVariant.target.id) {
          return agentgraphEnvelopeBytes;
        }
        return null;
      },
      verifyArtifact: async () => true
    }),
    /Artifact content does not match its digest/
  );
});

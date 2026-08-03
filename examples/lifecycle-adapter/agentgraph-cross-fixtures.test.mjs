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

test("freezes the published AgentGraph actionRef and authority/work link shape", () => {
  assert.equal(fixtures.version, "v0.5-agentgraph-published");
  assert.equal(
    fixtures.validAuthorityWorkLink.authority.actionRef,
    "sha256:31d477f761ee3f1cf943acba4d78980bd566ab175ee5f92f53c1e1b1aeb26cdd"
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

test("validates the published AgentGraph to AIPOU evidence link without treating it as remote verification", async () => {
  assert.equal(validateExternalEvidenceLink(fixtures.externalEvidenceLink), true);
  assert.equal(fixtures.externalEvidenceLink.linkDigest, "sha256:30759a953c665718870d16fd3433f495f038b9c473e1e82d6fbf2945d037cb39");
  await assert.rejects(
    verifyExternalEvidenceArtifacts(fixtures.externalEvidenceLink, {
      resolveArtifact: async (reference) => {
        return null;
      },
      verifyArtifact: async () => true
    }),
    /Source artifact could not be resolved/
  );
});

test("fails closed on the published AIPOU-side digest mismatch", () => {
  assert.throws(
    () => validateExternalEvidenceLink(fixtures.digestMismatchVariant),
    /External evidence link digest mismatch/
  );
});

test("verifies the self-contained synthetic resolver fixture separately", async () => {
  assert.equal(validateExternalEvidenceLink(fixtures.localSyntheticEvidenceLink), true);
  assert.equal(
    await verifyExternalEvidenceArtifacts(fixtures.localSyntheticEvidenceLink, {
      resolveArtifact: async (reference) => {
        if (reference.id === fixtures.localSyntheticEvidenceLink.source.id) {
          return aipouWorkReceiptBytes;
        }
        if (reference.id === fixtures.localSyntheticEvidenceLink.target.id) {
          return agentgraphEnvelopeBytes;
        }
        return null;
      },
      verifyArtifact: async () => true
    }),
    true
  );
});

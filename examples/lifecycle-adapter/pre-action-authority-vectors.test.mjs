import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const vectors = JSON.parse(readFileSync(
  new URL("./pre-action-authority-vectors.json", import.meta.url),
  "utf8"
));

test("keeps pre-action authority vectors complete and directionally safe", () => {
  assert.equal(vectors.version, "0.1.0");
  assert.deepEqual(
    vectors.vectors.map(({ id, expect }) => ({ id, expect })),
    [
      { id: "valid-composition", expect: "accept" },
      { id: "neg-phase-inversion", expect: "reject" },
      { id: "neg-call-digest-mismatch", expect: "reject" },
      { id: "neg-replay", expect: "reject" },
      { id: "neg-postwork-to-preaction-tier-upgrade", expect: "reject" }
    ]
  );

  const valid = vectors.vectors[0];
  assert.equal(
    valid.phase1_pre_action_fact.preActionFactId,
    valid.phase2_work_receipt.references.preActionFactId
  );
  assert.equal(
    valid.phase1_pre_action_fact.decisionReceiptRef,
    valid.phase2_work_receipt.references.decisionReceiptRef
  );
  assert.ok(Date.parse(valid.phase1_pre_action_fact.expiry) > Date.now());
  assert.equal(valid.phase2_work_receipt.asserts_root_authority, false);
  assert.equal(valid.phase2_work_receipt.asserts_effect_proof, false);
  assert.equal(valid.phase2_work_receipt.asserts_tier_upgrade, false);
});

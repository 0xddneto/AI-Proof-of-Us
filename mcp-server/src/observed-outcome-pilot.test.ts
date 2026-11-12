import assert from "node:assert/strict";
import test from "node:test";
import { runObservedOutcomePilot } from "./observed-outcome-pilot.js";
import { sha256Hex } from "./canonical.js";

test("observed-outcome pilot does not upgrade local execution into delivery or acceptance", async () => {
  const result = await runObservedOutcomePilot();
  assert.equal(result.mode, "observed_outcome_pilot");
  assert.match(result.workReceiptId, /^0x[0-9a-f]{64}$/);
  assert.deepEqual(result.hostObservation, {
    source: "local_file_readback",
    outputHash: sha256Hex('{"artifact":"pilot-output-reference"}')
  });
  assert.deepEqual(result.evidence, {
    receiptIntegrity: "VERIFIED",
    walletAuthorization: "VERIFIED",
    collectorSignature: "VERIFIED",
    hostExecution: "OBSERVED",
    delivery: "UNKNOWN",
    businessAcceptance: "ABSENT",
    settlement: "ABSENT",
    externalEffect: "UNKNOWN"
  });
  assert.deepEqual(result.safety, {
    networkRequired: false,
    fundsMoved: false,
    claimSubmitted: false,
    deliveryClaimed: false,
    acceptanceClaimed: false
  });
});

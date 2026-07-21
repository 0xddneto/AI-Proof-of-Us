import assert from "node:assert/strict";
import test from "node:test";
import { runLocalReceiptDemo } from "./demo.js";

test("one-command demo creates a verified receipt without persistent secrets or claims", async () => {
  const previousPrivateKey = process.env.AIPOU_AGENT_PRIVATE_KEY;
  const previousDataDir = process.env.AIPOU_DATA_DIR;
  const result = await runLocalReceiptDemo();

  assert.equal(result.mode, "local_receipt_demo");
  assert.match(result.wallet, /^0x[0-9a-fA-F]{40}$/);
  assert.match(result.frameworkMetadata.aipou.workReceiptId, /^0x[0-9a-f]{64}$/);
  assert.equal(
    result.frameworkMetadata.aipou.workReceiptId,
    result.frameworkMetadata.aipou.receiptId
  );
  assert.match(result.frameworkMetadata.aipou.factId, /^0x[0-9a-f]{64}$/);
  assert.deepEqual(result.verification, {
    walletAuthorization: true,
    collectorSignature: true
  });
  assert.deepEqual(result.safety, {
    networkRequired: false,
    fundsMoved: false,
    claimSubmitted: false,
    rawPromptStored: false,
    rawOutputStored: false,
    privateKeyPrinted: false
  });
  assert.equal(process.env.AIPOU_AGENT_PRIVATE_KEY, previousPrivateKey);
  assert.equal(process.env.AIPOU_DATA_DIR, previousDataDir);
});

import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { Wallet, keccak256, toUtf8Bytes } from "ethers";
import { beginTask, completeTask } from "./receipts.js";
import { verifyAipouReceipt } from "./receipt-verifier.js";

test("independent receipt verifier separates cryptographic receipt facts from outcome claims", async () => {
  process.env.AIPOU_DATA_DIR = await mkdtemp(path.join(tmpdir(), "aipou-verifier-"));
  process.env.AIPOU_AGENT_PRIVATE_KEY = Wallet.createRandom().privateKey;
  const session = await beginTask({
    provider: "local",
    model: "verifier-test",
    client: "test-client",
    taskHash: keccak256(toUtf8Bytes("verify this receipt")),
    chainId: 8453,
    verifyingContract: Wallet.createRandom().address
  });
  const receipt = await completeTask({
    nonce: session.nonce,
    inputTokens: 100,
    outputTokens: 20,
    durationSeconds: 2,
    outputHash: keccak256(toUtf8Bytes("verifier output"))
  });

  const verified = verifyAipouReceipt(receipt);
  assert.equal(verified.valid, true);
  assert.equal(verified.workReceiptId, receipt.receiptId);
  assert.equal(verified.claimedWorkReceiptId, null);
  assert.deepEqual(verified.evidence, {
    receiptIntegrity: "VERIFIED",
    walletAuthorization: "VERIFIED",
    collectorSignature: "VERIFIED",
    hostExecution: "UNKNOWN",
    delivery: "UNKNOWN",
    businessAcceptance: "ABSENT",
    settlement: "ABSENT",
    externalEffect: "UNKNOWN"
  });

  const tampered = verifyAipouReceipt({ ...receipt, outputHash: `0x${"ef".repeat(32)}` });
  assert.equal(tampered.valid, false);
  assert.equal(tampered.workReceiptId, null);
  assert.equal(tampered.claimedWorkReceiptId, receipt.receiptId);
  assert.ok(tampered.errors.some((error) => /receiptId/.test(error)));
  assert.ok(tampered.errors.some((error) => /collector signature/.test(error)));
});

test("malformed, deeply nested and oversized receipts fail closed without crypto work", () => {
  for (const candidate of [null, [], { receiptId: `0x${"ab".repeat(32)}`, rawPrompt: "private" }, { collectorPublicKey: "x".repeat(9000) }, { providerEvidence: { keyId: "x", signature: {} } }]) {
    const result = verifyAipouReceipt(candidate);
    assert.equal(result.valid, false);
    assert.equal(result.workReceiptId, null);
  }
});

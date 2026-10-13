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
  assert.deepEqual(verified.evidence, {
    receiptIntegrity: "VERIFIED",
    walletAuthorization: "VERIFIED",
    collectorSignature: "VERIFIED",
    hostExecution: "OBSERVED",
    delivery: "UNKNOWN",
    businessAcceptance: "ABSENT",
    settlement: "ABSENT",
    externalEffect: "UNKNOWN"
  });

  const tampered = verifyAipouReceipt({ ...receipt, outputHash: `0x${"ef".repeat(32)}` });
  assert.equal(tampered.valid, false);
  assert.ok(tampered.errors.some((error) => /receiptId/.test(error)));
  assert.ok(tampered.errors.some((error) => /collector signature/.test(error)));
});

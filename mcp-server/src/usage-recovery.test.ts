import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { Wallet } from "ethers";
import { canonicalJson, sha256Hex } from "./canonical.js";
import { signCollectorPayload } from "./collector.js";
import { localFeedbackSummary } from "./feedback.js";
import { beginTask, completeTask, exportReceipts } from "./receipts.js";
import { verifyAipouReceipt } from "./receipt-verifier.js";
import { markBatchSettled, unsettledReceipts } from "./store.js";
test("unmeasured zero differs from measured zero and recovered receipts are not duplicated", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "aipou-usage-"));
  process.env.AIPOU_DATA_DIR = dir;
  process.env.AIPOU_AGENT_PRIVATE_KEY = Wallet.createRandom().privateKey;
  try {
    const create = (s: string) =>
      beginTask({
        provider: "local",
        model: "test",
        client: "test",
        taskHash: sha256Hex(s),
        chainId: 8453,
        verifyingContract: Wallet.createRandom().address,
      });
    const one = await create("one");
    await assert.rejects(
      completeTask({
        nonce: one.nonce,
        inputTokens: 1,
        outputTokens: 0,
        durationSeconds: 1,
        outputHash: sha256Hex("out"),
        tokenUsageMeasurement: "unmeasured",
      }),
      /zero counts/,
    );
    const receipt = await completeTask({
      nonce: one.nonce,
      inputTokens: 0,
      outputTokens: 0,
      durationSeconds: 1,
      outputHash: sha256Hex("out"),
      tokenUsageMeasurement: "unmeasured",
    });
    assert.equal(receipt.tokenUsageMeasurement, "unmeasured");
    assert.equal(verifyAipouReceipt(receipt).valid, true);
    const {
      tokenUsageMeasurement: _measurement,
      receiptId: _id,
      collectorSignature: _signature,
      ...legacyUnsigned
    } = receipt;
    const legacyId = sha256Hex(canonicalJson(legacyUnsigned));
    const legacy = {
      receiptId: legacyId,
      ...legacyUnsigned,
      collectorSignature: await signCollectorPayload({
        receiptId: legacyId,
        ...legacyUnsigned,
      }),
    };
    assert.equal(
      verifyAipouReceipt(legacy).valid,
      true,
      "legacy receipts remain valid without the new optional field",
    );
    await assert.rejects(
      completeTask({
        nonce: one.nonce,
        inputTokens: 0,
        outputTokens: 0,
        durationSeconds: 1,
        outputHash: receipt.outputHash,
      }),
      /export_ai_receipts/,
    );
    assert.equal(
      (await exportReceipts()).find((r) => r.nonce === one.nonce)?.receiptId,
      receipt.receiptId,
    );
    const two = await create("two");
    const measured = await completeTask({
      nonce: two.nonce,
      inputTokens: 0,
      outputTokens: 0,
      durationSeconds: 1,
      outputHash: sha256Hex("out2"),
      tokenUsageMeasurement: "measured",
    });
    assert.equal(measured.tokenUsageMeasurement, "measured");
    const three = await create("three");
    const unspecified = await completeTask({
      nonce: three.nonce,
      inputTokens: 0,
      outputTokens: 0,
      durationSeconds: 1,
      outputHash: sha256Hex("out3"),
    });
    assert.equal(unspecified.tokenUsageMeasurement, "unspecified");
    const feedback = await localFeedbackSummary();
    assert.equal(feedback.localReceiptCount, 3);
    assert.equal(feedback.measuredUsageReceipts, 1);
    assert.equal(feedback.unmeasuredUsageReceipts, 1);
    assert.equal(feedback.unspecifiedUsageReceipts, 1);
    const text = JSON.stringify(feedback);
    assert.ok(!text.includes(receipt.receiptId));
    assert.ok(!text.includes(receipt.wallet));
    assert.ok(!text.includes(dir));
    // Simulate archive written but state update interrupted; recovery is idempotent.
    const batch = {
      root: sha256Hex("batch"),
      receiptIds: [receipt.receiptId],
      publishTransaction: "0xpublish",
      claimTransaction: "0xclaim",
      settledAt: new Date().toISOString(),
    };
    await mkdir(path.join(dir, "settled"), { recursive: true });
    await writeFile(
      path.join(dir, "settled", `batch-${batch.root.slice(2)}.json`),
      JSON.stringify([
        {
          ...receipt,
          batchRoot: batch.root,
          claimTransaction: batch.claimTransaction,
        },
      ]),
    );
    await markBatchSettled(batch);
    await markBatchSettled(batch);
    assert.equal((await unsettledReceipts(100)).length, 2);
    assert.equal(
      (await exportReceipts()).filter((r) => r.receiptId === receipt.receiptId)
        .length,
      1,
    );
    assert.equal(
      JSON.parse(await readFile(path.join(dir, "state.json"), "utf8")).batches
        .length,
      1,
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
    delete process.env.AIPOU_DATA_DIR;
    delete process.env.AIPOU_AGENT_PRIVATE_KEY;
  }
});

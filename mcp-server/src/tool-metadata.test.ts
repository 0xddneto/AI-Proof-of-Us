import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

test("tool metadata explains parameters, side effects, and safe alternatives", async () => {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [fileURLToPath(new URL("./index.js", import.meta.url))],
    stderr: "pipe"
  });
  const client = new Client({ name: "aipou-tool-metadata-test", version: "1.0.0" });
  await client.connect(transport);

  try {
    const { tools } = await client.listTools();
    const complete = tools.find((tool) => tool.name === "complete_ai_task");
    const estimate = tools.find((tool) => tool.name === "estimate_ai_reward");
    const status = tools.find((tool) => tool.name === "get_aipou_status");
    const begin = tools.find((tool) => tool.name === "begin_ai_task");
    const paybox = tools.find((tool) => tool.name === "create_paybox_work_link");
    const technocore = tools.find((tool) => tool.name === "create_technocore_work_link");
    const verifyReceipt = tools.find((tool) => tool.name === "verify_aipou_receipt");
    const settleAll = tools.find((tool) => tool.name === "settle_all_ai_rewards");

    assert.ok(complete);
    assert.match(complete.description ?? "", /once after begin_ai_task/i);
    assert.match(complete.description ?? "", /writes the local receipt store/i);
    assert.match(complete.description ?? "", /does not .*submit a blockchain transaction/i);
    assert.match(complete.description ?? "", /workReceiptId/i);
    assert.match(complete.description ?? "", /get_aipou_status/i);
    assert.deepEqual(complete.annotations, {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: false
    });

    const completeProperties = complete.inputSchema.properties as Record<
      string,
      { description?: string; properties?: Record<string, { description?: string }> }
    >;
    for (const field of ["nonce", "inputTokens", "outputTokens", "durationSeconds", "outputHash"]) {
      assert.ok(completeProperties[field]?.description, `${field} must have a description`);
    }
    assert.ok(completeProperties.providerEvidence?.description);
    assert.ok(completeProperties.providerEvidence?.properties?.keyId?.description);
    assert.ok(completeProperties.providerEvidence?.properties?.signature?.description);

    assert.ok(estimate);
    assert.match(estimate.description ?? "", /informational/i);
    assert.match(estimate.description ?? "", /inputTokens, outputTokens, and durationSeconds/i);
    assert.equal(estimate.annotations?.readOnlyHint, true);
    assert.equal(estimate.annotations?.idempotentHint, true);

    assert.ok(status);
    assert.match(status.description ?? "", /read-only JSON summary/i);
    assert.match(status.description ?? "", /never signs or submits a transaction/i);
    assert.match(status.description ?? "", /explicit claim request/i);
    assert.equal(status.annotations?.readOnlyHint, true);
    assert.equal(status.annotations?.openWorldHint, true);

    assert.ok(begin);
    assert.match(begin.description ?? "", /writes a pending local task session/i);
    assert.match(begin.description ?? "", /does not publish, mint, or submit an on-chain transaction/i);
    assert.equal(begin.annotations?.readOnlyHint, false);
    assert.equal(begin.annotations?.idempotentHint, false);
    const beginProperties = begin.inputSchema.properties as Record<string, { description?: string }>;
    for (const field of ["provider", "model", "taskHash", "client"]) {
      assert.ok(beginProperties[field]?.description, `${field} must have a description`);
    }

    for (const tool of [paybox, technocore]) {
      assert.ok(tool);
      assert.match(tool.description ?? "", /pure local calculation/i);
      assert.match(tool.description ?? "", /does not persist/i);
      assert.equal(tool.annotations?.readOnlyHint, true);
      assert.equal(tool.annotations?.idempotentHint, true);
    }

    assert.ok(verifyReceipt);
    assert.match(verifyReceipt.description ?? "", /self-contained integrity/i);
    assert.match(verifyReceipt.description ?? "", /does not .*prove delivery/i);
    assert.equal(verifyReceipt.annotations?.readOnlyHint, true);
    assert.equal(verifyReceipt.annotations?.idempotentHint, true);

    assert.ok(settleAll);
    assert.match(settleAll.description ?? "", /explicit broad request/i);
    assert.equal(settleAll.annotations?.readOnlyHint, false);
    assert.equal(settleAll.annotations?.openWorldHint, true);
    const settleAllProperties = settleAll.inputSchema.properties as Record<string, { description?: string }>;
    assert.ok(settleAllProperties.batchSize?.description);
    assert.ok(settleAllProperties.maxBatches?.description);
  } finally {
    await transport.close();
  }
});

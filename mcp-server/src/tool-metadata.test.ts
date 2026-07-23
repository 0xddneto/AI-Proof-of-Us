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

    assert.ok(complete);
    assert.match(complete.description ?? "", /once after begin_ai_task/i);
    assert.match(complete.description ?? "", /changes the local receipt store/i);
    assert.match(complete.description ?? "", /does not .*submit a blockchain transaction/i);
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
    assert.equal(estimate.annotations?.readOnlyHint, true);
    assert.equal(estimate.annotations?.idempotentHint, true);

    assert.ok(status);
    assert.match(status.description ?? "", /read-only farming summary/i);
    assert.match(status.description ?? "", /never signs or submits a transaction/i);
    assert.equal(status.annotations?.readOnlyHint, true);
    assert.equal(status.annotations?.openWorldHint, true);
  } finally {
    await transport.close();
  }
});

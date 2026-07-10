import { createHash } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Wallet } from "ethers";
import { deriveFactId, validateAipouReference } from "./receipt-reference.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function hashJson(value) {
  return `0x${createHash("sha256").update(JSON.stringify(value)).digest("hex")}`;
}

function parseTextResult(result) {
  const text = result.content?.find((part) => part.type === "text")?.text;
  if (!text) throw new Error("Tool result did not include a text JSON payload");
  return JSON.parse(text);
}

function splitArgs(value) {
  return value ? value.match(/(?:[^\s"]+|"[^"]*")+/g)?.map((arg) => arg.replace(/^"|"$/g, "")) || [] : null;
}

async function main() {
  const usePublishedPackage = process.env.AIPOU_DEMO_USE_NPX === "1";
  const localServerPath = path.resolve(__dirname, "../../mcp-server/dist/index.js");
  const command = process.env.AIPOU_MCP_COMMAND || (usePublishedPackage ? "npx" : "node");
  const args = splitArgs(process.env.AIPOU_MCP_ARGS) || (usePublishedPackage ? ["-y", "aipou-mcp-server"] : [localServerPath]);
  const temporaryDataDir = !process.env.AIPOU_DATA_DIR;
  const dataDir = process.env.AIPOU_DATA_DIR || await mkdtemp(path.join(os.tmpdir(), "aipou-demo-"));
  const demoWallet = process.env.AIPOU_AGENT_PRIVATE_KEY ? null : Wallet.createRandom();

  const transport = new StdioClientTransport({
    command,
    args,
    stderr: "inherit",
    env: {
      ...process.env,
      AIPOU_AGENT_PRIVATE_KEY: process.env.AIPOU_AGENT_PRIVATE_KEY || demoWallet.privateKey,
      AIPOU_CONTRACT_ADDRESS: process.env.AIPOU_CONTRACT_ADDRESS || "0x55f0Cc5e51A1284D20337d6cbb18938C8A1ABCbB",
      AIPOU_CLAIMS_ADDRESS: process.env.AIPOU_CLAIMS_ADDRESS || "0x4ca4C98fB784D20EdC8E2A7F531dAab4c6e53058",
      AIPOU_DATA_DIR: dataDir
    }
  });

  const client = new Client({ name: "aipou-lifecycle-adapter-example", version: "0.1.0" });
  await client.connect(transport);

  try {
    const task = {
      kind: "demo.lifecycle",
      userIntent: "show where receiptId attaches to a framework run",
      frameworkRunId: `demo-${Date.now()}`
    };
    const taskHash = hashJson(task);
    const start = Date.now();

    const session = parseTextResult(await client.callTool({
      name: "begin_ai_task",
      arguments: {
        provider: "local-demo",
        model: "lifecycle-adapter",
        client: "example.lifecycle-adapter",
        taskHash
      }
    }));

    const frameworkResult = {
      status: "ok",
      attachReceiptTo: ["run.metadata", "trace.span.attributes", "audit.export"],
      note: "Raw prompts and outputs stay outside the AIPOU receipt."
    };
    const outputHash = hashJson(frameworkResult);

    const receipt = parseTextResult(await client.callTool({
      name: "complete_ai_task",
      arguments: {
        nonce: session.nonce,
        inputTokens: 38,
        outputTokens: 41,
        durationSeconds: Math.max(1, Math.round((Date.now() - start) / 1000)),
        outputHash
      }
    }));

    const externalReference = {
      type: "aipou.receipt",
      workReceiptId: receipt.receiptId,
      receiptId: receipt.receiptId,
      evidenceClass: "issuer_asserted",
      scheme: "aipou-receipt-v1",
      factId: deriveFactId(receipt.collectorPublicKey, receipt.nonce),
      subject: {
        kind: "wallet",
        id: `eip155:8453:${receipt.wallet}`
      },
      status: "local",
      registryStatus: "active",
      relianceBoundary: "local-policy-only",
      taskHash,
      outputHash,
      trustTier: receipt.trustTier,
      evidenceBoundary: "https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/evidence-boundaries.md"
    };
    validateAipouReference(externalReference);

    console.log(JSON.stringify({
      mode: demoWallet ? "local_receipt_mode_ephemeral_wallet" : "local_receipt_mode_configured_wallet",
      wallet: receipt.wallet,
      dataDir: temporaryDataDir ? "removed_after_demo" : dataDir,
      frameworkMetadata: {
        runId: task.frameworkRunId,
        aipou: externalReference
      }
    }, null, 2));
  } finally {
    await transport.close();
    if (temporaryDataDir && dataDir.startsWith(os.tmpdir()) && path.basename(dataDir).startsWith("aipou-demo-")) {
      await rm(dataDir, { recursive: true, force: true });
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

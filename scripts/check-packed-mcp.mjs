import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const { version } = JSON.parse(readFileSync(path.join(root, "mcp-server", "package.json"), "utf8"));
const packageSpec = `aipou-mcp-server@${version}`;
const temp = mkdtempSync(path.join(tmpdir(), "aipou-packed-"));
const env = Object.fromEntries(
  Object.entries(process.env).filter(([key]) => !key.startsWith("AIPOU_")),
);
const npm = (...args) =>
  execFileSync(process.execPath, [process.env.npm_execpath, ...args], {
    cwd: root,
    env,
    encoding: "utf8",
    timeout: 180000,
  });
let transport;
try {
  const [{ filename }] = JSON.parse(
    npm(
      "pack",
      "--workspace",
      "mcp-server",
      "--ignore-scripts",
      "--json",
      "--pack-destination",
      temp,
    ),
  );
  npm(
    "install",
    "--prefix",
    temp,
    "--omit=dev",
    "--ignore-scripts",
    "--no-audit",
    "--no-fund",
    "--prefer-online",
    process.argv.includes("--published")
      ? packageSpec
      : path.join(temp, filename),
  );
  const entry = path.join(
    temp,
    "node_modules",
    "aipou-mcp-server",
    "dist",
    "index.js",
  );
  const cli = (...args) =>
    JSON.parse(
      execFileSync(process.execPath, [entry, ...args], {
        env,
        encoding: "utf8",
        timeout: 30000,
      }),
    );
  assert.equal(cli("--demo").safety.claimSubmitted, false);
  const pilot = cli("--pilot");
  assert.equal(pilot.evidence.receiptIntegrity, "VERIFIED");
  assert.equal(pilot.evidence.hostExecution, "OBSERVED");
  assert.equal(pilot.hostObservation.source, "local_file_readback");
  const data = path.join(temp, "identity");
  const init = cli("--init", "--data-dir", data);
  assert.deepEqual(init.mcpConfig.mcpServers.aipou.args, [
    "-y",
    packageSpec,
  ]);
  assert.equal(cli("--doctor", "--data-dir", data).ready, true);
  const childEnv = { ...env, ...init.mcpConfig.mcpServers.aipou.env };
  transport = new StdioClientTransport({
    command: process.execPath,
    args: [entry],
    env: childEnv,
    stderr: "pipe",
  });
  const client = new Client({ name: "packed-install-check", version: "1.0.0" });
  await client.connect(transport);
  assert.equal((await client.listTools()).tools.length, 12);
  const call = async (name, args) => {
    const result = await client.callTool({ name, arguments: args });
    assert.ok(!result.isError, `${name} failed`);
    return JSON.parse(result.content.find((part) => part.type === "text").text);
  };
  const hash = (value) =>
    "0x" + createHash("sha256").update(value).digest("hex");
  const started = await call("begin_ai_task", {
    client: "packed-install-check",
    provider: "local",
    model: "smoke",
    taskHash: hash("independent synthetic package test"),
  });
  const completed = await call("complete_ai_task", {
    nonce: started.nonce,
    inputTokens: 0,
    outputTokens: 0,
    durationSeconds: 1,
    tokenUsageMeasurement: "unmeasured",
    outputHash: hash("test output"),
  });
  const receipt = completed.receipt ?? completed;
  assert.equal(receipt.tokenUsageMeasurement, "unmeasured");
  const valid = await call("verify_aipou_receipt", { receipt });
  assert.equal(valid.valid, true);
  assert.equal(valid.evidence.hostExecution, "UNKNOWN");
  assert.equal(valid.evidence.externalEffect, "UNKNOWN");
  const invalid = await call("verify_aipou_receipt", {
    receipt: { ...receipt, outputHash: hash("altered") },
  });
  assert.equal(invalid.valid, false);
  assert.equal(invalid.workReceiptId, null);
  assert.equal(invalid.claimedWorkReceiptId, receipt.receiptId);
  await transport.close();
  transport = undefined;
  const feedback = JSON.parse(
    execFileSync(process.execPath, [entry, "--feedback"], {
      env: childEnv,
      encoding: "utf8",
    }),
  );
  assert.equal(feedback.localReceiptCount, 1);
  assert.equal(feedback.unmeasuredUsageReceipts, 1);
  assert.ok(!JSON.stringify(feedback).includes(receipt.receiptId));
  console.log(
    "Packed installation passed: demo, pilot, init, doctor, 12 tools, signed receipt, tamper rejection and private feedback. No claims submitted.",
  );
} finally {
  if (transport) await transport.close();
  if (
    path.dirname(temp) !== tmpdir() ||
    !path.basename(temp).startsWith("aipou-packed-")
  )
    throw new Error("Unexpected cleanup target");
  rmSync(temp, { recursive: true, force: true });
}

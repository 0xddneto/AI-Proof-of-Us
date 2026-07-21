import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { agentWallet } from "./identity.js";
import { describeExistingIdentity, initializePersistentIdentity } from "./init.js";

const execFileAsync = promisify(execFile);

function parseTextResult(result: unknown): Record<string, unknown> {
  const content = (result as { content?: Array<{ type: string; text?: string }> }).content;
  const text = content?.find((part) => part.type === "text")?.text;
  if (!text) throw new Error("Tool result did not include a text JSON payload");
  return JSON.parse(text) as Record<string, unknown>;
}

test("persistent init creates a dedicated key file without printing the secret", async () => {
  const dataDir = await mkdtemp(path.join(os.tmpdir(), "aipou-init-test-"));
  const previousInlineKey = process.env.AIPOU_AGENT_PRIVATE_KEY;
  const previousKeyFile = process.env.AIPOU_AGENT_KEY_FILE;
  try {
    const result = await initializePersistentIdentity(dataDir);
    const privateKey = (await readFile(result.keyFile, "utf8")).trim();

    assert.equal(result.mode, "persistent_identity_initialized");
    assert.equal(result.platformAccessRestricted, true);
    assert.match(result.wallet, /^0x[0-9a-fA-F]{40}$/);
    assert.match(privateKey, /^0x[0-9a-fA-F]{64}$/);
    assert.equal(JSON.stringify(result).includes(privateKey), false);
    assert.equal(result.mcpConfig.mcpServers.aipou.env.AIPOU_AGENT_KEY_FILE, result.keyFile);
    assert.deepEqual(result.safety, {
      dedicatedWalletCreated: true,
      privateKeyPrinted: false,
      existingKeyOverwritten: false,
      fundsMoved: false,
      claimSubmitted: false
    });

    delete process.env.AIPOU_AGENT_PRIVATE_KEY;
    process.env.AIPOU_AGENT_KEY_FILE = result.keyFile;
    assert.equal(agentWallet().address, result.wallet);

    await assert.rejects(
      initializePersistentIdentity(dataDir),
      /EEXIST|file already exists/i
    );
    assert.equal((await readFile(result.keyFile, "utf8")).trim(), privateKey);

    const existing = await describeExistingIdentity(dataDir);
    assert.equal(existing.mode, "persistent_identity_already_initialized");
    assert.equal(existing.wallet, result.wallet);
    assert.equal(existing.safety.dedicatedWalletCreated, false);
    assert.equal(JSON.stringify(existing).includes(privateKey), false);
    assert.equal((await readFile(result.keyFile, "utf8")).trim(), privateKey);
  } finally {
    if (previousInlineKey === undefined) delete process.env.AIPOU_AGENT_PRIVATE_KEY;
    else process.env.AIPOU_AGENT_PRIVATE_KEY = previousInlineKey;
    if (previousKeyFile === undefined) delete process.env.AIPOU_AGENT_KEY_FILE;
    else process.env.AIPOU_AGENT_KEY_FILE = previousKeyFile;
    await rm(dataDir, { recursive: true, force: true });
  }
});

test("re-running CLI init reports the existing identity cleanly", async () => {
  const dataDir = await mkdtemp(path.join(os.tmpdir(), "aipou-init-rerun-test-"));
  const indexPath = fileURLToPath(new URL("./index.js", import.meta.url));
  try {
    const first = JSON.parse((await execFileAsync(
      process.execPath,
      [indexPath, "--init", "--data-dir", dataDir]
    )).stdout) as Awaited<ReturnType<typeof initializePersistentIdentity>>;

    const { stdout, stderr } = await execFileAsync(
      process.execPath,
      [indexPath, "--init", "--data-dir", dataDir]
    );
    const second = JSON.parse(stdout) as Awaited<ReturnType<typeof initializePersistentIdentity>>;
    const privateKey = (await readFile(second.keyFile, "utf8")).trim();

    assert.equal(second.mode, "persistent_identity_already_initialized");
    assert.equal(second.wallet, first.wallet);
    assert.equal(second.safety.dedicatedWalletCreated, false);
    assert.equal(second.safety.existingKeyOverwritten, false);
    assert.equal(stdout.includes(privateKey), false);
    assert.equal(stderr.includes("EEXIST"), false);
  } finally {
    await rm(dataDir, { recursive: true, force: true });
  }
});

test("CLI init output starts an MCP server with the generated key file", async () => {
  const dataDir = await mkdtemp(path.join(os.tmpdir(), "aipou-init-cli-test-"));
  const indexPath = fileURLToPath(new URL("./index.js", import.meta.url));
  let transport: StdioClientTransport | undefined;
  try {
    const { stdout } = await execFileAsync(
      process.execPath,
      [indexPath, "--init", "--data-dir", dataDir]
    );
    const result = JSON.parse(stdout) as Awaited<ReturnType<typeof initializePersistentIdentity>>;
    const privateKey = (await readFile(result.keyFile, "utf8")).trim();
    assert.equal(stdout.includes(privateKey), false);

    const config = result.mcpConfig.mcpServers.aipou;
    transport = new StdioClientTransport({
      command: process.execPath,
      args: [indexPath],
      stderr: "pipe",
      env: { ...process.env, ...config.env }
    });
    const client = new Client({ name: "aipou-init-cli-test", version: "1.0.0" });
    await client.connect(transport);
    const identity = parseTextResult(await client.callTool({
      name: "get_aipou_identity",
      arguments: {}
    }));
    assert.equal(identity.wallet, result.wallet);
  } finally {
    if (transport) await transport.close();
    await rm(dataDir, { recursive: true, force: true });
  }
});

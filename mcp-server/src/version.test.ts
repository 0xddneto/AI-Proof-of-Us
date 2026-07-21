import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { getPackageVersion } from "./version.js";

test("MCP handshake version comes from the published package metadata", async () => {
  const metadata = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8")
  ) as { version: string };
  assert.equal(await getPackageVersion(), metadata.version);
});

test("MCP initialization advertises the published package version", async () => {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [fileURLToPath(new URL("./index.js", import.meta.url))],
    stderr: "pipe"
  });
  const client = new Client({ name: "aipou-version-test", version: "1.0.0" });
  await client.connect(transport);
  try {
    assert.equal(client.getServerVersion()?.version, await getPackageVersion());
  } finally {
    await transport.close();
  }
});

import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { access, mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { Wallet } from "ethers";
import { runInstallationDoctor } from "./doctor.js";
import { initializePersistentIdentity } from "./init.js";

const execFileAsync = promisify(execFile);

test("installation doctor validates init output without exposing or changing the key", async () => {
  const dataDir = await mkdtemp(path.join(os.tmpdir(), "aipou-doctor-test-"));
  const previousInlineKey = process.env.AIPOU_AGENT_PRIVATE_KEY;
  const previousKeyFile = process.env.AIPOU_AGENT_KEY_FILE;
  try {
    delete process.env.AIPOU_AGENT_PRIVATE_KEY;
    delete process.env.AIPOU_AGENT_KEY_FILE;
    const initialized = await initializePersistentIdentity(dataDir);
    const privateKeyBefore = await readFile(initialized.keyFile, "utf8");
    const result = await runInstallationDoctor(dataDir);
    const privateKeyAfter = await readFile(initialized.keyFile, "utf8");

    assert.equal(result.ready, true);
    assert.equal(result.wallet, initialized.wallet);
    assert.equal(result.keySource, "key_file");
    assert.equal(result.version.length > 0, true);
    assert.equal(Object.values(result.checks).every((check) => check.status !== "fail"), true);
    assert.equal(privateKeyAfter, privateKeyBefore);
    assert.equal(JSON.stringify(result).includes(privateKeyBefore.trim()), false);
    assert.deepEqual(result.safety, {
      privateKeyPrinted: false,
      filesWritten: false,
      networkRequestsMade: false,
      fundsMoved: false,
      claimSubmitted: false
    });
  } finally {
    if (previousInlineKey === undefined) delete process.env.AIPOU_AGENT_PRIVATE_KEY;
    else process.env.AIPOU_AGENT_PRIVATE_KEY = previousInlineKey;
    if (previousKeyFile === undefined) delete process.env.AIPOU_AGENT_KEY_FILE;
    else process.env.AIPOU_AGENT_KEY_FILE = previousKeyFile;
    await rm(dataDir, { recursive: true, force: true });
  }
});

test("installation doctor fails closed without creating a missing directory", async () => {
  const parent = await mkdtemp(path.join(os.tmpdir(), "aipou-doctor-missing-test-"));
  const dataDir = path.join(parent, "missing");
  const previousInlineKey = process.env.AIPOU_AGENT_PRIVATE_KEY;
  const previousKeyFile = process.env.AIPOU_AGENT_KEY_FILE;
  try {
    delete process.env.AIPOU_AGENT_PRIVATE_KEY;
    delete process.env.AIPOU_AGENT_KEY_FILE;
    const result = await runInstallationDoctor(dataDir);

    assert.equal(result.ready, false);
    assert.equal(result.wallet, null);
    assert.equal(result.keySource, "missing");
    assert.equal(result.checks.dataDirectory.status, "fail");
    assert.equal(result.checks.identity.status, "fail");
    await assert.rejects(access(dataDir));
  } finally {
    if (previousInlineKey === undefined) delete process.env.AIPOU_AGENT_PRIVATE_KEY;
    else process.env.AIPOU_AGENT_PRIVATE_KEY = previousInlineKey;
    if (previousKeyFile === undefined) delete process.env.AIPOU_AGENT_KEY_FILE;
    else process.env.AIPOU_AGENT_KEY_FILE = previousKeyFile;
    await rm(parent, { recursive: true, force: true });
  }
});

test("installation doctor supports the legacy inline key without exposing it", async () => {
  const dataDir = await mkdtemp(path.join(os.tmpdir(), "aipou-doctor-inline-test-"));
  const previousInlineKey = process.env.AIPOU_AGENT_PRIVATE_KEY;
  const previousKeyFile = process.env.AIPOU_AGENT_KEY_FILE;
  const previousDataDir = process.env.AIPOU_DATA_DIR;
  const wallet = Wallet.createRandom();
  try {
    process.env.AIPOU_AGENT_PRIVATE_KEY = wallet.privateKey;
    process.env.AIPOU_DATA_DIR = dataDir;
    delete process.env.AIPOU_AGENT_KEY_FILE;
    const result = await runInstallationDoctor();

    assert.equal(result.ready, true);
    assert.equal(result.wallet, wallet.address);
    assert.equal(result.keySource, "inline_private_key");
    assert.equal(result.keyFile, null);
    assert.equal(result.checks.identity.status, "warning");
    assert.equal(result.checks.keyPermissions.status, "warning");
    assert.equal(JSON.stringify(result).includes(wallet.privateKey), false);
  } finally {
    if (previousInlineKey === undefined) delete process.env.AIPOU_AGENT_PRIVATE_KEY;
    else process.env.AIPOU_AGENT_PRIVATE_KEY = previousInlineKey;
    if (previousKeyFile === undefined) delete process.env.AIPOU_AGENT_KEY_FILE;
    else process.env.AIPOU_AGENT_KEY_FILE = previousKeyFile;
    if (previousDataDir === undefined) delete process.env.AIPOU_DATA_DIR;
    else process.env.AIPOU_DATA_DIR = previousDataDir;
    await rm(dataDir, { recursive: true, force: true });
  }
});

test("installation doctor rejects invalid addresses and chain IDs without throwing", async () => {
  const dataDir = await mkdtemp(path.join(os.tmpdir(), "aipou-doctor-config-test-"));
  const previousContract = process.env.AIPOU_CONTRACT_ADDRESS;
  const previousChainId = process.env.AIPOU_CHAIN_ID;
  try {
    await initializePersistentIdentity(dataDir);
    process.env.AIPOU_CONTRACT_ADDRESS = "not-an-address";
    process.env.AIPOU_CHAIN_ID = "not-a-chain";
    const result = await runInstallationDoctor(dataDir);

    assert.equal(result.ready, false);
    assert.equal(result.checks.tokenAddress.status, "fail");
    assert.equal(result.checks.chain.status, "fail");
  } finally {
    if (previousContract === undefined) delete process.env.AIPOU_CONTRACT_ADDRESS;
    else process.env.AIPOU_CONTRACT_ADDRESS = previousContract;
    if (previousChainId === undefined) delete process.env.AIPOU_CHAIN_ID;
    else process.env.AIPOU_CHAIN_ID = previousChainId;
    await rm(dataDir, { recursive: true, force: true });
  }
});

test("CLI doctor reports a ready persistent identity without printing its secret", async () => {
  const dataDir = await mkdtemp(path.join(os.tmpdir(), "aipou-doctor-cli-test-"));
  const indexPath = fileURLToPath(new URL("./index.js", import.meta.url));
  try {
    const initialized = await initializePersistentIdentity(dataDir);
    const privateKey = (await readFile(initialized.keyFile, "utf8")).trim();
    const inheritedWallet = Wallet.createRandom();
    const { stdout, stderr } = await execFileAsync(
      process.execPath,
      [indexPath, "--doctor", "--data-dir", dataDir],
      {
        env: {
          ...process.env,
          AIPOU_AGENT_PRIVATE_KEY: inheritedWallet.privateKey,
          AIPOU_AGENT_KEY_FILE: path.join(dataDir, "wrong-key-file")
        }
      }
    );
    const result = JSON.parse(stdout) as Awaited<ReturnType<typeof runInstallationDoctor>>;

    assert.equal(result.ready, true);
    assert.equal(result.wallet, initialized.wallet);
    assert.equal(stdout.includes(privateKey), false);
    assert.equal(stderr, "");
  } finally {
    await rm(dataDir, { recursive: true, force: true });
  }
});

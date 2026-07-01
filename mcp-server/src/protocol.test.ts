import { generateKeyPairSync, sign } from "node:crypto";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { Wallet, keccak256, toUtf8Bytes } from "ethers";
import { canonicalJson } from "./canonical.js";
import { verifyCollectorPayload } from "./collector.js";
import { verifyTaskAuthorization } from "./identity.js";
import { providerAssertion } from "./providers.js";
import { beginTask, completeTask } from "./receipts.js";

test("creates verifiable receipts and rejects nonce/evidence replay", async () => {
  const dataDir = await mkdtemp(path.join(tmpdir(), "aipou-protocol-"));
  process.env.AIPOU_DATA_DIR = dataDir;
  process.env.AIPOU_AGENT_PRIVATE_KEY = Wallet.createRandom().privateKey;
  const verifyingContract = Wallet.createRandom().address;
  const taskHash = keccak256(toUtf8Bytes("build a useful artifact"));
  const outputHash = keccak256(toUtf8Bytes("artifact-v1"));

  const session = await beginTask({
    provider: "openai",
    model: "codex",
    taskHash,
    client: "test-client",
    chainId: 8453,
    verifyingContract
  });
  assert.equal(verifyTaskAuthorization(session), true);

  const receipt = await completeTask({
    nonce: session.nonce,
    inputTokens: 1200,
    outputTokens: 500,
    durationSeconds: 180,
    outputHash
  });
  assert.equal(receipt.trustTier, "client_signed");
  const { collectorSignature, batchRoot, claimTransaction, ...signedPayload } = receipt;
  assert.equal(verifyCollectorPayload(signedPayload, collectorSignature, receipt.collectorPublicKey), true);

  await assert.rejects(
    completeTask({
      nonce: session.nonce,
      inputTokens: 1200,
      outputTokens: 500,
      durationSeconds: 180,
      outputHash
    }),
    /already been completed/
  );

  const repeatedSession = await beginTask({
    provider: "openai",
    model: "codex",
    taskHash,
    client: "test-client",
    chainId: 8453,
    verifyingContract
  });
  await assert.rejects(
    completeTask({
      nonce: repeatedSession.nonce,
      inputTokens: 1200,
      outputTokens: 500,
      durationSeconds: 180,
      outputHash
    }),
    /Duplicate task\/output evidence/
  );
});

test("derives provider_signed only from a configured valid signature", async () => {
  const dataDir = await mkdtemp(path.join(tmpdir(), "aipou-provider-"));
  process.env.AIPOU_DATA_DIR = dataDir;
  process.env.AIPOU_AGENT_PRIVATE_KEY = Wallet.createRandom().privateKey;
  const pair = generateKeyPairSync("ed25519");
  const publicKey = pair.publicKey.export({ format: "pem", type: "spki" }).toString();
  const keyFile = path.join(dataDir, "provider-keys.json");
  await writeFile(keyFile, JSON.stringify({ local: { "test-key": publicKey } }));
  process.env.AIPOU_PROVIDER_KEYS_FILE = keyFile;

  const session = await beginTask({
    provider: "local",
    model: "signed-model",
    taskHash: keccak256(toUtf8Bytes("provider task")),
    client: "test-client",
    chainId: 8453,
    verifyingContract: Wallet.createRandom().address
  });
  const completion = {
    nonce: session.nonce,
    inputTokens: 2000,
    outputTokens: 750,
    durationSeconds: 240,
    outputHash: keccak256(toUtf8Bytes("provider artifact"))
  };
  const signature = sign(
    null,
    Buffer.from(canonicalJson(providerAssertion(session, completion))),
    pair.privateKey
  ).toString("base64");
  const receipt = await completeTask({
    ...completion,
    providerEvidence: { keyId: "test-key", signature }
  });
  assert.equal(receipt.trustTier, "provider_signed");
});

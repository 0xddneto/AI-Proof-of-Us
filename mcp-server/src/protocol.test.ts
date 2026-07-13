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
import { filterEligibleReceipts } from "./policy.js";
import { providerAssertion } from "./providers.js";
import { beginTask, completeTask } from "./receipts.js";
import { exportStoredReceipts, markBatchSettled, unsettledReceipts } from "./store.js";
import type { UsageReceipt } from "./types.js";

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
  assert.match(repeatedSession.nonce, /^0x[0-9a-f]{64}$/);
  assert.notEqual(repeatedSession.nonce, session.nonce);
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

function fakeReceipt(overrides: Partial<UsageReceipt>): UsageReceipt {
  return {
    receiptId: `0x${"0".repeat(63)}1`,
    wallet: "0x1111111111111111111111111111111111111111",
    inputTokens: 1000,
    outputTokens: 500,
    recordedAt: new Date().toISOString(),
    ...overrides
  } as UsageReceipt;
}

test("settlement policy skips tiny receipts and enforces the daily wallet limit", () => {
  const policy = { minTotalTokens: 200, maxDailyReceiptsPerWallet: 2 };
  const wallet = "0x1111111111111111111111111111111111111111";
  const candidates = [
    fakeReceipt({ receiptId: "0xaaa1", wallet }),
    fakeReceipt({ receiptId: "0xaaa2", wallet, inputTokens: 50, outputTokens: 20 }),
    fakeReceipt({ receiptId: "0xaaa3", wallet }),
    fakeReceipt({ receiptId: "0xaaa4", wallet })
  ];
  const alreadySettledToday = [fakeReceipt({ receiptId: "0xbbb1", wallet, claimTransaction: "0xtx" })];

  const { eligible, skipped } = filterEligibleReceipts(candidates, alreadySettledToday, policy);

  assert.deepEqual(eligible.map((item) => item.receiptId), ["0xaaa1"]);
  assert.equal(skipped.length, 3);
  assert.match(skipped[0].reason, /minimum work floor/);
  assert.match(skipped[1].reason, /daily receipt limit/);

  const staleSettled = [
    fakeReceipt({
      receiptId: "0xccc1",
      wallet,
      claimTransaction: "0xtx",
      recordedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
    })
  ];
  const fresh = filterEligibleReceipts([fakeReceipt({ receiptId: "0xddd1", wallet })], staleSettled, policy);
  assert.equal(fresh.eligible.length, 1);

  const disabled = filterEligibleReceipts(candidates, alreadySettledToday, { minTotalTokens: 0, maxDailyReceiptsPerWallet: 0 });
  assert.equal(disabled.eligible.length, candidates.length);
  assert.equal(disabled.skipped.length, 0);
});

test("settled receipts move to the archive and stay exportable", async () => {
  const dataDir = await mkdtemp(path.join(tmpdir(), "aipou-archive-"));
  process.env.AIPOU_DATA_DIR = dataDir;
  process.env.AIPOU_AGENT_PRIVATE_KEY = Wallet.createRandom().privateKey;

  const session = await beginTask({
    provider: "local",
    model: "archive-model",
    taskHash: keccak256(toUtf8Bytes("archive task")),
    client: "test-client",
    chainId: 8453,
    verifyingContract: Wallet.createRandom().address
  });
  const receipt = await completeTask({
    nonce: session.nonce,
    inputTokens: 900,
    outputTokens: 300,
    durationSeconds: 60,
    outputHash: keccak256(toUtf8Bytes("archive output"))
  });

  await markBatchSettled({
    root: `0x${"ab".repeat(32)}`,
    receiptIds: [receipt.receiptId],
    publishTransaction: "0xpublish",
    claimTransaction: "0xclaim",
    settledAt: new Date().toISOString()
  });

  assert.equal((await unsettledReceipts(10)).length, 0);
  const exported = await exportStoredReceipts();
  assert.equal(exported.length, 1);
  assert.equal(exported[0].receiptId, receipt.receiptId);
  assert.equal(exported[0].claimTransaction, "0xclaim");
});

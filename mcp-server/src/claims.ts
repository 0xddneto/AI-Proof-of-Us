import { MerkleTree } from "merkletreejs";
import {
  AbiCoder,
  Contract,
  JsonRpcProvider,
  Transaction,
  Wallet,
  concat,
  getAddress,
  getBytes,
  keccak256,
  parseUnits,
} from "ethers";
import { mkdir, readFile, rm } from "node:fs/promises";
import path from "node:path";
import { collectorFingerprint, verifyCollectorPayload } from "./collector.js";
import { verifyTaskAuthorization } from "./identity.js";
import {
  DAY_MS,
  filterEligibleReceipts,
  settlementPolicyFromEnv,
} from "./policy.js";
import { deriveTrustTier } from "./providers.js";
import {
  exportStoredReceipts,
  markBatchSettled,
  settledReceiptsSince,
  unsettledReceipts,
} from "./store.js";
import { withFileLock } from "./lock.js";
import { readOptionalJson, writePrivateJson } from "./private-json.js";
import {
  executeSettlementPlan,
  type SettlementPlan,
} from "./settlement-runner.js";
import { createSettlementDriver } from "./settlement-driver.js";
import { canonicalJson } from "./canonical.js";
import { verifyAipouReceipt } from "./receipt-verifier.js";
import type {
  ClaimBatch,
  SettlementAllResult,
  SettlementResult,
  SkippedReceipt,
  TaskSession,
  UsageReceipt,
} from "./types.js";

const claimsAbi = [
  "function token() view returns (address)",
  "function validator() view returns (address)",
  "function approvedRoots(bytes32 root) view returns (bool)",
  "function claimedReceipts(bytes32 receiptId) view returns (bool)",
  "function publishRoot(bytes32 root)",
  "function claimBatch(bytes32 root, address[] accounts, uint256[] amounts, bytes32[] receiptIds, bytes32[][] proofs)",
];

const tokenAbi = ["function emissionController() view returns (address)"];

function claimsAddress(): string {
  const value = process.env.AIPOU_CLAIMS_ADDRESS;
  if (!value)
    throw new Error("AIPOU_CLAIMS_ADDRESS is required to settle rewards");
  return getAddress(value);
}

async function validatorPrivateKey(): Promise<string> {
  const keyFile = process.env.AIPOU_VALIDATOR_KEY_FILE;
  if (keyFile) {
    const key = (await readFile(path.resolve(keyFile), "utf8")).trim();
    if (!key) throw new Error(`AIPOU_VALIDATOR_KEY_FILE ${keyFile} is empty`);
    return key;
  }
  const envKey = process.env.AIPOU_VALIDATOR_PRIVATE_KEY;
  if (envKey) {
    console.error(
      "aipou-mcp: AIPOU_VALIDATOR_PRIVATE_KEY in the shared environment is deprecated; " +
        "move it to a separate file and set AIPOU_VALIDATOR_KEY_FILE so farming agents never load the validator key",
    );
    return envKey;
  }
  throw new Error(
    "AIPOU_VALIDATOR_KEY_FILE (or legacy AIPOU_VALIDATOR_PRIVATE_KEY) is required only on the protocol validator server",
  );
}

async function validatorWallet(): Promise<Wallet> {
  const provider = new JsonRpcProvider(
    process.env.AIPOU_RPC_URL || "https://mainnet.base.org",
  );
  return new Wallet(await validatorPrivateKey(), provider);
}

async function trustedCollectorFingerprints(): Promise<Set<string>> {
  const file = process.env.AIPOU_TRUSTED_COLLECTORS_FILE;
  if (!file)
    throw new Error(
      "AIPOU_TRUSTED_COLLECTORS_FILE is required on the protocol validator server",
    );
  const content = JSON.parse(await readFile(path.resolve(file), "utf8")) as {
    fingerprints?: string[];
  };
  if (!Array.isArray(content.fingerprints))
    throw new Error(
      "Trusted collectors file must contain a fingerprints array",
    );
  return new Set(content.fingerprints);
}

async function verifyReceipt(
  receipt: UsageReceipt,
  trustedCollectors: Set<string>,
): Promise<void> {
  if (!verifyAipouReceipt(receipt).valid)
    throw new Error(
      "Invalid receipt integrity or signature; settlement stopped before submission",
    );
  const fingerprint = collectorFingerprint(receipt.collectorPublicKey);
  if (!trustedCollectors.has(fingerprint)) {
    throw new Error(
      `Untrusted collector ${fingerprint} for ${receipt.receiptId}`,
    );
  }
  const { collectorSignature, batchRoot, claimTransaction, ...signedPayload } =
    receipt;
  if (
    !verifyCollectorPayload(
      signedPayload,
      collectorSignature,
      receipt.collectorPublicKey,
    )
  ) {
    throw new Error(`Invalid collector signature for ${receipt.receiptId}`);
  }

  const session: TaskSession = {
    nonce: receipt.nonce,
    wallet: receipt.wallet,
    provider: receipt.provider,
    model: receipt.model,
    taskHash: receipt.taskHash,
    client: receipt.client,
    issuedAt: receipt.authorizationIssuedAt,
    chainId: receipt.authorizationChainId,
    verifyingContract: receipt.authorizationContract,
    walletAuthorization: receipt.walletAuthorization,
    completedAt: receipt.recordedAt,
  };
  if (!verifyTaskAuthorization(session))
    throw new Error(`Invalid wallet authorization for ${receipt.receiptId}`);

  const derivedTier = await deriveTrustTier(
    session,
    {
      nonce: receipt.nonce,
      inputTokens: receipt.inputTokens,
      outputTokens: receipt.outputTokens,
      durationSeconds: receipt.durationSeconds,
      outputHash: receipt.outputHash,
      tokenUsageMeasurement: receipt.tokenUsageMeasurement,
      providerEvidence: receipt.providerEvidence,
    },
    receipt.providerEvidence,
  );
  if (derivedTier !== receipt.trustTier)
    throw new Error(`Invalid trust tier for ${receipt.receiptId}`);
}

export async function settleRewards(
  maxReceipts = 25,
): Promise<SettlementResult> {
  if (!Number.isInteger(maxReceipts) || maxReceipts < 1 || maxReceipts > 100)
    throw new Error("Batch size must be 1 through 100");
  const directory = path.resolve(process.env.AIPOU_DATA_DIR || ".aipou");
  await mkdir(directory, { recursive: true, mode: 0o700 });
  try {
    return await withFileLock(path.join(directory, "settlement.lock"), () =>
      settleRewardsLocked(maxReceipts, directory),
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (
      message.startsWith("SETTLEMENT_") ||
      message === "There are no unsettled receipts" ||
      message.startsWith("No receipts pass the settlement policy")
    )
      throw error;
    throw new Error(
      "SETTLEMENT_FAILED: inspect local configuration and saved settlement state before retrying; private RPC and transaction details are withheld.",
    );
  }
}

async function settleRewardsLocked(
  maxReceipts: number,
  directory: string,
): Promise<SettlementResult> {
  const journalPath = path.join(directory, "settlement-pending.json");
  const pending = await readOptionalJson<SettlementPlan>(journalPath);
  const candidates = await unsettledReceipts(Number.MAX_SAFE_INTEGER);
  if (candidates.length === 0 && !pending)
    throw new Error("There are no unsettled receipts");

  const policy = settlementPolicyFromEnv();
  const recentlySettled = await settledReceiptsSince(Date.now() - DAY_MS);
  const { eligible, skipped } = filterEligibleReceipts(
    candidates,
    recentlySettled,
    policy,
  );
  if (eligible.length === 0 && !pending) {
    const reasons = skipped
      .map((item) => `${item.receiptId.slice(0, 10)}…: ${item.reason}`)
      .join("; ");
    throw new Error(
      `No receipts pass the settlement policy. Skipped: ${reasons}`,
    );
  }
  let receipts = eligible.slice(0, maxReceipts);
  if (pending) {
    if (
      pending.version !== 1 ||
      pending.chainId !== 8453 ||
      !Array.isArray(pending.receiptIds) ||
      pending.receiptIds.length < 1 ||
      pending.receiptIds.length > 100
    ) {
      throw new Error("SETTLEMENT_JOURNAL_INVALID: invalid saved batch");
    }
    const stored = await exportStoredReceipts();
    receipts = pending.receiptIds.map((id) => {
      const receipt = stored.find((item) => item.receiptId === id);
      if (!receipt)
        throw new Error("SETTLEMENT_JOURNAL_INVALID: saved receipt is missing");
      return receipt;
    });
  }

  const trustedCollectors = await trustedCollectorFingerprints();
  for (const receipt of receipts)
    await verifyReceipt(receipt, trustedCollectors);

  const accounts = receipts.map((receipt) => receipt.wallet);
  const amounts = receipts.map((receipt) =>
    parseUnits(receipt.estimatedReward, 18),
  );
  const receiptIds = receipts.map((receipt) => receipt.receiptId);
  const coder = AbiCoder.defaultAbiCoder();
  // Leaves are double-hashed (inner keccak, then keccak again) so an interior
  // Merkle node can never be replayed as a valid leaf (second-preimage guard).
  const leaves = receipts.map((receipt, index) => {
    const inner = keccak256(
      coder.encode(
        ["address", "uint256", "bytes32"],
        [receipt.wallet, amounts[index], receipt.receiptId],
      ),
    );
    return Buffer.from(getBytes(keccak256(concat([inner]))));
  });
  const tree = new MerkleTree(
    leaves,
    (value: Buffer) => Buffer.from(getBytes(keccak256(value))),
    { sortLeaves: true, sortPairs: true },
  );
  const root = tree.getHexRoot();
  const proofs = leaves.map((leaf) => tree.getHexProof(leaf));

  const signer = await validatorWallet();
  const address = claimsAddress();
  if ((await signer.provider!.getNetwork()).chainId !== 8453n)
    throw new Error("Settlement requires Base mainnet (8453)");
  const claims = new Contract(address, claimsAbi, signer);
  const configuredValidator = getAddress(await claims.validator());
  if (configuredValidator !== signer.address) {
    throw new Error(
      `Validator mismatch: contract expects ${configuredValidator}, server uses ${signer.address}`,
    );
  }
  const tokenAddress = await claims.token();
  const token = new Contract(tokenAddress, tokenAbi, signer.provider);
  if (getAddress(await token.emissionController()) !== address) {
    throw new Error("AIPOUClaims is not the token emission controller");
  }

  const expected = {
    version: 1 as const,
    chainId: 8453,
    contract: address,
    root,
    accounts,
    amounts: amounts.map(String),
    receiptIds,
    proofs,
  };
  if (pending) {
    const { publish: _publish, claim: _claim, ...saved } = pending;
    if (canonicalJson(saved) !== canonicalJson(expected))
      throw new Error(
        "SETTLEMENT_JOURNAL_INVALID: batch does not match verified receipts and configured contract",
      );
  }
  const plan: SettlementPlan = pending ?? expected;
  for (const kind of ["publish", "claim"] as const) {
    const saved = plan[kind];
    if (!saved) continue;
    const transaction = Transaction.from(saved.raw);
    const expectedData =
      kind === "publish"
        ? claims.interface.encodeFunctionData("publishRoot", [root])
        : claims.interface.encodeFunctionData("claimBatch", [
            root,
            accounts,
            amounts,
            receiptIds,
            proofs,
          ]);
    if (
      transaction.hash !== saved.hash ||
      transaction.from !== signer.address ||
      transaction.chainId !== 8453n ||
      transaction.to?.toLowerCase() !== address.toLowerCase() ||
      transaction.value !== 0n ||
      transaction.data !== expectedData
    ) {
      throw new Error(
        "SETTLEMENT_JOURNAL_INVALID: saved transaction does not match the verified batch",
      );
    }
  }
  const persist = (value: SettlementPlan) =>
    writePrivateJson(journalPath, value);
  await persist(plan);
  const transactions = await executeSettlementPlan(
    plan,
    createSettlementDriver(signer, address),
    persist,
  );
  const confirmations = await Promise.all(
    receiptIds.map((id) => claims.claimedReceipts(id)),
  );
  if (!confirmations.every(Boolean))
    throw new Error(
      "SETTLEMENT_CLAIMS_UNCONFIRMED: receipt flags are not visible; journal retained for reconciliation",
    );

  const batch: ClaimBatch = {
    root,
    receiptIds,
    ...transactions,
    settledAt: new Date().toISOString(),
  };
  await markBatchSettled(batch);
  await rm(journalPath, { force: true });
  return { ...batch, skippedReceipts: skipped };
}

export async function settleAllRewards(
  batchSize = 100,
  maxBatches = 20,
): Promise<SettlementAllResult> {
  const batches: SettlementResult[] = [];
  const skippedByReceiptId = new Map<string, SkippedReceipt>();
  let stoppedReason: string | undefined;

  for (let index = 0; index < maxBatches; index += 1) {
    try {
      const batch = await settleRewards(batchSize);
      batches.push(batch);
      for (const skipped of batch.skippedReceipts) {
        skippedByReceiptId.set(skipped.receiptId, skipped);
      }
    } catch (error) {
      // Never return signed raw transactions, RPC credentials or local collector paths.
      const raw = error instanceof Error ? error.message : "Settlement failed";
      const message =
        raw.startsWith("SETTLEMENT_") ||
        raw === "There are no unsettled receipts"
          ? raw.slice(0, 400)
          : "SETTLEMENT_FAILED: inspect local diagnostics and saved settlement state before retrying; no private transaction payload is returned.";
      if (message === "There are no unsettled receipts") break;
      stoppedReason = message;
      break;
    }
  }

  if (!stoppedReason && batches.length === maxBatches) {
    stoppedReason = `Stopped after maxBatches=${maxBatches}; run settle_all_ai_rewards again for any remaining receipts`;
  }

  const pendingReceiptCount = (await unsettledReceipts(Number.MAX_SAFE_INTEGER))
    .length;
  const skippedReceipts = [...skippedByReceiptId.values()];
  return {
    batches,
    batchCount: batches.length,
    settledReceiptCount: batches.reduce(
      (total, batch) => total + batch.receiptIds.length,
      0,
    ),
    skippedReceipts,
    pendingReceiptCount,
    publishTransactions: batches
      .map((batch) => batch.publishTransaction)
      .filter(Boolean),
    claimTransactions: batches.map((batch) => batch.claimTransaction),
    stoppedReason,
    settledAt: new Date().toISOString(),
  };
}

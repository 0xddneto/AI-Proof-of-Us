import { MerkleTree } from "merkletreejs";
import { AbiCoder, Contract, JsonRpcProvider, Wallet, concat, getAddress, getBytes, keccak256, parseUnits } from "ethers";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { collectorFingerprint, verifyCollectorPayload } from "./collector.js";
import { verifyTaskAuthorization } from "./identity.js";
import { deriveTrustTier } from "./providers.js";
import { markBatchSettled, unsettledReceipts } from "./store.js";
import type { ClaimBatch, TaskSession, UsageReceipt } from "./types.js";

const claimsAbi = [
  "function token() view returns (address)",
  "function validator() view returns (address)",
  "function approvedRoots(bytes32 root) view returns (bool)",
  "function publishRoot(bytes32 root)",
  "function claimBatch(bytes32 root, address[] accounts, uint256[] amounts, bytes32[] receiptIds, bytes32[][] proofs)"
];

const tokenAbi = ["function emissionController() view returns (address)"];

function claimsAddress(): string {
  const value = process.env.AIPOU_CLAIMS_ADDRESS;
  if (!value) throw new Error("AIPOU_CLAIMS_ADDRESS is required to settle rewards");
  return getAddress(value);
}

function validatorWallet(): Wallet {
  const privateKey = process.env.AIPOU_VALIDATOR_PRIVATE_KEY;
  if (!privateKey) throw new Error("AIPOU_VALIDATOR_PRIVATE_KEY is required only on the protocol validator server");
  const provider = new JsonRpcProvider(process.env.AIPOU_RPC_URL || "https://mainnet.base.org");
  return new Wallet(privateKey, provider);
}

async function trustedCollectorFingerprints(): Promise<Set<string>> {
  const file = process.env.AIPOU_TRUSTED_COLLECTORS_FILE;
  if (!file) throw new Error("AIPOU_TRUSTED_COLLECTORS_FILE is required on the protocol validator server");
  const content = JSON.parse(await readFile(path.resolve(file), "utf8")) as { fingerprints?: string[] };
  if (!Array.isArray(content.fingerprints)) throw new Error("Trusted collectors file must contain a fingerprints array");
  return new Set(content.fingerprints);
}

async function verifyReceipt(receipt: UsageReceipt, trustedCollectors: Set<string>): Promise<void> {
  const fingerprint = collectorFingerprint(receipt.collectorPublicKey);
  if (!trustedCollectors.has(fingerprint)) {
    throw new Error(`Untrusted collector ${fingerprint} for ${receipt.receiptId}`);
  }
  const { collectorSignature, batchRoot, claimTransaction, ...signedPayload } = receipt;
  if (!verifyCollectorPayload(signedPayload, collectorSignature, receipt.collectorPublicKey)) {
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
    completedAt: receipt.recordedAt
  };
  if (!verifyTaskAuthorization(session)) throw new Error(`Invalid wallet authorization for ${receipt.receiptId}`);

  const derivedTier = await deriveTrustTier(
    session,
    {
      nonce: receipt.nonce,
      inputTokens: receipt.inputTokens,
      outputTokens: receipt.outputTokens,
      durationSeconds: receipt.durationSeconds,
      outputHash: receipt.outputHash,
      providerEvidence: receipt.providerEvidence
    },
    receipt.providerEvidence
  );
  if (derivedTier !== receipt.trustTier) throw new Error(`Invalid trust tier for ${receipt.receiptId}`);
}

export async function settleRewards(maxReceipts = 25): Promise<ClaimBatch> {
  const receipts = await unsettledReceipts(maxReceipts);
  if (receipts.length === 0) throw new Error("There are no unsettled receipts");
  const trustedCollectors = await trustedCollectorFingerprints();
  for (const receipt of receipts) await verifyReceipt(receipt, trustedCollectors);

  const accounts = receipts.map((receipt) => receipt.wallet);
  const amounts = receipts.map((receipt) => parseUnits(receipt.estimatedReward, 18));
  const receiptIds = receipts.map((receipt) => receipt.receiptId);
  const coder = AbiCoder.defaultAbiCoder();
  const leaves = receipts.map((receipt, index) => {
    const inner = keccak256(coder.encode(["address", "uint256", "bytes32"], [receipt.wallet, amounts[index], receipt.receiptId]));
    return Buffer.from(getBytes(keccak256(concat([inner]))));
  });
  const tree = new MerkleTree(
    leaves,
    (value: Buffer) => Buffer.from(getBytes(keccak256(value))),
    { sortLeaves: true, sortPairs: true }
  );
  const root = tree.getHexRoot();
  const proofs = leaves.map((leaf) => tree.getHexProof(leaf));

  const signer = validatorWallet();
  const address = claimsAddress();
  const claims = new Contract(address, claimsAbi, signer);
  const configuredValidator = getAddress(await claims.validator());
  if (configuredValidator !== signer.address) {
    throw new Error(`Validator mismatch: contract expects ${configuredValidator}, server uses ${signer.address}`);
  }
  const tokenAddress = await claims.token();
  const token = new Contract(tokenAddress, tokenAbi, signer.provider);
  if (getAddress(await token.emissionController()) !== address) {
    throw new Error("AIPOUClaims is not the token emission controller");
  }

  const publish = await claims.publishRoot(root);
  const publishReceipt = await publish.wait();
  let rootApproved = false;
  for (let attempt = 0; attempt < 10 && !rootApproved; attempt += 1) {
    rootApproved = await claims.approvedRoots(root);
    if (!rootApproved) await new Promise((resolve) => setTimeout(resolve, 3_000));
  }
  if (!rootApproved) throw new Error("Published Merkle root was not visible through the RPC after 30 seconds");
  const claim = await claims.claimBatch(root, accounts, amounts, receiptIds, proofs);
  const claimReceipt = await claim.wait();
  if (!publishReceipt || !claimReceipt) throw new Error("Settlement transaction receipt is unavailable");

  const batch: ClaimBatch = {
    root,
    receiptIds,
    publishTransaction: publishReceipt.hash,
    claimTransaction: claimReceipt.hash,
    settledAt: new Date().toISOString()
  };
  await markBatchSettled(batch);
  return batch;
}

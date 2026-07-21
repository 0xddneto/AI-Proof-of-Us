import { createHash } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { Wallet } from "ethers";
import { canonicalJson, sha256Hex } from "./canonical.js";
import { collectorFingerprint, verifyCollectorPayload } from "./collector.js";
import { verifyTaskAuthorization } from "./identity.js";
import { beginTask, completeTask } from "./receipts.js";

const TOKEN_ADDRESS = "0x55f0Cc5e51A1284D20337d6cbb18938C8A1ABCbB";
const CLAIMS_ADDRESS = "0x4ca4C98fB784D20EdC8E2A7F531dAab4c6e53058";
const RECEIPT_SCHEME = "aipou-receipt-v1";

const DEMO_ENVIRONMENT_KEYS = [
  "AIPOU_AGENT_PRIVATE_KEY",
  "AIPOU_CONTRACT_ADDRESS",
  "AIPOU_CLAIMS_ADDRESS",
  "AIPOU_DATA_DIR"
] as const;

function deriveFactId(publicKey: string, nonce: string): string {
  const fingerprint = collectorFingerprint(publicKey);
  const material = `${RECEIPT_SCHEME}\n${fingerprint}\n${nonce.toLowerCase()}`;
  return `0x${createHash("sha256").update(material).digest("hex")}`;
}

export interface LocalDemoResult {
  mode: "local_receipt_demo";
  wallet: string;
  storage: "removed_after_demo";
  frameworkMetadata: {
    aipou: {
      type: "aipou.receipt";
      workReceiptId: string;
      receiptId: string;
      factId: string;
      evidenceClass: "issuer_asserted";
      scheme: "aipou-receipt-v1";
      status: "local_demo";
      trustTier: "client_signed" | "provider_signed";
    };
  };
  verification: {
    walletAuthorization: boolean;
    collectorSignature: boolean;
  };
  safety: {
    networkRequired: false;
    fundsMoved: false;
    claimSubmitted: false;
    rawPromptStored: false;
    rawOutputStored: false;
    privateKeyPrinted: false;
  };
}

export async function runLocalReceiptDemo(): Promise<LocalDemoResult> {
  const previousEnvironment = new Map(
    DEMO_ENVIRONMENT_KEYS.map((key) => [key, process.env[key]])
  );
  const dataDir = await mkdtemp(path.join(os.tmpdir(), "aipou-one-command-demo-"));
  const wallet = Wallet.createRandom();

  process.env.AIPOU_AGENT_PRIVATE_KEY = wallet.privateKey;
  process.env.AIPOU_CONTRACT_ADDRESS = TOKEN_ADDRESS;
  process.env.AIPOU_CLAIMS_ADDRESS = CLAIMS_ADDRESS;
  process.env.AIPOU_DATA_DIR = dataDir;

  try {
    const taskHash = sha256Hex(canonicalJson({
      kind: "demo.one-command-adoption",
      intent: "create a private local AIPOU receipt without setup"
    }));
    const outputHash = sha256Hex(canonicalJson({
      status: "ok",
      artifact: "local receipt reference"
    }));
    const session = await beginTask({
      provider: "local-demo",
      model: "aipou-one-command-demo",
      client: "aipou-cli",
      taskHash,
      chainId: 8453,
      verifyingContract: CLAIMS_ADDRESS
    });
    const receipt = await completeTask({
      nonce: session.nonce,
      inputTokens: 18,
      outputTokens: 12,
      durationSeconds: 1,
      outputHash
    });
    const { collectorSignature, ...signedPayload } = receipt;

    return {
      mode: "local_receipt_demo",
      wallet: receipt.wallet,
      storage: "removed_after_demo",
      frameworkMetadata: {
        aipou: {
          type: "aipou.receipt",
          workReceiptId: receipt.receiptId,
          receiptId: receipt.receiptId,
          factId: deriveFactId(receipt.collectorPublicKey, receipt.nonce),
          evidenceClass: "issuer_asserted",
          scheme: RECEIPT_SCHEME,
          status: "local_demo",
          trustTier: receipt.trustTier
        }
      },
      verification: {
        walletAuthorization: verifyTaskAuthorization(session),
        collectorSignature: verifyCollectorPayload(
          signedPayload,
          collectorSignature,
          receipt.collectorPublicKey
        )
      },
      safety: {
        networkRequired: false,
        fundsMoved: false,
        claimSubmitted: false,
        rawPromptStored: false,
        rawOutputStored: false,
        privateKeyPrinted: false
      }
    };
  } finally {
    await rm(dataDir, { recursive: true, force: true });
    for (const key of DEMO_ENVIRONMENT_KEYS) {
      const previous = previousEnvironment.get(key);
      if (previous === undefined) delete process.env[key];
      else process.env[key] = previous;
    }
  }
}

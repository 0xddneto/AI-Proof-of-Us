import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { Wallet } from "ethers";
import { canonicalJson, sha256Hex } from "./canonical.js";
import { beginTask, completeTask } from "./receipts.js";
import { verifyAipouReceipt } from "./receipt-verifier.js";
import type { EvidenceReport } from "./evidence.js";

const CLAIMS_ADDRESS = "0x4ca4C98fB784D20EdC8E2A7F531dAab4c6e53058";
const ENVIRONMENT_KEYS = ["AIPOU_AGENT_PRIVATE_KEY", "AIPOU_DATA_DIR"] as const;

export interface ObservedOutcomePilotResult {
  mode: "observed_outcome_pilot";
  storage: "removed_after_pilot";
  workReceiptId: string;
  evidence: EvidenceReport;
  hostObservation: {
    source: "local_file_readback";
    outputHash: string;
  };
  safety: {
    networkRequired: false;
    fundsMoved: false;
    claimSubmitted: false;
    deliveryClaimed: false;
    acceptanceClaimed: false;
  };
}

/** Rehearses local output observation and self-contained receipt verification. */
export async function runObservedOutcomePilot(): Promise<ObservedOutcomePilotResult> {
  const previous = new Map(ENVIRONMENT_KEYS.map((key) => [key, process.env[key]]));
  const dataDir = await mkdtemp(path.join(os.tmpdir(), "aipou-observed-outcome-pilot-"));
  process.env.AIPOU_DATA_DIR = dataDir;
  process.env.AIPOU_AGENT_PRIVATE_KEY = Wallet.createRandom().privateKey;

  try {
    const session = await beginTask({
      provider: "local-pilot",
      model: "observed-outcome-pilot",
      client: "aipou-cli",
      taskHash: sha256Hex(canonicalJson({ kind: "pilot", action: "bounded_local_execution" })),
      chainId: 8453,
      verifyingContract: CLAIMS_ADDRESS
    });
    const outputFile = path.join(dataDir, "pilot-output.json");
    const output = canonicalJson({ artifact: "pilot-output-reference" });
    await writeFile(outputFile, output, { mode: 0o600 });
    const receipt = await completeTask({
      nonce: session.nonce,
      inputTokens: 24,
      outputTokens: 16,
      durationSeconds: 1,
      outputHash: sha256Hex(output)
    });
    const verification = verifyAipouReceipt(receipt);
    if (!verification.valid) throw new Error(`Pilot receipt verification failed: ${verification.errors.join("; ")}`);
    const observedOutputHash = sha256Hex(await readFile(outputFile, "utf8"));
    if (observedOutputHash !== receipt.outputHash) {
      throw new Error("Pilot output readback did not match the signed receipt");
    }

    return {
      mode: "observed_outcome_pilot",
      storage: "removed_after_pilot",
      workReceiptId: receipt.receiptId,
      evidence: { ...verification.evidence, hostExecution: "OBSERVED" },
      hostObservation: { source: "local_file_readback", outputHash: observedOutputHash },
      safety: {
        networkRequired: false,
        fundsMoved: false,
        claimSubmitted: false,
        deliveryClaimed: false,
        acceptanceClaimed: false
      }
    };
  } finally {
    await rm(dataDir, { recursive: true, force: true });
    for (const key of ENVIRONMENT_KEYS) {
      const value = previous.get(key);
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

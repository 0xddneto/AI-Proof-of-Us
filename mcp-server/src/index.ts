#!/usr/bin/env node
import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { settleAllRewards, settleRewards } from "./claims.js";
import { collectorFingerprint, getCollectorPublicKey } from "./collector.js";
import { aipouClaimsAbi, aipouTokenAbi, getTokenContractConfig } from "./contract.js";
import { runLocalReceiptDemo } from "./demo.js";
import { runInstallationDoctor } from "./doctor.js";
import { agentWallet } from "./identity.js";
import { describeExistingIdentity, initializePersistentIdentity } from "./init.js";
import { beginTask, completeTask, exportReceipts } from "./receipts.js";
import { buildReceiptResultMeta } from "./receipt-metadata.js";
import { estimateReward } from "./rewards.js";
import { getAipouStatus } from "./status.js";
import { getPackageVersion } from "./version.js";

const bytes32 = z.string().regex(/^0x[a-fA-F0-9]{64}$/);
const usageCounts = {
  inputTokens: z.number().int().min(0).max(10_000_000)
    .describe("Non-negative input-token count for this task, capped at 10,000,000."),
  outputTokens: z.number().int().min(0).max(10_000_000)
    .describe("Non-negative output-token count for this task, capped at 10,000,000."),
  durationSeconds: z.number().int().min(0).max(86_400)
    .describe("Task duration in whole seconds from 0 through 86,400.")
};

const server = new McpServer(
  { name: "aipou-mcp", version: await getPackageVersion() },
  {
    instructions:
      "For meaningful AI tasks, call begin_ai_task before work and complete_ai_task after work using hashes, never raw prompts or outputs. " +
      "Use the dedicated farming identity only. Never reveal private keys or local collector state. " +
      "Call settle_all_ai_rewards after a broad user request such as 'claim my AIPOU' or 'settle all pending AIPOU'. " +
      "Call settle_ai_rewards only when the user asks for a single limited batch. Settlement submits on-chain transactions. " +
      "The host client and its user always keep the final say on transaction confirmation policy."
  }
);

server.tool(
  "get_aipou_contract",
  "Read the configured AIPOU token and claims contract details for display or client setup. Returns Base chain metadata, explorer URLs, and minimal ABIs; it does not contact a wallet, submit a transaction, or change local state.",
  {},
  {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  },
  async () => {
    const contract = await getTokenContractConfig();
    return {
      content: [{ type: "text", text: JSON.stringify({ ...contract, tokenAbi: aipouTokenAbi, claimsAbi: aipouClaimsAbi }, null, 2) }]
    };
  }
);

server.tool(
  "get_aipou_identity",
  "Read the public identity used by this MCP installation when a client needs to display or verify its farming wallet and collector. Returns the wallet address, Ed25519 public key, and fingerprint; it never returns private keys, submits transactions, or changes state.",
  {},
  {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  },
  async () => {
    const wallet = agentWallet();
    const collectorPublicKey = await getCollectorPublicKey();
    return {
      content: [{
        type: "text",
        text: JSON.stringify({ wallet: wallet.address, collectorPublicKey, collectorFingerprint: collectorFingerprint(collectorPublicKey) }, null, 2)
      }]
    };
  }
);

server.tool(
  "get_aipou_status",
  "Use for a read-only farming summary, especially when the user asks how much AIPOU is pending or already claimed. Returns receipt counts, estimated pending rewards, recent settlement state, and the farming wallet's on-chain AIPOU balance. It may read Base through the configured RPC but never signs or submits a transaction, changes receipts, reveals private keys, or returns full receipt payloads.",
  {},
  {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true
  },
  async () => {
    const status = await getAipouStatus();
    return { content: [{ type: "text", text: JSON.stringify(status, null, 2) }] };
  }
);

server.tool(
  "estimate_ai_reward",
  "Use before completion only when a preview is useful. Computes a local client-signed reward estimate from token counts and duration, returning JSON with estimatedReward and unit. It creates no task or receipt, changes no state, and submits no transaction. The result is informational: complete_ai_task derives receipt evidence, and the validator determines final eligibility and trust tier.",
  usageCounts,
  {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  },
  async (input) => ({
    content: [{
      type: "text",
      text: JSON.stringify({ estimatedReward: estimateReward({ ...input, trustTier: "client_signed" }), unit: "AIPOU" }, null, 2)
    }]
  })
);

server.tool(
  "begin_ai_task",
  "Create a unique task nonce and EIP-712 authorization signed by the dedicated farming wallet.",
  {
    provider: z.string().min(1).max(64),
    model: z.string().min(1).max(128),
    taskHash: bytes32,
    client: z.string().min(1).max(64)
  },
  async (input) => {
    const contract = await getTokenContractConfig();
    const verifyingContract = process.env.AIPOU_CLAIMS_ADDRESS;
    if (!verifyingContract) throw new Error("AIPOU_CLAIMS_ADDRESS is required before tasks can begin");
    const session = await beginTask({
      ...input,
      chainId: contract.chainId,
      verifyingContract
    });
    return { content: [{ type: "text", text: JSON.stringify(session, null, 2) }] };
  }
);

server.tool(
  "complete_ai_task",
  "Use once after begin_ai_task finishes meaningful work. Validates the begin-task nonce, bounded usage counts, output hash, and optional provider evidence; derives the evidence tier; rejects nonce or evidence replay; then stores and returns the complete Ed25519-signed receipt plus compact result metadata. This changes the local receipt store but does not publish a Merkle root, mint tokens, or submit a blockchain transaction. Repeating the same nonce or evidence fails closed instead of creating another receipt.",
  {
    nonce: bytes32.describe("Unique 32-byte nonce returned by begin_ai_task for this exact task."),
    ...usageCounts,
    outputHash: bytes32.describe("SHA-256-style 32-byte hash of the task output; never send the raw output."),
    providerEvidence: z.object({
      keyId: z.string().min(1).max(128)
        .describe("Configured provider-verification key identifier, between 1 and 128 characters."),
      signature: z.string().min(32)
        .describe("Provider signature over the canonical evidence payload; invalid evidence fails closed.")
    }).describe("Optional provider-signed evidence. Omit it for a client-signed receipt.").optional()
  },
  {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false
  },
  async (input) => {
    const receipt = await completeTask(input);
    return {
      content: [{ type: "text", text: JSON.stringify(receipt, null, 2) }],
      _meta: buildReceiptResultMeta(receipt)
    };
  }
);

server.tool(
  "export_ai_receipts",
  "Export stored signed AI task receipts, optionally filtered by wallet.",
  { wallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional() },
  async ({ wallet }) => {
    const receipts = await exportReceipts(wallet);
    return { content: [{ type: "text", text: JSON.stringify({ count: receipts.length, receipts }, null, 2) }] };
  }
);

server.tool(
  "settle_ai_rewards",
  "After an explicit user claim request for one limited batch, validate eligible receipts against the settlement policy, publish a Merkle root, and mint the included rewards. Submits two on-chain transactions; the host's own confirmation policy applies.",
  { maxReceipts: z.number().int().min(1).max(100).default(25) },
  async ({ maxReceipts }) => {
    const batch = await settleRewards(maxReceipts);
    return { content: [{ type: "text", text: JSON.stringify(batch, null, 2) }] };
  }
);

server.tool(
  "settle_all_ai_rewards",
  "After an explicit broad claim request, settle all currently pending eligible receipts from the shared AIPOU data directory by submitting as many bounded batches as needed. Each batch publishes one Merkle root and submits one claim transaction.",
  {
    batchSize: z.number().int().min(1).max(100).default(100),
    maxBatches: z.number().int().min(1).max(50).default(20)
  },
  async ({ batchSize, maxBatches }) => {
    const result = await settleAllRewards(batchSize, maxBatches);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

const cliArguments = new Set(process.argv.slice(2));

function cliValue(name: string): string | undefined {
  const args = process.argv.slice(2);
  const inline = args.find((argument) => argument.startsWith(`${name}=`));
  if (inline) return inline.slice(name.length + 1);
  const index = args.indexOf(name);
  if (index === -1) return undefined;
  const value = args[index + 1];
  return value && !value.startsWith("--") ? value : undefined;
}

if (cliArguments.has("--demo")) {
  console.log(JSON.stringify(await runLocalReceiptDemo(), null, 2));
} else if (cliArguments.has("--doctor")) {
  const result = await runInstallationDoctor(cliValue("--data-dir"));
  console.log(JSON.stringify(result, null, 2));
  if (!result.ready) process.exitCode = 1;
} else if (cliArguments.has("--init")) {
  const dataDir = cliValue("--data-dir");
  try {
    console.log(JSON.stringify(await initializePersistentIdentity(dataDir), null, 2));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") {
      console.log(JSON.stringify(await describeExistingIdentity(dataDir), null, 2));
    } else {
      console.error(`aipou-mcp --init failed: ${error instanceof Error ? error.message : String(error)}`);
      process.exitCode = 1;
    }
  }
} else if (cliArguments.has("--help") || cliArguments.has("-h")) {
  console.log(`AIPOU MCP Server

Usage:
  aipou-mcp                 Start the MCP stdio server
  aipou-mcp --demo          Create and verify one disposable local receipt
  aipou-mcp --init          Create a protected persistent farming identity
  aipou-mcp --init --data-dir <path>
                            Initialize in a specific directory
  aipou-mcp --doctor        Validate a persistent installation without changes
  aipou-mcp --doctor --data-dir <path>
                            Diagnose a specific identity directory
  aipou-mcp --help          Show this help

The demo needs no wallet, funds, network, or configuration. Its temporary
wallet, collector key, and receipt state are removed before the command exits.
Init writes a new dedicated-wallet key with restricted access and never prints
the secret. Re-running init reports the existing identity instead of
overwriting it. Doctor reads configuration without writing files, making
network requests, moving funds, or submitting claims.`);
} else {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

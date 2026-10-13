#!/usr/bin/env node
import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { settleAllRewards, settleRewards } from "./claims.js";
import { collectorFingerprint, getCollectorPublicKey } from "./collector.js";
import { aipouClaimsAbi, aipouTokenAbi, getTokenContractConfig } from "./contract.js";
import { runLocalReceiptDemo } from "./demo.js";
import { runObservedOutcomePilot } from "./observed-outcome-pilot.js";
import { runInstallationDoctor } from "./doctor.js";
import { agentWallet } from "./identity.js";
import { describeExistingIdentity, initializePersistentIdentity } from "./init.js";
import { beginTask, completeTask, exportReceipts } from "./receipts.js";
import { buildReceiptResultMeta } from "./receipt-metadata.js";
import { createPayboxWorkLink } from "./paybox-link.js";
import { createTechnocoreWorkLink } from "./technocore-link.js";
import { estimateReward } from "./rewards.js";
import { getAipouStatus } from "./status.js";
import { verifyAipouReceipt } from "./receipt-verifier.js";
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
  "Use this first when the user asks for pending, claimed, or wallet-balance information; use a settlement tool only after an explicit claim request. Returns a read-only JSON summary of receipt counts, estimated pending AIPOU, prior settlement state, and the farming wallet's on-chain AIPOU balance. It may read Base through the configured RPC, but it never signs or submits a transaction, changes receipts, reveals private keys, or returns full receipt payloads.",
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
  "Use before complete_ai_task only when a preview is useful. Provide non-negative inputTokens, outputTokens, and durationSeconds for one task; it returns JSON with estimatedReward and unit for a client-signed estimate. It creates no task or receipt, changes no state, and submits no transaction. The result is informational: complete_ai_task derives the receipt evidence, and the validator determines final eligibility and trust tier.",
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
  "Use once before meaningful AI work to create a task session. Provide the provider, model, client, and a 32-byte hash of the task description; returns a unique nonce and EIP-712 authorization signed by the dedicated farming wallet. This writes a pending local task session but does not publish, mint, or submit an on-chain transaction. Pass the returned nonce to complete_ai_task; do not reuse it for another task.",
  {
    provider: z.string().min(1).max(64)
      .describe("AI provider name for this task session, from 1 through 64 characters."),
    model: z.string().min(1).max(128)
      .describe("Provider model identifier used for this task, from 1 through 128 characters."),
    taskHash: bytes32.describe("32-byte hash of the task description; never send the raw prompt or task text."),
    client: z.string().min(1).max(64)
      .describe("Host client or agent identifier that starts this task session, from 1 through 64 characters.")
  },
  {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false
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
  "Use exactly once after begin_ai_task finishes meaningful work. Supply that session's nonce, non-negative inputTokens and outputTokens, whole-second durationSeconds, and a 32-byte outputHash; providerEvidence is optional and only for a configured provider key. It validates the nonce and bounded usage, derives the evidence tier, rejects replay, then writes the local receipt store and returns an Ed25519-signed receipt plus compact workReceiptId metadata. It does not publish a Merkle root, mint tokens, or submit a blockchain transaction. Use get_aipou_status to inspect recorded work; repeating a nonce or evidence fails closed instead of creating another receipt.",
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
  "Export signed receipts already stored in this MCP installation, optionally limited to one farming wallet address. Returns JSON with count and receipt payloads, so use it only where local receipt data is appropriate to expose. It does not create a receipt, validate a claim, contact Base, or submit a transaction; use get_aipou_status instead for a compact private summary.",
  {
    wallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/)
      .describe("Optional 20-byte farming wallet address filter. Omit it to export every locally stored receipt.")
      .optional()
  },
  {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  },
  async ({ wallet }) => {
    const receipts = await exportReceipts(wallet);
    return { content: [{ type: "text", text: JSON.stringify({ count: receipts.length, receipts }, null, 2) }] };
  }
);

server.tool(
  "verify_aipou_receipt",
  "Verify the self-contained integrity, wallet authorization, and collector signature of one supplied AIPOU receipt. Returns separately typed evidence states; it does not trust a collector, query a registry, submit a claim, prove delivery, business acceptance, settlement, or external effect.",
  {
    receipt: z.record(z.unknown())
      .describe("A receipt object containing hashes and signatures only. Do not include raw prompts, outputs, private keys, or customer data.")
  },
  {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  },
  async ({ receipt }) => ({
    content: [{ type: "text", text: JSON.stringify(verifyAipouReceipt(receipt), null, 2) }]
  })
);

server.tool(
  "create_paybox_work_link",
  "Derive and return a digest-only external evidence link between an existing AIPOU workReceiptId and an opaque Paybox operation artifact. It is a pure local calculation: it does not persist the link, call Paybox, unlock a wallet, create a payment, sign a transaction, or change AIPOU claim eligibility. Use it for portable correlation only, and verify both artifacts with their native systems before relying on the returned link.",
  {
    workReceiptId: z.string().regex(/^0x[a-f0-9]{64}$/)
      .describe("Existing lowercase AIPOU workReceiptId."),
    payboxOperationId: z.string().min(1).max(256)
      .describe("Opaque Paybox operation reference. Never send a credential, wallet address, payment token, or secret."),
    payboxOperationDigest: z.string().regex(/^sha256:[a-f0-9]{64}$/)
      .describe("Lowercase SHA-256 digest of the Paybox operation artifact bytes."),
    issuedAt: z.string().datetime()
      .describe("ISO-8601 time at which this correlation artifact is issued.")
  },
  {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  },
  async (input) => ({
    content: [{ type: "text", text: JSON.stringify(createPayboxWorkLink(input), null, 2) }]
  })
);

server.tool(
  "create_technocore_work_link",
  "Derive and return a digest-only external evidence link between an existing AIPOU workReceiptId and a Technocore transport artifact. It is a pure local calculation: it does not persist the link, call Technocore, sign a message, read a key, verify a transport signature, change AIPOU claim eligibility, or establish delivery. Use it for portable correlation only, and verify the Technocore artifact with its native verifier before relying on the returned link.",
  {
    workReceiptId: z.string().regex(/^0x[a-f0-9]{64}$/)
      .describe("Existing lowercase AIPOU workReceiptId."),
    transportArtifactId: z.string().min(1).max(256)
      .describe("Opaque Technocore transport artifact reference. Never send a DID private key, seed, passphrase, wallet, or secret."),
    transportArtifactDigest: z.string().regex(/^sha256:[a-f0-9]{64}$/)
      .describe("Lowercase SHA-256 digest of the canonical Technocore transport artifact bytes."),
    issuedAt: z.string().datetime()
      .describe("ISO-8601 time at which this correlation artifact is issued.")
  },
  {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  },
  async (input) => ({
    content: [{ type: "text", text: JSON.stringify(createTechnocoreWorkLink(input), null, 2) }]
  })
);

server.tool(
  "settle_ai_rewards",
  "Use only after an explicit user request to claim one limited batch, not for status or reward previews. maxReceipts defaults to 25 and is capped at 100; the tool validates eligible local receipts against settlement policy, publishes one Merkle root, and mints the included rewards. It submits two Base transactions, so the host client and user must apply their own confirmation policy. Use settle_all_ai_rewards instead for an explicit request to claim all pending eligible receipts.",
  {
    maxReceipts: z.number().int().min(1).max(100).default(25)
      .describe("Maximum eligible receipts to include in this one settlement batch, from 1 through 100; defaults to 25.")
  },
  {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true
  },
  async ({ maxReceipts }) => {
    const batch = await settleRewards(maxReceipts);
    return { content: [{ type: "text", text: JSON.stringify(batch, null, 2) }] };
  }
);

server.tool(
  "settle_all_ai_rewards",
  "Use only after an explicit broad request such as 'claim my AIPOU' or 'settle all pending AIPOU'; do not use it for a status check. batchSize defaults to 100 and maxBatches to 20, with bounds of 1-100 and 1-50, so large queues remain bounded. It validates all currently eligible local receipts and submits Base transactions for each batch: one Merkle-root publication and one claim transaction per batch. The host client and user must apply their own confirmation policy; use settle_ai_rewards when the user asks for one limited batch.",
  {
    batchSize: z.number().int().min(1).max(100).default(100)
      .describe("Eligible receipts per settlement batch, from 1 through 100; defaults to 100."),
    maxBatches: z.number().int().min(1).max(50).default(20)
      .describe("Maximum settlement batches to submit in this call, from 1 through 50; defaults to 20.")
  },
  {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true
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
} else if (cliArguments.has("--pilot")) {
  console.log(JSON.stringify(await runObservedOutcomePilot(), null, 2));
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
  aipou-mcp --pilot         Rehearse a bounded lifecycle and report typed evidence states
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
network requests, moving funds, or submitting claims. The pilot is also
offline and disposable: it does not claim delivery, acceptance, settlement,
or external effect.`);
} else {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

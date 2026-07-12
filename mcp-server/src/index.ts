#!/usr/bin/env node
import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { settleAllRewards, settleRewards } from "./claims.js";
import { collectorFingerprint, getCollectorPublicKey } from "./collector.js";
import { aipouClaimsAbi, aipouTokenAbi, getTokenContractConfig } from "./contract.js";
import { agentWallet } from "./identity.js";
import { beginTask, completeTask, exportReceipts } from "./receipts.js";
import { estimateReward } from "./rewards.js";
import { getAipouStatus } from "./status.js";

const bytes32 = z.string().regex(/^0x[a-fA-F0-9]{64}$/);
const usageCounts = {
  inputTokens: z.number().int().min(0).max(10_000_000),
  outputTokens: z.number().int().min(0).max(10_000_000),
  durationSeconds: z.number().int().min(0).max(86_400)
};

const server = new McpServer(
  { name: "aipou-mcp", version: "0.2.2" },
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
  "Return the configured AIPOU token contract address, Base network details, explorer URL, and minimal ABI.",
  {},
  async () => {
    const contract = await getTokenContractConfig();
    return {
      content: [{ type: "text", text: JSON.stringify({ ...contract, tokenAbi: aipouTokenAbi, claimsAbi: aipouClaimsAbi }, null, 2) }]
    };
  }
);

server.tool(
  "get_aipou_identity",
  "Return the dedicated farming wallet address and public Ed25519 collector key. Private keys are never returned.",
  {},
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
  "Show recorded, pending, and already claimed AIPOU receipts plus the farming wallet's on-chain AIPOU balance. Does not reveal private keys or full receipt payloads.",
  {},
  async () => {
    const status = await getAipouStatus();
    return { content: [{ type: "text", text: JSON.stringify(status, null, 2) }] };
  }
);

server.tool(
  "estimate_ai_reward",
  "Estimate the client-signed AIPOU reward before a task is completed. The final tier is derived by the validator.",
  usageCounts,
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
  "Complete a unique task, derive its trust tier, reject duplicate evidence, and create an Ed25519-signed receipt.",
  {
    nonce: bytes32,
    ...usageCounts,
    outputHash: bytes32,
    providerEvidence: z.object({
      keyId: z.string().min(1).max(128),
      signature: z.string().min(32)
    }).optional()
  },
  async (input) => {
    const receipt = await completeTask(input);
    return { content: [{ type: "text", text: JSON.stringify(receipt, null, 2) }] };
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

const transport = new StdioServerTransport();
await server.connect(transport);

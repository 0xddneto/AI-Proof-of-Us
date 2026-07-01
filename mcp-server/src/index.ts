#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { aipouTokenAbi, getTokenContractConfig } from "./contract.js";
import { exportReceipts, recordReceipt } from "./receipts.js";
import { estimateReward } from "./rewards.js";

const trustTier = z.enum(["self_reported", "client_signed", "provider_signed", "task_verified"]);

const usageSchema = {
  wallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  provider: z.string().min(1).max(64),
  model: z.string().min(1).max(128),
  inputTokens: z.number().int().min(0).max(10_000_000),
  outputTokens: z.number().int().min(0).max(10_000_000),
  durationSeconds: z.number().int().min(0).max(86_400),
  taskHash: z.string().min(8).max(128),
  outputHash: z.string().min(8).max(128),
  client: z.string().min(1).max(64),
  trustTier
};

const server = new McpServer({
  name: "aipou-mcp",
  version: "0.1.0"
});

server.tool(
  "get_aipou_contract",
  "Return the configured AIPOU token contract address, Base network details, explorer URL, and minimal ABI.",
  {},
  async () => {
    const contract = await getTokenContractConfig();

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ ...contract, abi: aipouTokenAbi }, null, 2)
        }
      ]
    };
  }
);

server.tool(
  "estimate_ai_reward",
  "Estimate AIPOU reward units for an AI usage event before recording a receipt.",
  {
    inputTokens: usageSchema.inputTokens,
    outputTokens: usageSchema.outputTokens,
    durationSeconds: usageSchema.durationSeconds,
    trustTier
  },
  async (input) => {
    const reward = estimateReward(input);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ estimatedReward: reward, unit: "AIPOU" }, null, 2)
        }
      ]
    };
  }
);

server.tool(
  "record_ai_usage",
  "Record a privacy-preserving signed AI usage receipt for future AIPOU reward claims.",
  usageSchema,
  async (input) => {
    const receipt = await recordReceipt(input);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(receipt, null, 2)
        }
      ]
    };
  }
);

server.tool(
  "export_ai_receipts",
  "Export locally stored AI usage receipts, optionally filtered by wallet.",
  {
    wallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional()
  },
  async ({ wallet }) => {
    const receipts = await exportReceipts(wallet);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ count: receipts.length, receipts }, null, 2)
        }
      ]
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);

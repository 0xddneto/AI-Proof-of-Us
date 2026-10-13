import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { Wallet, getAddress, hexlify, isAddress, verifyTypedData } from "ethers";
import type { TaskSession } from "./types.js";

export const authorizationTypes = {
  TaskAuthorization: [
    { name: "wallet", type: "address" },
    { name: "nonce", type: "bytes32" },
    { name: "taskHash", type: "bytes32" },
    { name: "provider", type: "string" },
    { name: "model", type: "string" },
    { name: "issuedAt", type: "uint256" }
  ]
};

export const DEFAULT_TASK_SESSION_TTL_SECONDS = 24 * 60 * 60;

function taskSessionTtlSeconds(): number {
  const configured = process.env.AIPOU_TASK_SESSION_TTL_SECONDS;
  if (!configured) return DEFAULT_TASK_SESSION_TTL_SECONDS;
  const value = Number.parseInt(configured, 10);
  if (!Number.isInteger(value) || value < 60 || value > 7 * DEFAULT_TASK_SESSION_TTL_SECONDS) {
    throw new Error("AIPOU_TASK_SESSION_TTL_SECONDS must be an integer from 60 through 604800");
  }
  return value;
}

export function taskSessionExpiry(session: Pick<TaskSession, "issuedAt" | "expiresAt">): number {
  return session.expiresAt ?? session.issuedAt + taskSessionTtlSeconds();
}

export function isTaskSessionExpired(
  session: Pick<TaskSession, "issuedAt" | "expiresAt">,
  nowSeconds = Math.floor(Date.now() / 1000)
): boolean {
  return nowSeconds >= taskSessionExpiry(session);
}

function readKeyFile(keyFile: string): string {
  try {
    return readFileSync(path.resolve(keyFile), "utf8").trim();
  } catch {
    throw new Error(
      `AIPOU_AGENT_KEY_FILE could not be read (${keyFile}); ` +
      "run aipou-mcp --init to create a dedicated wallet key"
    );
  }
}

export function agentWallet(): Wallet {
  const inlinePrivateKey = process.env.AIPOU_AGENT_PRIVATE_KEY?.trim();
  const keyFile = process.env.AIPOU_AGENT_KEY_FILE;
  const privateKey = inlinePrivateKey || (keyFile ? readKeyFile(keyFile) : undefined);
  if (!privateKey) {
    throw new Error(
      "AIPOU_AGENT_PRIVATE_KEY or AIPOU_AGENT_KEY_FILE is required; " +
      "run aipou-mcp --init to create a dedicated wallet, never use a primary wallet"
    );
  }
  return new Wallet(privateKey);
}

export async function createTaskSession(input: {
  provider: string;
  model: string;
  taskHash: string;
  client: string;
  chainId: number;
  verifyingContract: string;
}): Promise<TaskSession> {
  if (!isAddress(input.verifyingContract)) throw new Error("AIPOU_CLAIMS_ADDRESS must be a valid contract address");
  const wallet = agentWallet();
  const nonce = hexlify(randomBytes(32));
  const issuedAt = Math.floor(Date.now() / 1000);
  const domain = {
    name: "AI Proof of Us",
    version: "1",
    chainId: input.chainId,
    verifyingContract: getAddress(input.verifyingContract)
  };
  const value = {
    wallet: wallet.address,
    nonce,
    taskHash: input.taskHash,
    provider: input.provider,
    model: input.model,
    issuedAt
  };
  const walletAuthorization = await wallet.signTypedData(domain, authorizationTypes, value);

  return {
    ...input,
    wallet: wallet.address,
    nonce,
    issuedAt,
    expiresAt: issuedAt + taskSessionTtlSeconds(),
    walletAuthorization
  };
}

export function verifyTaskAuthorization(session: TaskSession): boolean {
  const domain = {
    name: "AI Proof of Us",
    version: "1",
    chainId: session.chainId,
    verifyingContract: session.verifyingContract
  };
  const value = {
    wallet: session.wallet,
    nonce: session.nonce,
    taskHash: session.taskHash,
    provider: session.provider,
    model: session.model,
    issuedAt: session.issuedAt
  };
  return verifyTypedData(domain, authorizationTypes, value, session.walletAuthorization) === session.wallet;
}

import { randomBytes } from "node:crypto";
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

export function agentWallet(): Wallet {
  const privateKey = process.env.AIPOU_AGENT_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("AIPOU_AGENT_PRIVATE_KEY is required; use a dedicated farming wallet, never a primary wallet");
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

  return { ...input, wallet: wallet.address, nonce, issuedAt, walletAuthorization };
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

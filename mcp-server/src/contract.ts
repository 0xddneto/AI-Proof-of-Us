import { readFile } from "node:fs/promises";
import path from "node:path";

export interface TokenContractConfig {
  name: string;
  symbol: string;
  address: string | null;
  logoURI: string | null;
  decimals: number;
  chainId: number;
  chainName: string;
  rpcUrl: string;
  blockExplorer: string;
  explorerUrl: string | null;
  claimsAddress?: string | null;
  claimsExplorerUrl?: string | null;
  source: "env" | "deployment_file" | "unconfigured";
}

interface DeploymentFile {
  token?: {
    name?: string;
    symbol?: string;
    address?: string;
    logoURI?: string;
    decimals?: number;
  };
  chain?: {
    id?: number;
    name?: string;
    explorer?: string;
  };
}

const DEFAULT_LOGO_URI = "https://raw.githubusercontent.com/0xddneto/AI-Proof-of-Us/main/assets/token/aipou.png";

export const aipouTokenAbi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function emissionController() view returns (address)",
  "function mintUsageReward(address to, uint256 amount)"
];

export const aipouClaimsAbi = [
  "function validator() view returns (address)",
  "function approvedRoots(bytes32 root) view returns (bool)",
  "function claimedReceipts(bytes32 receiptId) view returns (bool)",
  "function claim(bytes32 root, address account, uint256 amount, bytes32 receiptId, bytes32[] proof)"
];

async function configuredClaimsAddress(): Promise<string | null> {
  if (process.env.AIPOU_CLAIMS_ADDRESS) return process.env.AIPOU_CLAIMS_ADDRESS;
  const claimsPath = path.resolve(process.env.AIPOU_CLAIMS_DEPLOYMENT_FILE || "deployments/base-claims.json");
  try {
    const deployment = JSON.parse(await readFile(claimsPath, "utf8")) as { address?: string };
    return deployment.address || null;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

function envConfig(): TokenContractConfig | null {
  const address = process.env.AIPOU_CONTRACT_ADDRESS;

  if (!address) {
    return null;
  }

  const blockExplorer = process.env.AIPOU_BLOCK_EXPLORER || "https://basescan.org";

  return {
    name: "AI Proof of Use",
    symbol: "AIPOU",
    address,
    logoURI: process.env.AIPOU_LOGO_URI || DEFAULT_LOGO_URI,
    decimals: 18,
    chainId: Number(process.env.AIPOU_CHAIN_ID || 8453),
    chainName: process.env.AIPOU_CHAIN_NAME || "Base Mainnet",
    rpcUrl: process.env.AIPOU_RPC_URL || "https://mainnet.base.org",
    blockExplorer,
    explorerUrl: `${blockExplorer}/token/${address}`,
    source: "env"
  };
}

async function deploymentFileConfig(): Promise<TokenContractConfig | null> {
  const deploymentPath = path.resolve(process.env.AIPOU_DEPLOYMENT_FILE || "deployments/base.json");

  try {
    const deployment = JSON.parse(await readFile(deploymentPath, "utf8")) as DeploymentFile;
    const address = deployment.token?.address;

    if (!address) {
      return null;
    }

    const blockExplorer = deployment.chain?.explorer || "https://basescan.org";

    return {
      name: deployment.token?.name || "AI Proof of Use",
      symbol: deployment.token?.symbol || "AIPOU",
      address,
      logoURI: deployment.token?.logoURI || process.env.AIPOU_LOGO_URI || DEFAULT_LOGO_URI,
      decimals: deployment.token?.decimals || 18,
      chainId: deployment.chain?.id || 8453,
      chainName: deployment.chain?.name || "Base Mainnet",
      rpcUrl: process.env.AIPOU_RPC_URL || "https://mainnet.base.org",
      blockExplorer,
      explorerUrl: `${blockExplorer}/token/${address}`,
      source: "deployment_file"
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

export async function getTokenContractConfig(): Promise<TokenContractConfig> {
  let config: TokenContractConfig;
  const fromEnv = envConfig();
  if (fromEnv) {
    config = fromEnv;
  } else {
    const fromFile = await deploymentFileConfig();
    config = fromFile || {
      name: "AI Proof of Use",
      symbol: "AIPOU",
      address: null,
      logoURI: process.env.AIPOU_LOGO_URI || DEFAULT_LOGO_URI,
      decimals: 18,
      chainId: 8453,
      chainName: "Base Mainnet",
      rpcUrl: "https://mainnet.base.org",
      blockExplorer: "https://basescan.org",
      explorerUrl: null,
      source: "unconfigured"
    };
  }

  const claimsAddress = await configuredClaimsAddress();
  return {
    ...config,
    claimsAddress,
    claimsExplorerUrl: claimsAddress ? `${config.blockExplorer}/address/${claimsAddress}` : null
  };
}

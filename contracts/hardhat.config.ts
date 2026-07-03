import "dotenv/config";
import "@nomicfoundation/hardhat-toolbox";
import type { HardhatUserConfig } from "hardhat/config";

const deployerKey = process.env.DEPLOYER_PRIVATE_KEY;

const accounts = deployerKey ? [deployerKey] : [];

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    base: {
      url: process.env.BASE_RPC_URL || "https://mainnet.base.org",
      chainId: 8453,
      accounts
    },
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
      chainId: 84532,
      accounts
    }
  },
  etherscan: {
    apiKey: {
      base: process.env.BASESCAN_API_KEY || process.env.ETHERSCAN_API_KEY || "",
      baseSepolia: process.env.BASESCAN_API_KEY || process.env.ETHERSCAN_API_KEY || ""
    },
    customChains: [
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org"
        }
      },
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org"
        }
      }
    ]
  },
  sourcify: {
    enabled: true
  }
};

export default config;

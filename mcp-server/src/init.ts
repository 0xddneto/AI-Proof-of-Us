import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { Wallet } from "ethers";
import { restrictToCurrentUser } from "./secure-file.js";

export const AIPOU_TOKEN_ADDRESS = "0x55f0Cc5e51A1284D20337d6cbb18938C8A1ABCbB";
export const AIPOU_CLAIMS_ADDRESS = "0x4ca4C98fB784D20EdC8E2A7F531dAab4c6e53058";

export interface InitializationResult {
  mode: "persistent_identity_initialized" | "persistent_identity_already_initialized";
  wallet: string;
  dataDir: string;
  keyFile: string;
  platformAccessRestricted: true;
  mcpConfig: {
    mcpServers: {
      aipou: {
        command: "npx";
        args: ["-y", "aipou-mcp-server"];
        env: {
          AIPOU_AGENT_KEY_FILE: string;
          AIPOU_DATA_DIR: string;
          AIPOU_CONTRACT_ADDRESS: string;
          AIPOU_CLAIMS_ADDRESS: string;
        };
      };
    };
  };
  safety: {
    dedicatedWalletCreated: boolean;
    privateKeyPrinted: false;
    existingKeyOverwritten: false;
    fundsMoved: false;
    claimSubmitted: false;
  };
}

function identityPaths(dataDirInput?: string): { dataDir: string; keyFile: string } {
  const dataDir = path.resolve(dataDirInput || path.join(os.homedir(), ".aipou"));
  return { dataDir, keyFile: path.join(dataDir, "agent-wallet.key") };
}

function buildResult(
  mode: InitializationResult["mode"],
  walletAddress: string,
  dataDir: string,
  keyFile: string
): InitializationResult {
  return {
    mode,
    wallet: walletAddress,
    dataDir,
    keyFile,
    platformAccessRestricted: true,
    mcpConfig: {
      mcpServers: {
        aipou: {
          command: "npx",
          args: ["-y", "aipou-mcp-server"],
          env: {
            AIPOU_AGENT_KEY_FILE: keyFile,
            AIPOU_DATA_DIR: dataDir,
            AIPOU_CONTRACT_ADDRESS: AIPOU_TOKEN_ADDRESS,
            AIPOU_CLAIMS_ADDRESS
          }
        }
      }
    },
    safety: {
      dedicatedWalletCreated: mode === "persistent_identity_initialized",
      privateKeyPrinted: false,
      existingKeyOverwritten: false,
      fundsMoved: false,
      claimSubmitted: false
    }
  };
}

export async function initializePersistentIdentity(dataDirInput?: string): Promise<InitializationResult> {
  const { dataDir, keyFile } = identityPaths(dataDirInput);
  const wallet = Wallet.createRandom();

  await mkdir(dataDir, { recursive: true, mode: 0o700 });
  await writeFile(keyFile, `${wallet.privateKey}\n`, {
    encoding: "utf8",
    mode: 0o600,
    flag: "wx"
  });
  const platformAccessRestricted = await restrictToCurrentUser(keyFile);
  if (!platformAccessRestricted) {
    await rm(keyFile, { force: true });
    throw new Error("Could not restrict dedicated-wallet key access to the current user");
  }

  return buildResult("persistent_identity_initialized", wallet.address, dataDir, keyFile);
}

// Second-run UX: an existing key is reported, never regenerated or printed.
// Re-applying the ACL heals a broken restriction; the existing key is never removed.
export async function describeExistingIdentity(dataDirInput?: string): Promise<InitializationResult> {
  const { dataDir, keyFile } = identityPaths(dataDirInput);
  const privateKey = (await readFile(keyFile, "utf8")).trim();
  const wallet = new Wallet(privateKey);
  const platformAccessRestricted = await restrictToCurrentUser(keyFile);
  if (!platformAccessRestricted) {
    throw new Error("Existing dedicated-wallet key found, but its access could not be restricted to the current user");
  }
  return buildResult("persistent_identity_already_initialized", wallet.address, dataDir, keyFile);
}

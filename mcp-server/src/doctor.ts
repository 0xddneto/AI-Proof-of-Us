import { constants } from "node:fs";
import { access, readFile, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { Wallet, isAddress } from "ethers";
import { AIPOU_CLAIMS_ADDRESS, AIPOU_TOKEN_ADDRESS } from "./init.js";
import { getPackageVersion } from "./version.js";

type CheckStatus = "pass" | "fail" | "warning";

export interface DoctorCheck {
  status: CheckStatus;
  detail: string;
}

export interface InstallationDoctorResult {
  mode: "installation_doctor";
  ready: boolean;
  version: string;
  wallet: string | null;
  dataDir: string;
  keyFile: string | null;
  keySource: "key_file" | "inline_private_key" | "missing";
  checks: {
    node: DoctorCheck;
    dataDirectory: DoctorCheck;
    identity: DoctorCheck;
    keyPermissions: DoctorCheck;
    tokenAddress: DoctorCheck;
    claimsAddress: DoctorCheck;
    chain: DoctorCheck;
  };
  safety: {
    privateKeyPrinted: false;
    filesWritten: false;
    networkRequestsMade: false;
    fundsMoved: false;
    claimSubmitted: false;
  };
}

function pass(detail: string): DoctorCheck {
  return { status: "pass", detail };
}

function fail(detail: string): DoctorCheck {
  return { status: "fail", detail };
}

function warning(detail: string): DoctorCheck {
  return { status: "warning", detail };
}

export async function runInstallationDoctor(dataDirInput?: string): Promise<InstallationDoctorResult> {
  const dataDir = path.resolve(dataDirInput || process.env.AIPOU_DATA_DIR || path.join(os.homedir(), ".aipou"));
  // An explicit directory is an operator choice and must not be shadowed by
  // inherited client or dotenv identity variables.
  const configuredKeyFile = dataDirInput ? undefined : process.env.AIPOU_AGENT_KEY_FILE?.trim();
  const inlinePrivateKey = dataDirInput ? undefined : process.env.AIPOU_AGENT_PRIVATE_KEY?.trim();
  const keyFile = inlinePrivateKey ? null : path.resolve(configuredKeyFile || path.join(dataDir, "agent-wallet.key"));
  const nodeMajor = Number(process.versions.node.split(".")[0]);
  const tokenAddress = process.env.AIPOU_CONTRACT_ADDRESS?.trim() || AIPOU_TOKEN_ADDRESS;
  const claimsAddress = process.env.AIPOU_CLAIMS_ADDRESS?.trim() || AIPOU_CLAIMS_ADDRESS;
  const chainId = Number(process.env.AIPOU_CHAIN_ID || 8453);

  let dataDirectory = pass("Receipt directory is readable and writable.");
  try {
    await access(dataDir, constants.R_OK | constants.W_OK);
  } catch {
    dataDirectory = fail(`Receipt directory is unavailable (${dataDir}); run aipou-mcp --init first.`);
  }

  let wallet: string | null = null;
  let identity: DoctorCheck;
  let keySource: InstallationDoctorResult["keySource"];
  try {
    const privateKey = inlinePrivateKey || (keyFile ? (await readFile(keyFile, "utf8")).trim() : "");
    if (!privateKey) throw new Error("missing");
    wallet = new Wallet(privateKey).address;
    keySource = inlinePrivateKey ? "inline_private_key" : "key_file";
    identity = inlinePrivateKey
      ? warning("Dedicated wallet key is valid, but a protected key file is safer than an inline environment variable.")
      : pass("Dedicated-wallet key file is readable and valid; its secret was not returned.");
  } catch {
    keySource = "missing";
    identity = fail(`Dedicated wallet key is missing or invalid${keyFile ? ` (${keyFile})` : ""}; run aipou-mcp --init.`);
  }

  let keyPermissions: DoctorCheck;
  if (inlinePrivateKey) {
    keyPermissions = warning("Inline private-key permissions cannot be checked; use the key file created by aipou-mcp --init.");
  } else if (!keyFile) {
    keyPermissions = fail("No dedicated-wallet key file is configured.");
  } else {
    try {
      const keyStat = await stat(keyFile);
      if (process.platform === "win32") {
        keyPermissions = warning("Key file exists; Windows ACLs were not changed or re-applied by this read-only diagnostic.");
      } else if ((keyStat.mode & 0o077) === 0) {
        keyPermissions = pass("Key file has no group or other permission bits.");
      } else {
        keyPermissions = fail("Key file is accessible by group or other users; restrict it to mode 0600.");
      }
    } catch {
      keyPermissions = fail(`Key file permissions could not be inspected (${keyFile}).`);
    }
  }

  const checks = {
    node: Number.isInteger(nodeMajor) && nodeMajor >= 20
      ? pass(`Node.js ${process.versions.node} satisfies the required major version (20+).`)
      : fail(`Node.js ${process.versions.node} is unsupported; install Node.js 20 or newer.`),
    dataDirectory,
    identity,
    keyPermissions,
    tokenAddress: isAddress(tokenAddress)
      ? pass(`AIPOU token address is valid (${tokenAddress}).`)
      : fail("AIPOU_CONTRACT_ADDRESS is not a valid EVM address."),
    claimsAddress: isAddress(claimsAddress)
      ? pass(`AIPOU claims address is valid (${claimsAddress}).`)
      : fail("AIPOU_CLAIMS_ADDRESS is not a valid EVM address."),
    chain: Number.isSafeInteger(chainId) && chainId > 0
      ? (chainId === 8453
        ? pass("Chain ID is Base Mainnet (8453).")
        : warning(`Chain ID ${chainId} is configured instead of Base Mainnet (8453).`))
      : fail("AIPOU_CHAIN_ID must be a positive integer.")
  };

  return {
    mode: "installation_doctor",
    ready: Object.values(checks).every((check) => check.status !== "fail"),
    version: await getPackageVersion(),
    wallet,
    dataDir,
    keyFile,
    keySource,
    checks,
    safety: {
      privateKeyPrinted: false,
      filesWritten: false,
      networkRequestsMade: false,
      fundsMoved: false,
      claimSubmitted: false
    }
  };
}

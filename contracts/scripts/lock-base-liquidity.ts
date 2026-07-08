import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { ethers } from "hardhat";

const LP_TOKEN = "0x3bEA7b68Af54Da779454f82148Ef848c76F78D02";
const EXPECTED_BENEFICIARY = "0x1F92Ee5820A706ed1315F239dE8C53eb1d65dac2";
const LOCK_DURATION_SECONDS = 365 * 24 * 60 * 60;

const lpAbi = [
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)"
];

async function main() {
  const [signer] = await ethers.getSigners();
  if (!signer) throw new Error("DEPLOYER_PRIVATE_KEY is required");
  if (signer.address !== ethers.getAddress(EXPECTED_BENEFICIARY)) {
    throw new Error(`Unexpected signer: ${signer.address}`);
  }

  const network = await ethers.provider.getNetwork();
  if (network.chainId !== 8453n) throw new Error(`Unexpected chain: ${network.chainId}`);

  const lpToken = new ethers.Contract(LP_TOKEN, lpAbi, signer);
  const lpBalance = await lpToken.balanceOf(signer.address);
  if (lpBalance === 0n) throw new Error("Signer has no LP tokens to lock");

  const latestBlock = await ethers.provider.getBlock("latest");
  if (!latestBlock) throw new Error("Latest block is unavailable");
  const unlockTime = latestBlock.timestamp + LOCK_DURATION_SECONDS;

  const Lock = await ethers.getContractFactory("AIPOULiquidityLock", signer);
  const lock = await Lock.deploy(LP_TOKEN, signer.address, unlockTime);
  await lock.waitForDeployment();
  const lockAddress = await lock.getAddress();

  if ((await lock.liquidityToken()) !== ethers.getAddress(LP_TOKEN)) {
    throw new Error("Liquidity token verification failed");
  }
  if ((await lock.beneficiary()) !== signer.address) {
    throw new Error("Beneficiary verification failed");
  }
  if ((await lock.unlockTime()) !== BigInt(unlockTime)) {
    throw new Error("Unlock time verification failed");
  }

  const transferNonce = await ethers.provider.getTransactionCount(signer.address, "pending");
  const transfer = await lpToken.transfer(lockAddress, lpBalance, { nonce: transferNonce });
  const transferReceipt = await transfer.wait();
  if (!transferReceipt || transferReceipt.status !== 1) throw new Error("LP transfer failed");

  const [lockedBalance, remainingBalance] = await Promise.all([
    lpToken.balanceOf(lockAddress),
    lpToken.balanceOf(signer.address)
  ]);
  if (lockedBalance !== lpBalance || remainingBalance !== 0n) {
    throw new Error("Post-transfer LP balance verification failed");
  }

  const deployment = {
    contract: "AIPOULiquidityLock",
    address: lockAddress,
    lpToken: LP_TOKEN,
    beneficiary: signer.address,
    unlockTime,
    unlockDate: new Date(unlockTime * 1000).toISOString(),
    durationDays: 365,
    lockedLpTokens: ethers.formatEther(lockedBalance),
    chain: { id: 8453, name: "Base Mainnet" }
  };

  const deploymentDir = path.resolve("..", "deployments");
  await mkdir(deploymentDir, { recursive: true });
  await writeFile(path.join(deploymentDir, "base-liquidity-lock.json"), `${JSON.stringify(deployment, null, 2)}\n`);
  console.log(JSON.stringify(deployment, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

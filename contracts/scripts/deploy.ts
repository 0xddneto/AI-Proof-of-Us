import { ethers } from "hardhat";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

function envAddress(name: string, fallback: string): string {
  return process.env[name] || fallback;
}

async function main() {
  const [deployer] = await ethers.getSigners();

  if (!deployer) {
    throw new Error("DEPLOYER_PRIVATE_KEY is required to deploy AIPOU to Base.");
  }

  const network = await ethers.provider.getNetwork();
  const deployerBalance = await ethers.provider.getBalance(deployer.address);

  if (deployerBalance === 0n) {
    throw new Error(`Deployer ${deployer.address} has 0 ETH on this network.`);
  }

  const owner = envAddress("TOKEN_OWNER", deployer.address);
  const initialRecipient = envAddress("INITIAL_RECIPIENT", deployer.address);
  const emissionController = envAddress("EMISSION_CONTROLLER", deployer.address);

  const cap = ethers.parseUnits("1000000000", 18);
  const initialSupply = ethers.parseUnits("100000000", 18);

  const AIPOU = await ethers.getContractFactory("AIPOU");
  const token = await AIPOU.deploy(owner, initialRecipient, initialSupply, cap, emissionController);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  const chainId = Number(network.chainId);
  const networkName = chainId === 8453 ? "Base Mainnet" : chainId === 84532 ? "Base Sepolia" : network.name;
  const explorer =
    chainId === 8453 ? "https://basescan.org" : chainId === 84532 ? "https://sepolia.basescan.org" : "";
  const deployment = {
    token: {
      name: "AI Proof of Use",
      symbol: "AIPOU",
      address: tokenAddress,
      decimals: 18,
      cap: cap.toString(),
      initialSupply: initialSupply.toString()
    },
    chain: {
      id: chainId,
      name: networkName,
      explorer
    },
    owner,
    initialRecipient,
    emissionController,
    deployer: deployer.address,
    deployedAt: new Date().toISOString()
  };
  const deploymentDir = path.resolve("deployments");
  const deploymentFile = path.join(deploymentDir, chainId === 8453 ? "base.json" : `${network.name}-${chainId}.json`);

  await mkdir(deploymentDir, { recursive: true });
  await writeFile(deploymentFile, `${JSON.stringify(deployment, null, 2)}\n`);

  console.log("AIPOU deployed to:", tokenAddress);
  console.log("network:", `${networkName} (${chainId})`);
  console.log("deployer:", deployer.address);
  console.log("owner:", owner);
  console.log("initialRecipient:", initialRecipient);
  console.log("emissionController:", emissionController);
  console.log("deploymentFile:", deploymentFile);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

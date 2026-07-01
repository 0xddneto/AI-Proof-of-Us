import "dotenv/config";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ethers, network } from "hardhat";

interface TokenDeployment {
  token?: { address?: string };
}

async function tokenAddress(): Promise<string> {
  if (process.env.AIPOU_CONTRACT_ADDRESS) return ethers.getAddress(process.env.AIPOU_CONTRACT_ADDRESS);
  const deployment = JSON.parse(
    await readFile(path.resolve("..", "deployments", "base.json"), "utf8")
  ) as TokenDeployment;
  if (!deployment.token?.address) throw new Error("AIPOU token address is not configured");
  return ethers.getAddress(deployment.token.address);
}

async function main() {
  const [deployer] = await ethers.getSigners();
  if (!deployer) throw new Error("DEPLOYER_PRIVATE_KEY is required");

  const validatorInput = process.env.CLAIMS_VALIDATOR;
  if (!validatorInput || !ethers.isAddress(validatorInput)) {
    throw new Error("CLAIMS_VALIDATOR must be the public address of the protocol validator wallet");
  }

  const token = await tokenAddress();
  const owner = ethers.getAddress(process.env.CLAIMS_OWNER || deployer.address);
  const validator = ethers.getAddress(validatorInput);
  const Claims = await ethers.getContractFactory("AIPOUClaims");
  const claims = await Claims.deploy(token, owner, validator);
  const deploymentTransaction = claims.deploymentTransaction();
  await claims.waitForDeployment();
  const claimsAddress = await claims.getAddress();

  const aipou = await ethers.getContractAt("AIPOU", token);
  const controllerTransaction = await aipou.setEmissionController(claimsAddress);
  await controllerTransaction.wait();

  let ownershipTransactionHash: string | null = null;
  if (process.env.TRANSFER_TOKEN_OWNERSHIP === "true" && owner !== deployer.address) {
    const ownershipTransaction = await aipou.transferOwnership(owner);
    await ownershipTransaction.wait();
    ownershipTransactionHash = ownershipTransaction.hash;
  }

  let validatorFundingTransactionHash: string | null = null;
  const validatorFunding = process.env.VALIDATOR_FUNDING_ETH;
  if (validatorFunding) {
    const fundingTransaction = await deployer.sendTransaction({
      to: validator,
      value: ethers.parseEther(validatorFunding)
    });
    await fundingTransaction.wait();
    validatorFundingTransactionHash = fundingTransaction.hash;
  }

  const chain = await ethers.provider.getNetwork();
  const result = {
    contract: "AIPOUClaims",
    address: claimsAddress,
    token,
    chain: { id: Number(chain.chainId), name: network.name },
    deployedAt: new Date().toISOString()
  };
  const deploymentDir = path.resolve("..", "deployments");
  await mkdir(deploymentDir, { recursive: true });
  await writeFile(path.join(deploymentDir, "base-claims.json"), `${JSON.stringify(result, null, 2)}\n`);

  console.log("AIPOUClaims deployed to:", claimsAddress);
  console.log("deployment transaction:", deploymentTransaction?.hash || "unavailable");
  console.log("emission controller transaction:", controllerTransaction.hash);
  console.log("ownership transaction:", ownershipTransactionHash || "not transferred");
  console.log("validator funding transaction:", validatorFundingTransactionHash || "not funded");
  console.log("validator:", validator);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

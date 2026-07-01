import { ethers } from "hardhat";

function envAddress(name: string, fallback: string): string {
  return process.env[name] || fallback;
}

async function main() {
  const [deployer] = await ethers.getSigners();

  const owner = envAddress("TOKEN_OWNER", deployer.address);
  const initialRecipient = envAddress("INITIAL_RECIPIENT", deployer.address);
  const emissionController = envAddress("EMISSION_CONTROLLER", deployer.address);

  const cap = ethers.parseUnits("1000000000", 18);
  const initialSupply = ethers.parseUnits("100000000", 18);

  const AIPOU = await ethers.getContractFactory("AIPOU");
  const token = await AIPOU.deploy(owner, initialRecipient, initialSupply, cap, emissionController);
  await token.waitForDeployment();

  console.log("AIPOU deployed to:", await token.getAddress());
  console.log("owner:", owner);
  console.log("initialRecipient:", initialRecipient);
  console.log("emissionController:", emissionController);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


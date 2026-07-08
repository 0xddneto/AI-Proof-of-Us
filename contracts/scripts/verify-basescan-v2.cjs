const fs = require("node:fs");
const path = require("node:path");
const { AbiCoder, getAddress } = require("ethers");

const CHAIN_ID = "8453";
const API_URL = `https://api.etherscan.io/v2/api?chainid=${CHAIN_ID}`;
const RPC_URL = process.env.BASE_RPC_URL || "https://mainnet.base.org";

const targets = {
  token: {
    address: "0x55f0Cc5e51A1284D20337d6cbb18938C8A1ABCbB",
    contractName: "contracts/AIPOU.sol:AIPOU",
    types: ["address", "address", "uint256", "uint256", "address"],
    args: [
      "0x1F92Ee5820A706ed1315F239dE8C53eb1d65dac2",
      "0x1F92Ee5820A706ed1315F239dE8C53eb1d65dac2",
      100000000000000000000000000n,
      1000000000000000000000000000n,
      "0x1F92Ee5820A706ed1315F239dE8C53eb1d65dac2",
    ],
  },
  claims: {
    address: "0x4ca4C98fB784D20EdC8E2A7F531dAab4c6e53058",
    contractName: "contracts/AIPOUClaims.sol:AIPOUClaims",
    types: ["address", "address", "address"],
    args: [
      "0x55f0Cc5e51A1284D20337d6cbb18938C8A1ABCbB",
      "0xdd6cbDB2C549C71d1C3c75a0061209b970B15515",
      "0xdd6cbDB2C549C71d1C3c75a0061209b970B15515",
    ],
  },
  liquidityLock: {
    address: "0xc11197E32dFb2352f262D874acFc54467aee6B52",
    contractName: "contracts/AIPOULiquidityLock.sol:AIPOULiquidityLock",
    types: ["address", "address", "uint64"],
    args: [
      "0x3bEA7b68Af54Da779454f82148Ef848c76F78D02",
      "0x1F92Ee5820A706ed1315F239dE8C53eb1d65dac2",
      1815077809n,
    ],
  },
};

function normalizeImmutableBytecode(bytecode, immutableReferences) {
  const chars = bytecode.replace(/^0x/, "").split("");
  for (const references of Object.values(immutableReferences || {})) {
    for (const { start, length } of references) {
      chars.fill("0", start * 2, (start + length) * 2);
    }
  }
  return chars.join("");
}

async function rpc(method, params) {
  const response = await fetch(RPC_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const payload = await response.json();
  if (!response.ok || payload.error) {
    throw new Error(payload.error?.message || `RPC request failed (${response.status})`);
  }
  return payload.result;
}

function findMatchingBuild(target, deployedCode) {
  const [sourceName, contractName] = target.contractName.split(":");
  const buildInfoDir = path.join(__dirname, "..", "artifacts", "build-info");

  for (const file of fs.readdirSync(buildInfoDir)) {
    if (!file.endsWith(".json")) continue;
    const build = JSON.parse(fs.readFileSync(path.join(buildInfoDir, file), "utf8"));
    const artifact = build.output.contracts?.[sourceName]?.[contractName];
    if (!artifact) continue;

    const expected = artifact.evm.deployedBytecode;
    const normalizedExpected = normalizeImmutableBytecode(
      expected.object,
      expected.immutableReferences,
    );
    const normalizedDeployed = normalizeImmutableBytecode(
      deployedCode,
      expected.immutableReferences,
    );

    if (normalizedExpected === normalizedDeployed) return build;
  }

  throw new Error(`No build-info bytecode matches ${target.address}`);
}

async function api(params) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(`Explorer request failed (${response.status})`);
  return payload;
}

async function verify(targetName) {
  const apiKey = process.env.BASESCAN_API_KEY || process.env.ETHERSCAN_API_KEY;
  if (!apiKey) throw new Error("Set BASESCAN_API_KEY or ETHERSCAN_API_KEY locally");

  const target = targets[targetName];
  if (!target) throw new Error("Usage: node scripts/verify-basescan-v2.cjs token|claims|liquidityLock");

  const deployedCode = await rpc("eth_getCode", [getAddress(target.address), "latest"]);
  if (deployedCode === "0x") throw new Error(`No contract found at ${target.address}`);
  const build = findMatchingBuild(target, deployedCode);
  const constructorArguments = AbiCoder.defaultAbiCoder()
    .encode(target.types, target.args)
    .slice(2);

  const submission = await api({
    apikey: apiKey,
    module: "contract",
    action: "verifysourcecode",
    contractaddress: target.address,
    sourceCode: JSON.stringify(build.input),
    codeformat: "solidity-standard-json-input",
    contractname: target.contractName,
    compilerversion: `v${build.solcLongVersion}`,
    constructorArguments,
  });

  if (submission.status !== "1") {
    if (/already verified/i.test(submission.result || "")) {
      console.log(`${targetName} is already verified: https://basescan.org/address/${target.address}#code`);
      return;
    }
    throw new Error(`Verification submission failed: ${submission.result}`);
  }

  const guid = submission.result;
  for (let attempt = 0; attempt < 24; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const status = await api({
      apikey: apiKey,
      module: "contract",
      action: "checkverifystatus",
      guid,
    });
    if (status.status === "1") {
      console.log(`${targetName} verified: https://basescan.org/address/${target.address}#code`);
      return;
    }
    if (!/pending/i.test(status.result || "")) {
      throw new Error(`Verification failed: ${status.result}`);
    }
  }

  throw new Error(`Verification is still pending. GUID: ${guid}`);
}

verify(process.argv[2]).catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { ethers } from "hardhat";

const TOKEN = "0x55f0Cc5e51A1284D20337d6cbb18938C8A1ABCbB";
const ROUTER = "0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43";
const FACTORY = "0x420DD381b31aEf6683db6B902084cB0FFECe40Da";
const WETH = "0x4200000000000000000000000000000000000006";
const INITIAL_LIQUIDITY = ethers.parseUnits("100000000", 18);
const GAS_RESERVE = ethers.parseEther("0.00005");

const tokenAbi = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)"
];

const routerAbi = [
  "function addLiquidityETH(address token, bool stable, uint256 amountTokenDesired, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline) payable returns (uint256 amountToken, uint256 amountETH, uint256 liquidity)",
  "function getAmountsOut(uint256 amountIn, tuple(address from, address to, bool stable, address factory)[] routes) view returns (uint256[] amounts)",
  "function getReserves(address tokenA, address tokenB, bool stable, address factory) view returns (uint256 reserveA, uint256 reserveB)",
  "function swapExactETHForTokens(uint256 amountOutMin, tuple(address from, address to, bool stable, address factory)[] routes, address to, uint256 deadline) payable returns (uint256[] amounts)"
];

const factoryAbi = [
  "function getPool(address tokenA, address tokenB, bool stable) view returns (address)"
];

async function getEthUsdCents(): Promise<{ price: string; cents: bigint }> {
  const response = await fetch("https://api.coinbase.com/v2/prices/ETH-USD/spot");
  if (!response.ok) throw new Error(`Coinbase price request failed: ${response.status}`);

  const body = (await response.json()) as { data?: { amount?: string } };
  const price = body.data?.amount;
  if (!price || !/^\d+(\.\d+)?$/.test(price)) throw new Error("Invalid ETH-USD spot price");

  const [whole, fraction = ""] = price.split(".");
  const cents = BigInt(whole) * 100n + BigInt(`${fraction}00`.slice(0, 2));
  return { price, cents };
}

function ethForUsdCents(usdCents: bigint, ethUsdCents: bigint): bigint {
  return (usdCents * ethers.WeiPerEther) / ethUsdCents;
}

async function main() {
  const [signer] = await ethers.getSigners();
  if (!signer) throw new Error("DEPLOYER_PRIVATE_KEY is required");
  const recipientInput = process.env.AIPOU_PURCHASE_RECIPIENT;
  if (!recipientInput || !ethers.isAddress(recipientInput)) {
    throw new Error("AIPOU_PURCHASE_RECIPIENT must be a valid wallet address");
  }
  const recipient = ethers.getAddress(recipientInput);

  const token = new ethers.Contract(TOKEN, tokenAbi, signer);
  const router = new ethers.Contract(ROUTER, routerAbi, signer);
  const factory = new ethers.Contract(FACTORY, factoryAbi, signer);
  const { price, cents } = await getEthUsdCents();
  const liquidityEth = ethForUsdCents(100n, cents);
  const purchaseEth = ethForUsdCents(200n, cents);
  const startingBalance = await ethers.provider.getBalance(signer.address);
  const tokenBalance = await token.balanceOf(signer.address);
  const existingPool = await factory.getPool(TOKEN, WETH, false);
  const creatingPool = existingPool === ethers.ZeroAddress;

  if (creatingPool && tokenBalance < INITIAL_LIQUIDITY) {
    throw new Error(`Need 100,000,000 AIPOU; wallet has ${ethers.formatUnits(tokenBalance, 18)}`);
  }
  const requiredEth = purchaseEth + GAS_RESERVE + (creatingPool ? liquidityEth : 0n);
  if (startingBalance < requiredEth) {
    throw new Error(
      `Insufficient ETH: need ${ethers.formatEther(requiredEth)}, have ${ethers.formatEther(startingBalance)}`
    );
  }

  console.log(`ETH-USD spot: $${price}`);
  console.log(
    creatingPool
      ? `Liquidity: ${ethers.formatEther(liquidityEth)} ETH + 100,000,000 AIPOU`
      : `Resuming with existing pool: ${existingPool}`
  );
  console.log(`Purchase: ${ethers.formatEther(purchaseEth)} ETH -> configured recipient`);

  if (creatingPool) {
    const approval = await token.approve(ROUTER, INITIAL_LIQUIDITY);
    await approval.wait();

    const liquidityDeadline = Math.floor(Date.now() / 1000) + 20 * 60;
    const liquidity = await router.addLiquidityETH(
      TOKEN,
      false,
      INITIAL_LIQUIDITY,
      INITIAL_LIQUIDITY,
      liquidityEth,
      signer.address,
      liquidityDeadline,
      { value: liquidityEth }
    );
    await liquidity.wait();
  }
  const pool = await factory.getPool(TOKEN, WETH, false);

  const routes = [{ from: WETH, to: TOKEN, stable: false, factory: FACTORY }];
  let quotedOutput = 0n;
  for (let attempt = 0; attempt < 10 && quotedOutput === 0n; attempt += 1) {
    const quote = await router.getAmountsOut(purchaseEth, routes);
    quotedOutput = quote[quote.length - 1];
    if (quotedOutput === 0n) await new Promise((resolve) => setTimeout(resolve, 3_000));
  }
  if (quotedOutput === 0n) throw new Error("Pool quote remained zero after 30 seconds");
  const minimumOutput = (quotedOutput * 95n) / 100n;
  const [aipouReserveBefore, wethReserveBefore] = await router.getReserves(TOKEN, WETH, false, FACTORY);

  console.log(`On-chain quote: ${ethers.formatUnits(quotedOutput, 18)} AIPOU`);

  const purchaseDeadline = Math.floor(Date.now() / 1000) + 20 * 60;
  const purchase = await router.swapExactETHForTokens(
    minimumOutput,
    routes,
    recipient,
    purchaseDeadline,
    { value: purchaseEth }
  );
  const purchaseReceipt = await purchase.wait();
  if (!purchaseReceipt) throw new Error("Purchase receipt is unavailable");

  const result = {
    chainId: 8453,
    dex: "Aerodrome",
    token: TOKEN,
    pairToken: WETH,
    pool,
    stable: false,
    liquidity: {
      aipou: ethers.formatUnits(aipouReserveBefore, 18),
      eth: ethers.formatEther(wethReserveBefore)
    },
    createdAt: new Date().toISOString()
  };

  const deploymentDir = path.resolve("..", "deployments");
  await mkdir(deploymentDir, { recursive: true });
  await writeFile(path.join(deploymentDir, "base-pool.json"), `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

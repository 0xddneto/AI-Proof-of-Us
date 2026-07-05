import { Contract, JsonRpcProvider, formatUnits } from "ethers";
import { aipouTokenAbi, getTokenContractConfig } from "./contract.js";
import { agentWallet } from "./identity.js";
import { exportStoredReceipts, protocolStateCounts, unsettledReceipts } from "./store.js";

function sumRewards(receipts: { estimatedReward: string }[]): string {
  const total = receipts.reduce((sum, receipt) => sum + Number(receipt.estimatedReward), 0);
  return Number.isInteger(total) ? total.toFixed(0) : total.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
}

export async function getAipouStatus(): Promise<Record<string, unknown>> {
  const wallet = agentWallet().address;
  const contract = await getTokenContractConfig();
  const receipts = await exportStoredReceipts(wallet);
  const pendingReceipts = await unsettledReceipts(Number.MAX_SAFE_INTEGER);
  const walletPendingReceipts = pendingReceipts.filter((receipt) => receipt.wallet.toLowerCase() === wallet.toLowerCase());
  const claimedReceipts = receipts.filter((receipt) => receipt.claimTransaction);
  const counts = await protocolStateCounts();

  let onchain: Record<string, unknown> = { available: false };
  if (contract.address) {
    try {
      const provider = new JsonRpcProvider(contract.rpcUrl);
      const token = new Contract(contract.address, aipouTokenAbi, provider);
      const [decimals, balance, totalSupply] = await Promise.all([
        token.decimals(),
        token.balanceOf(wallet),
        token.totalSupply()
      ]);
      onchain = {
        available: true,
        wallet,
        balance: formatUnits(balance, decimals),
        totalSupply: formatUnits(totalSupply, decimals),
        explorerUrl: `${contract.blockExplorer}/token/${contract.address}?a=${wallet}`
      };
    } catch (error) {
      onchain = {
        available: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  const lastClaim = claimedReceipts
    .filter((receipt) => receipt.claimTransaction)
    .sort((a, b) => Date.parse(b.recordedAt) - Date.parse(a.recordedAt))[0];

  return {
    wallet,
    chainId: contract.chainId,
    tokenAddress: contract.address,
    claimsAddress: contract.claimsAddress,
    receipts: {
      recorded: receipts.length,
      claimed: claimedReceipts.length,
      pending: walletPendingReceipts.length,
      incompleteSessions: counts.incompleteSessions,
      batches: counts.batches
    },
    rewards: {
      claimedEstimated: sumRewards(claimedReceipts),
      pendingEstimated: sumRewards(walletPendingReceipts),
      totalEstimated: sumRewards(receipts),
      unit: "AIPOU"
    },
    latestClaim: lastClaim
      ? {
          receiptId: lastClaim.receiptId,
          transaction: lastClaim.claimTransaction,
          explorerUrl: `${contract.blockExplorer}/tx/${lastClaim.claimTransaction}`,
          recordedAt: lastClaim.recordedAt
        }
      : null,
    onchain
  };
}

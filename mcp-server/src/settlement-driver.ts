import { Contract, JsonRpcProvider, Transaction, Wallet } from "ethers";
import type {
  SettlementDriver,
  SettlementPlan,
  SignedSettlementTransaction,
} from "./settlement-runner.js";

const abi = [
  "function approvedRoots(bytes32) view returns(bool)",
  "function claimedReceipts(bytes32) view returns(bool)",
  "function publishRoot(bytes32)",
  "function claimBatch(bytes32,address[],uint256[],bytes32[],bytes32[][])",
];
export function createSettlementDriver(
  signer: Wallet,
  contract: string,
): SettlementDriver {
  const provider = signer.provider as JsonRpcProvider;
  const claims = new Contract(contract, abi, signer);
  const data = (kind: "publish" | "claim", plan: SettlementPlan) =>
    kind === "publish"
      ? claims.interface.encodeFunctionData("publishRoot", [plan.root])
      : claims.interface.encodeFunctionData("claimBatch", [
          plan.root,
          plan.accounts,
          plan.amounts,
          plan.receiptIds,
          plan.proofs,
        ]);
  const fees = async () => {
    const fee = await provider.getFeeData();
    const gasPrice = fee.maxFeePerGas ?? fee.gasPrice;
    if (gasPrice === null || gasPrice <= 0n)
      throw new Error(
        "SETTLEMENT_FEE_UNAVAILABLE: RPC did not supply a gas price.",
      );
    return fee.maxFeePerGas !== null && fee.maxPriorityFeePerGas !== null
      ? {
          maxFeePerGas: fee.maxFeePerGas,
          maxPriorityFeePerGas: fee.maxPriorityFeePerGas,
        }
      : { gasPrice };
  };
  const budget = async (cost: bigint) => {
    const cap = process.env.AIPOU_MAX_SETTLEMENT_FEE_WEI;
    if (cap && (!/^\d+$/.test(cap) || cost > BigInt(cap)))
      throw new Error(
        "SETTLEMENT_FEE_CAP: required fee exceeds AIPOU_MAX_SETTLEMENT_FEE_WEI.",
      );
    if ((await provider.getBalance(signer.address)) < cost) {
      throw new Error(
        `SETTLEMENT_INSUFFICIENT_GAS: validator needs up to ${cost} wei for this batch including a conservative Base data-fee allowance. Fund the validator on Base and retry; no automatic transfer is performed.`,
      );
    }
  };
  return {
    approved: (root) => claims.approvedRoots(root),
    claimed: (id) => claims.claimedReceipts(id),
    preflight: async (plan, publishNeeded) => {
      const fee = await fees();
      const price = "gasPrice" in fee ? fee.gasPrice! : fee.maxFeePerGas!;
      // A claim cannot be estimated against an unpublished root without reverting.
      // Reserve a conservative upper bound before any publication; after publication
      // use the actual RPC estimate. This is a balance gate, not a spending promise.
      const claimGas = publishNeeded
        ? 120_000n + BigInt(plan.receiptIds.length) * 100_000n
        : await provider.estimateGas({
            from: signer.address,
            to: contract,
            data: data("claim", plan),
          });
      const pubGas = publishNeeded
        ? await provider.estimateGas({
            from: signer.address,
            to: contract,
            data: data("publish", plan),
          })
        : 0n;
      await budget(
        ((claimGas + pubGas) * price * 120n) / 100n + 20_000_000_000_000n,
      );
    },
    prepare: async (kind, plan) => {
      const request = {
        to: contract,
        data: data(kind, plan),
        value: 0n,
        ...(await fees()),
      };
      const gasLimit =
        ((await provider.estimateGas({ ...request, from: signer.address })) *
          120n) /
        100n;
      const price =
        "gasPrice" in request ? request.gasPrice! : request.maxFeePerGas!;
      await budget(gasLimit * price + 20_000_000_000_000n);
      const populated = await signer.populateTransaction({
        ...request,
        gasLimit,
      });
      const raw = await signer.signTransaction(populated);
      const hash = Transaction.from(raw).hash!;
      return { hash, raw };
    },
    receipt: async (hash) => {
      const result = await provider.getTransactionReceipt(hash);
      return result ? { hash: result.hash, status: result.status } : null;
    },
    broadcast: async (tx: SignedSettlementTransaction) => {
      const decoded = Transaction.from(tx.raw);
      if (
        decoded.hash !== tx.hash ||
        decoded.from !== signer.address ||
        decoded.to?.toLowerCase() !== contract.toLowerCase() ||
        decoded.chainId !== 8453n ||
        decoded.value !== 0n
      ) {
        throw new Error(
          "SETTLEMENT_JOURNAL_INVALID: saved transaction identity does not match this validator and contract.",
        );
      }
      // If an RPC already knows this exact transaction, wait rather than signing again.
      if (await provider.getTransaction(tx.hash)) return;
      try {
        await provider.broadcastTransaction(tx.raw);
      } catch {
        if (await provider.getTransaction(tx.hash)) return;
        throw new Error(
          "SETTLEMENT_BROADCAST_UNCONFIRMED: saved transaction retained; retry to reconcile. No replacement transaction was signed.",
        );
      }
    },
    wait: async (hash) => {
      try {
        const result = await provider.waitForTransaction(hash, 1, 90_000);
        return result ? { hash: result.hash, status: result.status } : null;
      } catch {
        throw new Error(
          "SETTLEMENT_CONFIRMATION_UNAVAILABLE: saved transaction retained; retry to reconcile.",
        );
      }
    },
  };
}

import assert from "node:assert/strict";
import test from "node:test";
import { Wallet, Transaction } from "ethers";
import { createSettlementDriver } from "./settlement-driver.js";
import type { SettlementPlan } from "./settlement-runner.js";

const plan: SettlementPlan = {
  version: 1,
  chainId: 8453,
  contract: "0x1111111111111111111111111111111111111111",
  root: "0x" + "ab".repeat(32),
  accounts: ["0x2222222222222222222222222222222222222222"],
  amounts: ["1"],
  receiptIds: ["0x" + "cd".repeat(32)],
  proofs: [[]],
};
function fixture(balance: bigint) {
  const wallet = Wallet.createRandom();
  let signed = 0;
  const provider = {
    getFeeData: async () => ({
      maxFeePerGas: 100n,
      maxPriorityFeePerGas: 1n,
      gasPrice: 100n,
    }),
    getBalance: async () => balance,
    estimateGas: async () => 50_000n,
  };
  const signer = {
    address: wallet.address,
    provider,
    populateTransaction: async (request: object) => ({
      ...request,
      chainId: 8453,
      nonce: 7,
    }),
    signTransaction: async (request: object) => {
      signed++;
      return wallet.signTransaction(request);
    },
  } as unknown as Wallet;
  return {
    driver: createSettlementDriver(signer, plan.contract),
    signed: () => signed,
    address: wallet.address,
  };
}
test("real settlement driver rejects a low balance before signing publication or claim", async () => {
  const f = fixture(1n);
  await assert.rejects(f.driver.preflight(plan, true, [0]), /INSUFFICIENT_GAS/);
  await assert.rejects(
    f.driver.prepare("publish", plan, []),
    /INSUFFICIENT_GAS/,
  );
  assert.equal(f.signed(), 0);
});
test("real settlement driver applies fee cap before signing", async () => {
  const previous = process.env.AIPOU_MAX_SETTLEMENT_FEE_WEI;
  try {
    process.env.AIPOU_MAX_SETTLEMENT_FEE_WEI = "1";
    const f = fixture(10n ** 18n);
    await assert.rejects(f.driver.prepare("claim", plan, [0]), /FEE_CAP/);
    assert.equal(f.signed(), 0);
  } finally {
    if (previous === undefined) delete process.env.AIPOU_MAX_SETTLEMENT_FEE_WEI;
    else process.env.AIPOU_MAX_SETTLEMENT_FEE_WEI = previous;
  }
});
test("real settlement driver signs only a zero-value Base call to the claims contract", async () => {
  const f = fixture(10n ** 18n);
  const saved = await f.driver.prepare("publish", plan, []);
  const tx = Transaction.from(saved.raw);
  assert.equal(tx.hash, saved.hash);
  assert.equal(tx.from, f.address);
  assert.equal(tx.to, plan.contract);
  assert.equal(tx.value, 0n);
  assert.equal(tx.chainId, 8453n);
  assert.equal(tx.nonce, 7);
  await assert.rejects(
    f.driver.broadcast({ ...saved, hash: "0x" + "ef".repeat(32) }),
    /JOURNAL_INVALID/,
  );
});

import assert from "node:assert/strict";
import test from "node:test";
import {
  executeSettlementPlan,
  type SettlementPlan,
  type SettlementDriver,
  type SignedSettlementTransaction,
} from "./settlement-runner.js";
function fixture(approved = false) {
  const plan: SettlementPlan = {
    version: 1,
    chainId: 8453,
    contract: "claims",
    root: "root",
    accounts: ["wallet"],
    amounts: ["10"],
    receiptIds: ["id"],
    proofs: [[]],
  };
  const confirmed = new Map<string, { hash: string; status: number }>();
  const prepared: string[] = [],
    sent: string[] = [],
    persisted: string[] = [];
  let balance = true,
    dropReply = false;
  const driver: SettlementDriver = {
    approved: async () => approved,
    claimed: async () => false,
    preflight: async () => {
      if (!balance) throw new Error("SETTLEMENT_INSUFFICIENT_GAS");
    },
    prepare: async (kind) => {
      prepared.push(kind);
      return { hash: kind, raw: kind + "-signed" };
    },
    receipt: async (hash) => confirmed.get(hash) ?? null,
    broadcast: async (tx) => {
      sent.push(tx.hash);
      confirmed.set(tx.hash, { hash: tx.hash, status: 1 });
      if (tx.hash === "publish") approved = true;
      if (dropReply) {
        dropReply = false;
        throw new Error("network reply lost");
      }
    },
    wait: async (hash) => confirmed.get(hash) ?? null,
  };
  const persist = async (p: SettlementPlan) => {
    persisted.push(JSON.stringify(p));
  };
  return {
    plan,
    driver,
    persist,
    prepared,
    sent,
    persisted,
    confirmed,
    noGas: () => {
      balance = false;
    },
    loseNextReply: () => {
      dropReply = true;
    },
  };
}
test("preflight refuses insufficient gas before any transaction is signed or sent", async () => {
  const f = fixture();
  f.noGas();
  await assert.rejects(
    executeSettlementPlan(f.plan, f.driver, f.persist),
    /INSUFFICIENT_GAS/,
  );
  assert.deepEqual(f.prepared, []);
  assert.deepEqual(f.sent, []);
});
test("already approved root is not republished", async () => {
  const f = fixture(true);
  const result = await executeSettlementPlan(f.plan, f.driver, f.persist);
  assert.deepEqual(f.prepared, ["claim"]);
  assert.equal(result.publishTransaction, "");
});
test("lost publication response resumes saved hash and never signs another publication", async () => {
  const f = fixture();
  f.loseNextReply();
  await assert.rejects(
    executeSettlementPlan(f.plan, f.driver, f.persist),
    /reply lost/,
  );
  const restored = JSON.parse(f.persisted.at(-1)!) as SettlementPlan;
  const result = await executeSettlementPlan(restored, f.driver, f.persist);
  assert.equal(result.publishTransaction, "publish");
  assert.deepEqual(f.prepared, ["publish", "claim"]);
});
test("crash after signing claim recovers the same bytes, including when broadcast was not attempted", async () => {
  const f = fixture(true);
  let signed: SignedSettlementTransaction | undefined;
  f.driver.broadcast = async (tx) => {
    signed = tx;
    throw new Error("offline");
  };
  await assert.rejects(
    executeSettlementPlan(f.plan, f.driver, f.persist),
    /offline/,
  );
  const restored = JSON.parse(f.persisted.at(-1)!) as SettlementPlan;
  f.driver.broadcast = async (tx) => {
    assert.deepEqual(tx, signed);
    f.confirmed.set(tx.hash, { hash: tx.hash, status: 1 });
  };
  await executeSettlementPlan(restored, f.driver, f.persist);
  assert.deepEqual(f.prepared, ["claim"]);
});
test("confirmed claim survives a lost response without repeat broadcast", async () => {
  const f = fixture(true);
  f.loseNextReply();
  await assert.rejects(
    executeSettlementPlan(f.plan, f.driver, f.persist),
    /reply lost/,
  );
  const result = await executeSettlementPlan(f.plan, f.driver, f.persist);
  assert.equal(result.claimTransaction, "claim");
  assert.deepEqual(f.sent, ["claim"]);
});
test("unconfirmed and reverted transactions do not get replaced", async () => {
  const f = fixture(true);
  f.driver.wait = async () => null;
  f.driver.broadcast = async () => {};
  await assert.rejects(
    executeSettlementPlan(f.plan, f.driver, f.persist),
    /UNCONFIRMED/,
  );
  f.confirmed.set("claim", { hash: "claim", status: 0 });
  await assert.rejects(
    executeSettlementPlan(f.plan, f.driver, f.persist),
    /REVERTED/,
  );
  assert.deepEqual(f.prepared, ["claim"]);
});
test("unexpected onchain claims require explicit reconciliation", async () => {
  const f = fixture();
  f.driver.claimed = async () => true;
  await assert.rejects(
    executeSettlementPlan(f.plan, f.driver, f.persist),
    /RECONCILIATION_REQUIRED/,
  );
  assert.deepEqual(f.sent, []);
});
test("journal persistence failure happens before broadcast", async () => {
  const f = fixture();
  await assert.rejects(
    executeSettlementPlan(f.plan, f.driver, async () => {
      throw new Error("disk full");
    }),
    /disk full/,
  );
  assert.deepEqual(f.sent, []);
});

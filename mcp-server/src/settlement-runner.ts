export interface SettlementPlan {
  version: 1;
  chainId: number;
  contract: string;
  root: string;
  accounts: string[];
  amounts: string[];
  receiptIds: string[];
  proofs: string[][];
  publish?: SignedSettlementTransaction;
  claim?: SignedSettlementTransaction;
}
export interface SignedSettlementTransaction {
  hash: string;
  raw: string;
}
export interface SettlementConfirmation {
  hash: string;
  status: number | null;
}
export interface SettlementDriver {
  approved(root: string): Promise<boolean>;
  claimed(id: string): Promise<boolean>;
  preflight(
    plan: SettlementPlan,
    publishNeeded: boolean,
    indices: number[],
  ): Promise<void>;
  prepare(
    kind: "publish" | "claim",
    plan: SettlementPlan,
    indices: number[],
  ): Promise<SignedSettlementTransaction>;
  receipt(hash: string): Promise<SettlementConfirmation | null>;
  broadcast(tx: SignedSettlementTransaction): Promise<void>;
  wait(hash: string): Promise<SettlementConfirmation | null>;
}
/** Persist signed bytes before broadcast; recovery resends the exact same hash. */
export async function executeSettlementPlan(
  plan: SettlementPlan,
  driver: SettlementDriver,
  persist: (plan: SettlementPlan) => Promise<void>,
): Promise<{ publishTransaction: string; claimTransaction: string }> {
  const execute = async (kind: "publish" | "claim", indices: number[]) => {
    let tx = plan[kind];
    if (!tx) {
      tx = await driver.prepare(kind, plan, indices);
      plan[kind] = tx;
      await persist(plan);
    }
    let result = await driver.receipt(tx.hash);
    if (!result) {
      await driver.broadcast(tx);
      result = await driver.wait(tx.hash);
    }
    if (!result)
      throw new Error(
        "SETTLEMENT_UNCONFIRMED: rerun to reconcile the saved transaction; do not replace it.",
      );
    if (
      result.hash.toLowerCase() !== tx.hash.toLowerCase() ||
      result.status !== 1
    ) {
      throw new Error(
        "SETTLEMENT_REVERTED: inspect the saved hash before an operator resets the journal.",
      );
    }
    return result.hash;
  };
  if (plan.claim) {
    const claimTransaction = await execute("claim", []);
    return { publishTransaction: plan.publish?.hash ?? "", claimTransaction };
  }
  const claimed = await Promise.all(
    plan.receiptIds.map((id) => driver.claimed(id)),
  );
  if (claimed.some(Boolean))
    throw new Error(
      "SETTLEMENT_RECONCILIATION_REQUIRED: onchain claims exist without a saved transaction; inspect events before changing local state.",
    );
  const indices = plan.receiptIds.map((_, i) => i);
  const rootApproved = await driver.approved(plan.root);
  await driver.preflight(plan, !rootApproved, indices);
  const publishTransaction = rootApproved
    ? (plan.publish?.hash ?? "")
    : await execute("publish", []);
  if (!(await driver.approved(plan.root)))
    throw new Error("SETTLEMENT_ROOT_UNCONFIRMED: rerun to reconcile.");
  const claimTransaction = await execute("claim", indices);
  return { publishTransaction, claimTransaction };
}

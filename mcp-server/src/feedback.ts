import { getPackageVersion } from "./version.js";
import { exportStoredReceipts, protocolStateCounts } from "./store.js";
/** Explicit local export only. No identifiers, task hashes, keys, paths or uploads. */
export async function localFeedbackSummary() {
  const receipts = await exportStoredReceipts();
  const counts = await protocolStateCounts();
  const activeDays = new Set(receipts.map((r) => r.recordedAt.slice(0, 10)));
  return {
    schema: "aipou-local-feedback-v1",
    version: await getPackageVersion(),
    platform: process.platform,
    node: process.versions.node,
    localReceiptCount: receipts.length,
    localActiveDays: activeDays.size,
    completedSessions: counts.completedSessions,
    activeSessions: counts.activeSessions,
    expiredSessions: counts.expiredSessions,
    measuredUsageReceipts: receipts.filter(
      (r) => r.tokenUsageMeasurement === "measured",
    ).length,
    unmeasuredUsageReceipts: receipts.filter(
      (r) => r.tokenUsageMeasurement === "unmeasured",
    ).length,
    unspecifiedUsageReceipts: receipts.filter(
      (r) =>
        !r.tokenUsageMeasurement || r.tokenUsageMeasurement === "unspecified",
    ).length,
    transmission: "none; review before sharing voluntarily",
    interpretation:
      "one local installation; not unique-user, organic-adoption or revenue metrics",
  };
}

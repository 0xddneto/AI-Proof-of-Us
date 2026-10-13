export type EvidenceState = "VERIFIED" | "OBSERVED" | "UNKNOWN" | "ABSENT";

/**
 * A compact result vocabulary for displaying receipt-adjacent facts without
 * letting any one fact become a universal completion claim.
 */
export interface EvidenceReport {
  receiptIntegrity: EvidenceState;
  walletAuthorization: EvidenceState;
  collectorSignature: EvidenceState;
  hostExecution: EvidenceState;
  delivery: EvidenceState;
  businessAcceptance: EvidenceState;
  settlement: EvidenceState;
  externalEffect: EvidenceState;
}

export function receiptEvidenceReport(input: {
  receiptIntegrity: boolean;
  walletAuthorization: boolean;
  collectorSignature: boolean;
  hostExecution?: EvidenceState;
}): EvidenceReport {
  return {
    receiptIntegrity: input.receiptIntegrity ? "VERIFIED" : "UNKNOWN",
    walletAuthorization: input.walletAuthorization ? "VERIFIED" : "UNKNOWN",
    collectorSignature: input.collectorSignature ? "VERIFIED" : "UNKNOWN",
    hostExecution: input.hostExecution ?? "UNKNOWN",
    // These require their own artifacts and verifiers. AIPOU receipts do not
    // infer them from a completed local task.
    delivery: "UNKNOWN",
    businessAcceptance: "ABSENT",
    settlement: "ABSENT",
    externalEffect: "UNKNOWN"
  };
}

# receiptId And workReceiptId Interoperability

This note defines how other tools can reference AIPOU without becoming responsible for AIPOU rewards.

An AIPOU `receiptId` identifies a signed receipt. When the receipt represents a meaningful human/agent work unit, external systems may call the same value `workReceiptId`. That alias makes the boundary clearer when AIPOU is used beside tool-call receipts, payment receipts, or policy receipts.

See [Work Receipt Boundaries](work-receipt-boundaries.md) for placement guidance.

## Minimal External Reference

Other systems may store:

```json
{
  "type": "aipou.receipt",
  "workReceiptId": "0x...",
  "receiptId": "0x...",
  "evidenceClass": "issuer_asserted",
  "status": "local | validated | batched | claimed | rejected",
  "evidenceBoundary": "https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/evidence-boundaries.md",
  "claimPolicy": "https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/claim-validation-policy.md"
}
```

That is enough for:

- provenance tools
- LLMOps traces
- policy gates
- payment records
- agent marketplaces
- MCP security scanners

`workReceiptId` and `receiptId` may be the same value. Keep both only when the receiving system needs to distinguish work evidence from other receipt types.

## Recommended Metadata Fields

| Field | Required | Purpose |
| --- | --- | --- |
| `receiptId` | Yes | Stable AIPOU receipt identifier |
| `workReceiptId` | Optional | Alias for `receiptId` when the receipt represents a human/agent work unit |
| `evidenceClass` | Yes | `issuer_asserted` for the signed receipt payload |
| `status` | Yes | Current receipt lifecycle status |
| `taskHash` | Optional | Private-content-safe task reference |
| `outputHash` | Optional | Private-content-safe output reference |
| `trustTier` | Optional | Validator-derived tier, such as `client_signed` |
| `validationStatus` | Optional | External display status |
| `claimStatus` | Optional | Whether the receipt has been claimed |
| `claimedAt` | Optional | Settlement timestamp if available |
| `chainId` | Optional | Base mainnet is `8453` |
| `claimsContract` | Optional | AIPOUClaims address |

## What Integrators Should Not Store

Do not store:

- wallet private keys
- collector private keys
- provider API keys
- raw prompts
- raw outputs
- private files
- personally identifiable information unless the user explicitly chooses to disclose it

## Status Semantics

Suggested statuses:

| Status | Meaning |
| --- | --- |
| `local` | Receipt exists only in the local store |
| `validated` | Validator checks passed |
| `batched` | Receipt was included in a Merkle root |
| `claimed` | Onchain claim succeeded |
| `rejected` | Validator rejected or delayed the receipt |

## Integration Rule

External systems can reference `receiptId` as evidence.

For payment, marketplace, workflow, and trace integrations, prefer `workReceiptId` when the receipt is being attached as external work evidence. Keep separate identifiers for other systems:

```json
{
  "workReceiptId": "0x...",
  "paymentReceiptId": "payment-rail-specific-id",
  "toolReceiptId": "tool-or-boundary-specific-id"
}
```

The signed receipt payload is `issuer_asserted`: the collector signed it and validators may accept it under published policy. Onchain settlement data is narrower: a Merkle proof and claim transaction can show inclusion and claimed state for a `receiptId`, but they do not make the private task payload itself `chain_derivable`.

They should not claim:

```text
This task is safe, valuable, provider-endorsed, or payable just because it has an AIPOU receipt.
```

Use:

```text
This task has an AIPOU receipt reference. See the AIPOU evidence boundary and claim policy for what that means.
```

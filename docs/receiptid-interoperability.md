# receiptId Interoperability

This note defines how other tools can reference AIPOU without becoming responsible for AIPOU rewards.

## Minimal External Reference

Other systems may store:

```json
{
  "type": "aipou.receipt",
  "receiptId": "0x...",
  "status": "pending | validated | claimed | rejected",
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

## Recommended Metadata Fields

| Field | Required | Purpose |
| --- | --- | --- |
| `receiptId` | Yes | Stable AIPOU receipt identifier |
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

They should not claim:

```text
This task is safe, valuable, provider-endorsed, or payable just because it has an AIPOU receipt.
```

Use:

```text
This task has an AIPOU receipt reference. See the AIPOU evidence boundary and claim policy for what that means.
```

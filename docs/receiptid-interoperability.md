# receiptId And workReceiptId Interoperability

This note defines how other tools can reference AIPOU without becoming responsible for AIPOU rewards.

An AIPOU `receiptId` identifies a signed receipt. When the receipt represents a meaningful human/agent work unit, external systems may call the same value `workReceiptId`. That alias makes the boundary clearer when AIPOU is used beside tool-call receipts, payment receipts, or policy receipts.

See [Work Receipt Boundaries](work-receipt-boundaries.md) for placement guidance.

## Trust Model Layers

Recent feedback from receipt, security, and agent-certification reviewers converged on one useful separation:

```text
identity / principal anchor -> execution or work receipt -> reliance decision
```

AIPOU should occupy the receipt layer. It can reference an identity anchor and it can inform a downstream reliance decision, but it should not collapse all three concepts into one badge.

| Layer | What It Answers | AIPOU Role |
| --- | --- | --- |
| Identity / principal anchor | Who is allowed to make or receive this claim? | Dedicated farming wallet, collector fingerprint, optional registry or DID reference |
| Execution / work receipt | What work unit was recorded, with which hashes, nonce, model metadata, and signatures? | Native AIPOU `receiptId` / `workReceiptId` |
| Reliance decision | What should a gateway, marketplace, scanner, or user do with the evidence? | External policy decision; AIPOU exposes status and boundaries, not automatic trust |

This keeps AIPOU useful to agent frameworks without asking them to become token validators, payment rails, security scanners, or identity registries.

## Minimal External Reference

Other systems may store:

```json
{
  "type": "aipou.receipt",
  "workReceiptId": "0x...",
  "receiptId": "0x...",
  "evidenceClass": "issuer_asserted",
  "scheme": "aipou-receipt-v1",
  "factId": "0x...",
  "subject": {
    "kind": "wallet",
    "id": "eip155:8453:0x..."
  },
  "status": "local | validated | batched | claimed | rejected",
  "registryStatus": "active | superseded | revoked",
  "relianceBoundary": "local-policy-only",
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
| `scheme` | Recommended | Versioned receipt scheme, currently `aipou-receipt-v1` |
| `factId` | Recommended | Deterministic identity for the underlying receipt fact |
| `subject` | Recommended | Principal or wallet the receipt is about, such as `eip155:8453:<wallet>` |
| `status` | Yes | Current receipt lifecycle status |
| `registryStatus` | Recommended | External registry state; `revoked` is terminal and `superseded` links to a successor |
| `relianceBoundary` | Recommended | How a receiver should treat the evidence, such as `local-policy-only`, `gateway-advisory`, or `marketplace-review` |
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

## Fail-Closed Scheme Rule

External verifiers should switch on both evidence class and scheme:

```text
issuer_asserted + aipou-receipt-v1
```

Unknown schemes should be rejected or displayed as unsupported, not parsed on a best-effort basis. This lets AIPOU evolve without making old clients silently accept new receipt formats they do not understand.

If a future AIPOU root or claim fact is anchored onchain, that specific onchain fact may be referenced separately as `chain_derivable`. The private task payload remains `issuer_asserted`.

## Deterministic Fact Identity

For `aipou-receipt-v1`, derive `factId` as SHA-256 over this UTF-8 material:

```text
aipou-receipt-v1\n<collectorFingerprint>\n<lowercaseNonce>
```

The collector fingerprint is SHA-256 of the Ed25519 SPKI DER public key, written as `sha256:<hex>`. This makes `collector + nonce` a mechanical fact identity without exposing prompts or outputs.

The nonce is not supplied by the client. `begin_ai_task` creates 32 bytes with the operating system cryptographic random-number generator, and the farming wallet binds that nonce into its EIP-712 task authorization. A caller-controlled entropy seed is intentionally not part of `aipou-receipt-v1`: it would not improve on the collector-generated 256-bit nonce and would expand the signed schema without adding a new trust guarantee.

The current MCP store enforces nonce uniqueness and receipt replay protection at the application/store layer. Each mutation re-reads state while holding a cross-process file lock, rejects an existing nonce or receipt ID before writing, and replaces the state file atomically. It is not a SQL database unique constraint. A future database-backed registry should enforce the equivalent `subject + factId + active` rule transactionally at its storage boundary.

An external registry should allow at most one active record for the same `subject + factId`. Use `active | superseded | revoked` for registry state. `superseded` points to a successor; `revoked` is terminal and must fail closed. These registry semantics do not imply that AIPOU currently operates a universal public registry.

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

When a framework also has a pre-action authority receipt, use a separate versioned link:

```json
{
  "scheme": "aipou-authority-work-link-v1",
  "relation": "authorized_then_work_recorded",
  "authority": {
    "receiptId": "authority-receipt-id",
    "actionRef": "sealed-action-ref",
    "phase": "pre_action"
  },
  "work": {
    "receiptId": "0x...",
    "factId": "0x...",
    "phase": "post_work"
  },
  "traceLink": "trace:run-id"
}
```

The authority artifact must exist before execution. The AIPOU work receipt is created after completion. A claim, reward amount, Merkle inclusion, or settlement transaction is post-work state and must never be interpreted as authority to act.

The signed receipt payload is `issuer_asserted`: the collector signed it and validators may accept it under published policy. Onchain settlement data is narrower: a Merkle proof and claim transaction can show inclusion and claimed state for a `receiptId`, but they do not make the private task payload itself `chain_derivable`.

They should not claim:

```text
This task is safe, valuable, provider-endorsed, or payable just because it has an AIPOU receipt.
```

Use:

```text
This task has an AIPOU receipt reference. See the AIPOU evidence boundary and claim policy for what that means.
```

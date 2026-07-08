# Work Receipt Boundaries

AIPOU should not force every agent framework, trace system, or payment rail to put a receipt in the same place.

The useful rule is:

```text
Attach the receipt where the verification boundary lives.
```

The second useful rule is:

```text
Do not turn a receipt into a universal trust badge.
```

A receiving system should decide separately:

- identity / principal anchor: who is the agent, user, wallet, collector, or registry subject?
- receipt: what event or work unit was signed, hashed, and replay-checked?
- reliance decision: what local policy should do with that evidence?

## AIPOU's Boundary

AIPOU is centered on a human/agent work unit:

```text
human asks for work -> agent performs work -> AIPOU creates workReceiptId -> optional validation and claim
```

For external integrations, `workReceiptId` is the preferred alias for an AIPOU `receiptId` when the receipt represents a meaningful unit of AI-assisted work. The onchain claim system still uses `receiptId`; `workReceiptId` is an interoperability name that makes the scope clearer.

Use AIPOU for:

- coding, debugging, research, writing, review, or coordination tasks
- local AI work that needs a private receipt trail
- agent runs where a human wants portable work evidence
- optional validator-approved reward claims
- optional payment or marketplace settlement when participants agree

## Tool And Boundary Receipts

Other receipt systems can focus on narrower events:

- a tool call happened
- a workflow crossed a trust boundary
- a consequential action was approved
- a payment authorization was created
- a policy gate allowed or blocked an action

These receipts can be complementary. A tool-call receipt or BoundaryAttest-style event can be referenced by an AIPOU work receipt, and an AIPOU `workReceiptId` can be referenced by a workflow, trace, payment record, or audit export.

The projects do not need to merge. They only need a shared reference shape.

## Minimal External Object

External systems may store:

```json
{
  "type": "aipou.receipt",
  "workReceiptId": "0x...",
  "receiptId": "0x...",
  "evidenceClass": "issuer_asserted",
  "scheme": "aipou-receipt-v1",
  "subject": {
    "kind": "wallet",
    "id": "eip155:8453:0x..."
  },
  "status": "local | validated | batched | claimed | rejected",
  "relianceBoundary": "local-policy-only",
  "taskHash": "0x...",
  "outputHash": "0x...",
  "evidenceBoundary": "https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/evidence-boundaries.md"
}
```

`workReceiptId` and `receiptId` may be the same value. The duplicate field is intentional for interoperability:

- `receiptId` is the native AIPOU identifier.
- `workReceiptId` tells payment, trace, and framework systems that this receipt is about a work unit, not a payment receipt, tool-call receipt, or policy receipt.

## Where To Attach It

Choose the attachment point based on the boundary being verified:

| Boundary | Good Attachment Point | Example Field |
| --- | --- | --- |
| One important tool action | tool-call metadata | `toolReceiptId` or `boundaryReceiptId` |
| A full agent run | workflow/run metadata | `workReceiptId` |
| Observability correlation | trace/span attributes | `aipou.work_receipt_id` |
| External proof bundle | audit artifact | `workReceiptId` |
| Payment session | payment/session metadata | `workReceiptId` plus payment rail's own receipt |
| Marketplace payout | payout evidence | `workReceiptId` and validation status |

Avoid putting AIPOU data on every log line. A work receipt should mark a meaningful unit of work, not create noisy metadata.

## External Reference Shape

When another receipt or certification system references AIPOU, prefer an explicit reference object:

```json
{
  "type": "aipou.work_receipt",
  "id": "0x...",
  "issuer": "collector-ed25519:...",
  "subject": "eip155:8453:0x...",
  "evidenceClass": "issuer_asserted",
  "scheme": "aipou-receipt-v1",
  "verificationStatus": "local | validated | claimed | rejected",
  "uri": "https://github.com/0xddneto/AI-Proof-of-Us"
}
```

That object can live inside `external_receipts`, trace links, audit exports, marketplace records, or workflow metadata. The host system remains responsible for its own trust decision.

## Payment Separation

For payment rails such as x402, AP2, stablecoin settlement, or marketplace payouts, keep identifiers separate:

```json
{
  "workReceiptId": "0x...",
  "paymentReceiptId": "payment-rail-specific-id"
}
```

AIPOU proves receipt integrity, wallet authorization, collector signature, replay checks, and optional claim inclusion under its evidence boundaries. The payment rail proves its own payment or authorization facts.

## Claim Separation

Frameworks can use `workReceiptId` without becoming AIPOU validators.

They do not need to:

- calculate rewards
- publish Merkle roots
- call `claimBatch`
- validate token claims
- accept AIPOU as payment

Claims remain optional and are handled by the validator/settlement flow after an explicit user request.

## Good Integration Question

Ask maintainers:

```text
For your system, where does a human/agent work receipt belong: workflow metadata, trace attributes, payment/session metadata, tool result metadata, or a separate audit artifact?
```

That question keeps AIPOU interoperable without forcing token logic into other projects.

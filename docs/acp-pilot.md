# ACP Work Receipt Pilot

This is a small integration proposal for an ACP-style agent commerce flow.
It is an application-level binding, not an ACP specification change and not a
claim of endorsement by an ACP implementation or marketplace.

## Goal

Keep the commerce flow and the work evidence flow separate:

```text
ACP job + evaluation + payment
              |
              +-- AIPOU workReceiptId as portable post-work evidence
```

ACP remains responsible for job creation, evaluation, payment, disputes, and
delivery status. AIPOU records a signed work receipt for the human and agent
task, and can be attached to ACP metadata without changing ACP settlement.

## Receipt Trigger

The smallest adapter needs two lifecycle hooks.

1. When an ACP job is accepted and the agent is about to begin work, hash the
   job/action reference locally and call `begin_ai_task`.
2. When the agent produces its delivery and ACP has a result, hash the result
   or ACP delivery reference locally and call `complete_ai_task`.
3. Attach the returned `workReceiptId` to the ACP job, run, or delivery
   metadata. Do not embed raw prompts, outputs, customer data, or payment
   details.

The receipt is post-work evidence. It does not authorize a payment, prove that
the delivery passed evaluation, or replace ACP's own job and payment records.

## What The Verifier Checks

At completion, the AIPOU collector checks the task nonce, replay protection,
bounded usage fields, and the hashes supplied by the lifecycle adapter. It
then emits an Ed25519-signed `aipou-receipt-v1` record. A provider-signed tier
is only possible when an integrating provider supplies valid configured
evidence; otherwise the record remains `client_signed`.

An ACP integration should verify or display the AIPOU record as external,
`issuer_asserted` evidence. It should keep ACP evaluation and payment evidence
under ACP's own verifier. An optional later AIPOU claim is a separate validator
and Merkle-proof process; it is not required for a pilot and does not change an
ACP payment outcome.

## Metadata Binding

Use an application-owned metadata object such as the synthetic fixture in
[`examples/lifecycle-adapter/acp-pilot-binding.json`](../examples/lifecycle-adapter/acp-pilot-binding.json).

```json
{
  "schema": "aipou-acp-work-evidence-v1",
  "acpJobRef": "acp:job:opaque-id",
  "actionRef": "sha256:...",
  "phase": "post_delivery",
  "workEvidence": {
    "type": "aipou.receipt",
    "workReceiptId": "0x...",
    "scheme": "aipou-receipt-v1",
    "evidenceClass": "issuer_asserted",
    "validationStatus": "local"
  }
}
```

If ACP already has a canonical job or delivery digest, bind that digest as
`actionRef`. If the relationship must be cryptographically linked across both
systems, use an `external-evidence-link-v1` object with the two artifact
digests. Do not rewrite ACP's canonical payload into an AIPOU-specific shape.

## Smallest Pilot

The first useful pilot ships four things:

1. one lifecycle adapter around a synthetic ACP job;
2. one `workReceiptId` attachment on job or delivery metadata;
3. one verifier test with a valid link, an action-reference mismatch, and a
   digest mismatch;
4. a short demo using Local Receipt Mode, with no customer data, funds, token
   transfer, claim, or marketplace payment.

The existing local demo can be run with:

```bash
npx -y aipou-mcp-server --demo
```

It creates an ephemeral local receipt and prints integration metadata. The
full lifecycle example is in
[`examples/lifecycle-adapter`](../examples/lifecycle-adapter/README.md).

## Base Contracts

These contracts are available for inspection, but an ACP pilot does not need
to call either of them:

- [AIPOU token on Base](https://basescan.org/token/0x55f0Cc5e51A1284D20337d6cbb18938C8A1ABCbB)
- [AIPOUClaims on Base](https://basescan.org/address/0x4ca4C98fB784D20EdC8E2A7F531dAab4c6e53058)
- [Verified token source](https://repo.sourcify.dev/contracts/full_match/8453/0x55f0Cc5e51A1284D20337d6cbb18938C8A1ABCbB/)
- [Verified claims source](https://repo.sourcify.dev/contracts/full_match/8453/0x4ca4C98fB784D20EdC8E2A7F531dAab4c6e53058/)

`AIPOUClaims` only handles later approved claim batches. It does not see raw
task content, evaluate ACP delivery quality, or settle ACP jobs.

## Non-Goals

- no second token launch;
- no replacement for ACP payment, evaluation, reputation, or dispute flows;
- no claim that a receipt proves useful work trustlessly;
- no price, yield, liquidity, or reward guarantee;
- no requirement to expose private prompts, outputs, wallet secrets, or
  customer data.

Related material: [framework lifecycle adapter](framework-lifecycle-adapter.md),
[work receipt boundaries](work-receipt-boundaries.md),
[external evidence links](external-evidence-links.md), and
[human rewards and agent payments](human-rewards-and-agent-payments.md).

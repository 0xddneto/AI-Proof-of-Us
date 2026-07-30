# Paybox + AIPOU Interoperability Proposal

Status: proposed. This document does not imply a Paybox, MoonPay, or Launchpad
partnership, endorsement, or integration.

## Why These Systems Fit Together

Paybox is an agent-facing credential and authorization control plane. A user
can give an agent scoped permission to request a payment, wallet signature,
swap, or credential output under limits that the user controls. AIPOU is a
post-work receipt protocol: it creates a private signed `workReceiptId` after
an AI-assisted task crosses a declared work boundary.

They answer different questions:

| Question | System |
| --- | --- |
| Was this payment or wallet operation allowed under the user's current grant? | Paybox and the underlying payment or wallet provider |
| What work did the human and agent report completing around that operation? | AIPOU |
| Did a validator approve a receipt for an optional AIPOU claim? | AIPOU validator and claims policy |

AIPOU must not authorize a payment, sign a wallet operation, custody a
credential, or represent an AIPOU receipt as proof that a payment settled.
Paybox must not be represented as validating an AIPOU reward, receipt, or
claim unless it explicitly implements that verification.

## Minimal Pilot

The first pilot should be synthetic, reproducible, and contain no funds,
private keys, raw credentials, prompts, outputs, or token claim.

1. A test user creates a Paybox-scoped authorization with a purpose, maximum
   amount, expiry, and revocation path.
2. A test agent completes a synthetic paid-service workflow through Paybox.
3. The AIPOU lifecycle adapter records the task boundary and emits a signed
   `workReceiptId` after completion.
4. The integrator creates an `external-evidence-link-v1` between the AIPOU
   receipt and a digest of the Paybox operation artifact.
5. Each side is verified with its native verifier. AIPOU validation and
   optional claims remain independent of the payment result.

This can start with one valid fixture and two expected failures: an altered
Paybox-operation digest and an altered AIPOU work-receipt digest.

## Minimal Data Shape

The exact Paybox operation identifier and result schema must come from its
published SDK or documentation before an implementation is released. Until
then, use only this generic envelope:

```json
{
  "scheme": "external-evidence-link-v1",
  "relation": "supports",
  "source": {
    "kind": "receipt",
    "scheme": "aipou-receipt-v1",
    "id": "0xworkReceiptId",
    "digest": "sha256:aipou-receipt-bytes"
  },
  "target": {
    "kind": "payment-operation",
    "scheme": "paybox-operation-v1",
    "id": "opaque-provider-reference",
    "digest": "sha256:paybox-operation-artifact"
  },
  "privacy": "digest_only"
}
```

`paybox-operation-v1` is a placeholder label, not a claimed Paybox format.
The opaque reference is not a wallet address, credential, card token, prompt,
or payment secret. The two digests bind exact artifacts without publishing
their contents.

## AIPOU Bridge Tool

The AIPOU MCP now exposes `create_paybox_work_link`. It builds the envelope
above from an existing `workReceiptId`, an opaque Paybox operation reference,
and the SHA-256 digest of the operation artifact. It is deliberately
read-only: it does not connect to Paybox, unlock a vault, request a payment,
sign a wallet operation, persist a credential, submit a claim, or mint AIPOU.

This is a bridge, not a fork of Paybox. The public Paybox SDK is Apache-2.0,
but the published source-repository URL was not available for an upstream fork
when this profile was created. AIPOU therefore keeps an independent MIT
implementation and only uses the public protocol boundary.

## Required Safety Rules

- AIPOU never receives, stores, or asks for a Paybox credential or private key.
- A payment result never automatically mints, claims, or raises the trust tier
  of an AIPOU receipt.
- AIPOU work must not be rewarded by payment volume, asset choice, trade
  frequency, profit, or loss.
- A failed, canceled, or policy-blocked operation may be an accurate audit
  outcome; it is not successful payment evidence.
- The integration fails closed on an unknown scheme, missing artifact,
  mismatched digest, invalid signature, invalid phase order, or absent native
  verifier.
- Users retain Paybox approval, cap, expiry, and revoke controls. AIPOU does
  not bypass or weaken them.

## What We Would Ask Paybox To Review

1. The stable, privacy-safe operation reference and status semantics suitable
   for an external evidence link.
2. A no-funds sandbox or fixture for payment and wallet-operation results.
3. The right MCP attachment point for `workReceiptId` and verification status.
4. A small joint fixture that proves the boundary between authorization,
   payment, and post-work evidence.

The desired outcome is interoperability for humans using AI agents, not a
request for Paybox users to buy AIPOU or expose financial data.

## References

- [Work receipt boundaries](work-receipt-boundaries.md)
- [External evidence links](external-evidence-links.md)
- [Agentic finance receipts](agentic-finance-receipts.md)
- [Human rewards and agent payments](human-rewards-and-agent-payments.md)

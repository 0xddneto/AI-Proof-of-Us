# Observed-Outcome Pilot

This executable pilot is the smallest useful AIPOU integration rehearsal. It
creates a disposable task session, completes a local receipt, and verifies the
receipt from its own bytes and public keys.

```bash
npx -y aipou-mcp-server --pilot
```

It is offline. It uses a temporary wallet and collector key, removes its state
on exit, moves no funds, and submits no claim.

## What it demonstrates

The result reports these states independently:

| Fact | Pilot result | Why |
| --- | --- | --- |
| Receipt digest | `VERIFIED` | The receipt id is recomputed from canonical bytes. |
| Wallet authorization | `VERIFIED` | The EIP-712 task authorization is recovered. |
| Collector signature | `VERIFIED` | The Ed25519 signature is checked against the included public key. |
| Host execution | `OBSERVED` | The local collector completed the bounded task lifecycle. |
| Delivery / external effect | `UNKNOWN` | No remote recipient or system of record is queried. |
| Business acceptance / settlement | `ABSENT` | No issuer acceptance or payment evidence is supplied. |

The pilot deliberately does **not** produce a global `completed` or
`work_completed` verdict. A deployment that needs delivery, acceptance, or an
external effect must add an application-owned artifact and native verifier for
that particular fact.

## Moving from rehearsal to an application pilot

For one real application action:

1. Before the consequential action, bind an operator decision to the exact
   action reference and canonical argument digest.
2. Consume the attempt atomically at the execution boundary, so retries return
   a cached result or an explicit unverified state instead of dispatching again.
3. Complete the AIPOU receipt after the host observes its own outcome.
4. Attach the `workReceiptId` as a sibling audit artifact. Do not use it as the
   authority to execute or as evidence of delivery.
5. If a recipient accepts the result, record that as a separate typed
   acceptance artifact. Keep settlement and any external postcondition in their
   own evidence lanes as well.

The [framework lifecycle adapter](framework-lifecycle-adapter.md) provides the
authority/attempt fixture; the [work-receipt boundaries](work-receipt-boundaries.md)
describe the receipt limits. The MCP `verify_aipou_receipt` tool can verify the
self-contained receipt facts without reading local state, but it intentionally
does not provide a collector allowlist or validate any external evidence.

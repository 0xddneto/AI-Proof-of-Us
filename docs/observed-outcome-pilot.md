# Observed-Outcome Pilot

This executable pilot is the smallest useful AIPOU integration rehearsal. It
creates a disposable task session and a local output file. It verifies the
receipt from its own bytes and public keys, then reads the file back and
compares its hash with the signed output hash.

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
| Host execution | `OBSERVED` | The pilot read the local file back and matched its hash. `hostObservation.source` identifies the check as `local_file_readback`. |
| Delivery / external effect | `UNKNOWN` | No remote recipient or system of record is queried. |
| Business acceptance / settlement | `ABSENT` | No issuer acceptance or payment evidence is supplied. |

Report the status of each fact. Delivery, acceptance, and external effects
require evidence from the corresponding system. Calling `verify_aipou_receipt`
with only the receipt leaves host execution `UNKNOWN` because the tool has
only the signed payload and its keys.

## Moving from rehearsal to an application pilot

For one real application action:

1. Before the consequential action, bind an operator decision to the exact
   action reference and canonical argument digest.
2. Consume the attempt atomically at the execution boundary, so retries return
   a cached result or an explicit unverified state instead of dispatching again.
3. Complete the AIPOU receipt after the host observes its own outcome.
4. Attach the `workReceiptId` as a sibling audit artifact. Do not use it as the
   authority to execute or as evidence of delivery.
5. Record the source and the precise fact observed. For example, an agent
   saying “sent” is an agent assertion, an API returning “queued” is a tool
   response, and a check of the destination can establish delivery. Report
   delivery as `UNKNOWN` until the evidence supports it. Record recipient
   acceptance and settlement as separate facts.

The source guidance incorporates
[renezander030's feedback in the LangGraph discussion](https://github.com/langchain-ai/langgraph/issues/7844#issuecomment-6829596881).

The [framework lifecycle adapter](framework-lifecycle-adapter.md) provides the
authority/attempt fixture; the [work-receipt boundaries](work-receipt-boundaries.md)
describe the receipt limits. The MCP `verify_aipou_receipt` tool can verify the
self-contained receipt facts without reading local state, but it intentionally
does not provide a collector allowlist or validate any external evidence.

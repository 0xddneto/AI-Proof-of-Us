# Payment Rail Work Receipt Attachment

This note is the smallest rail-neutral way to carry an AIPOU work receipt
beside a completed payment record.

It is intentionally narrow:

- no settlement authority;
- no second payment path;
- no token requirement;
- no claim that a payment rail must validate AIPOU claims;
- no raw prompts, outputs, secrets, or customer data.

## Goal

Keep payment settlement and work evidence separate:

```text
payment rail settles payment
                +
completed sale carries optional workReceiptId
```

The payment rail keeps full control over replay protection, payer attribution,
idempotency, authorization, disputes, and settlement.

AIPOU contributes only optional post-work evidence that a human/agent work unit
was recorded under its own receipt boundary.

## Minimal Attachment Object

```json
{
  "type": "aipou.receipt",
  "workReceiptId": "0x...",
  "receiptId": "0x...",
  "scheme": "aipou-receipt-v1",
  "evidenceClass": "issuer_asserted",
  "verificationStatus": "local | validated | batched | claimed | rejected"
}
```

`workReceiptId` is the interoperability name for a work-unit receipt.
`receiptId` is the native AIPOU identifier. They may be the same value.

## Optional Sibling Fields

When the receiver wants slightly more context without absorbing AIPOU's trust
model, it may also store:

```json
{
  "paymentReceiptId": "payment-rail-native-id",
  "workReceiptId": "0x...",
  "workEvidence": {
    "scheme": "aipou-receipt-v1",
    "evidenceClass": "issuer_asserted",
    "verificationStatus": "local"
  }
}
```

The payment receipt remains the payment rail's proof.
The work receipt remains AIPOU's proof.
Neither upgrades the other.

## Verifier Behavior

A receiver does not need to become an AIPOU validator to carry the reference.

The smallest useful verifier behavior is:

1. treat the AIPOU object as external metadata on a completed sale;
2. keep it outside settlement authority and idempotency state;
3. never let it authorize payment or replace the rail's own receipt;
4. if local policy wants stronger assurance, check the linked AIPOU receipt
   under AIPOU's own verifier or validator flow;
5. if local policy does nothing with it, preserve it as audit metadata only.

## Non-Goals

This attachment note does not:

- add AIPOU as a second settling asset;
- ask a payment rail to mint, batch, or claim AIPOU rewards;
- treat self-payment, internal transfers, or experimental pool activity as
  marketplace revenue;
- imply partnership, endorsement, or settlement support from any payment rail.

Related material:

- [Work Receipt Boundaries](work-receipt-boundaries.md)
- [ReceiptId Interoperability](receiptid-interoperability.md)
- [Evidence Boundaries](evidence-boundaries.md)

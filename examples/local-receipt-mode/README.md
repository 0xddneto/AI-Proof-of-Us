# Local Receipt Mode Demo

This demo is for local AI users who do not want payments or claims yet.

The point:

```text
AI work -> local signed receipt -> private receipt history
```

No raw prompt upload. No required claim. No required payment.

## What It Shows

- A local AI task can produce a private receipt reference.
- The receipt can be exported or attached to traces later.
- AIPOU claims remain optional.
- AIPOU can be introduced to local AI communities without forcing crypto or payment language first.

## Suggested Local Message

```text
AIPOU can run as a private receipt trail for local AI work. Claims and payments are optional.
```

## Example Receipt Reference

See [sample-receipt-reference.json](sample-receipt-reference.json).

The example is intentionally minimal. It shows what another tool could store without seeing the raw prompt, raw output, private files, wallet private key, or collector private key.

## Local Workflow

1. Start a local AI task.
2. AIPOU creates a task nonce.
3. The local collector signs the completed receipt.
4. The user keeps the receipt locally.
5. Later, the user may export, validate, or claim receipts.

## Optional Claim Later

If the user later wants rewards:

```text
Claim my AIPOU.
```

That moves from Local Receipt Mode into Claim / Payment Mode.

Local users can ignore this until they want it.

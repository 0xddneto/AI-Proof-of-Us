# x402 / AP2 Demo Outline

AIPOU is not a payment rail.

This demo shows how a payment rail can reference AIPOU as external work evidence.

## Goal

Show:

```text
payment request -> AI task -> AIPOU receipt -> payment record references receiptId
```

The payment system does not validate AIPOU rewards. It only stores a reference to work evidence.

## Actors

- Human requester
- AI agent
- MCP client
- AIPOU MCP server
- Payment rail or agentic payment protocol
- Optional marketplace or coordinator

## Demo Flow

1. Human requests an AI task.
2. Payment rail creates or prepares a payment context.
3. Agent calls `begin_ai_task`.
4. Agent performs the work.
5. Agent calls `complete_ai_task`.
6. AIPOU creates a signed receipt with `receiptId`.
7. Payment record stores:

```json
{
  "workEvidence": {
    "type": "aipou.receipt",
    "receiptId": "0x...",
    "validationStatus": "local | validated | claimed",
    "evidenceBoundary": "https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/evidence-boundaries.md"
  }
}
```

8. Payment rail settles however it normally settles.
9. AIPOU claims remain optional and separate.

## What This Demonstrates

- AIPOU can prove receipt integrity and replay checks for AI work.
- Payment rails can reference AIPOU receipts without becoming AIPOU validators.
- Agents can use AIPOU as a reward/payment token when participants accept it.
- The system does not require raw prompt or output disclosure.

## What This Does Not Demonstrate

- AIPOU replacing x402 or AP2
- provider endorsement
- stable token price
- guaranteed payment acceptance
- objective proof of task quality

## First Demo Message

```text
I am testing AIPOU beside agentic payments, not as a replacement. AIPOU creates signed MCP work receipts; x402/AP2-style rails can store the receiptId as external work evidence before or after their own settlement flow.
```

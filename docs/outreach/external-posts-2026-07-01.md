# External Outreach Posts - 2026-07-01

These are destination-specific drafts for the first real AIPOU outreach pass.

Rules:

- Do not mass-post.
- Use one destination-specific message per project.
- Ask for placement, review, or interoperability feedback.
- Do not promise price, yield, liquidity, or guaranteed payment value.
- Do not claim AIPOU replaces scanners, traces, x402, AP2, AgentKit, or provenance tools.

## 1. Awesome MCP Servers

Target:

- https://github.com/punkpeye/awesome-mcp-servers

Preferred action:

- Ask category-fit question before sending a PR.

Title:

```text
Category fit for an MCP receipt/provenance server?
```

Body:

~~~markdown
Hi, I maintain [AI Proof of Us](https://github.com/0xddneto/AI-Proof-of-Us), an MCP receipt/provenance server for AI-agent tasks.

It is not an assistant. It records signed task receipts with:

- EIP-712 wallet authorization
- local Ed25519 collector signatures
- nonce/replay checks
- explicit evidence boundaries
- optional Base claims for approved receipts

The project is framed as MCP infrastructure: receipts, provenance, audit metadata, and optional reward settlement. It does not claim to detect hidden AI use, prove objective task value, replace scanners, or replace payment rails.

Would this belong in this list? If yes, is there an existing category that fits, or would a small "Provenance / Audit" category be appropriate?

Suggested entry:

```md
- [AI Proof of Us](https://github.com/0xddneto/AI-Proof-of-Us) - MCP receipt/provenance server for AI-agent tasks; records signed task receipts with wallet authorization, local collector signatures, replay checks, explicit evidence boundaries, and optional Base claims.
```
~~~

## 2. MCP Metadata / Lifecycle Discussion

Target:

- https://github.com/modelcontextprotocol/modelcontextprotocol/discussions
- fallback: https://github.com/orgs/modelcontextprotocol/discussions

Preferred action:

- Open a discussion, not a PR.

Title:

```text
Where should external task receipt IDs live in MCP client workflows?
```

Body:

~~~markdown
I am working on [AI Proof of Us](https://github.com/0xddneto/AI-Proof-of-Us), an MCP-first receipt/provenance server for AI-agent tasks.

The project records wallet-authorized task receipts with local collector signatures, replay checks, and explicit evidence boundaries. Raw prompts and outputs stay local by default. The receipt can later be referenced as external work evidence or optionally claimed through a separate settlement flow.

I am not proposing a core protocol change yet. I am trying to avoid putting receipt metadata in the wrong place.

For a portable external `receiptId`, which surface is most appropriate?

- companion MCP server
- client lifecycle hook
- tool result `_meta`
- trace/span attribute
- something else

The goal is to let MCP clients and related tools reference a receipt without making every server responsible for validating rewards or payment claims.

Relevant docs:

- Evidence boundaries: https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/evidence-boundaries.md
- receiptId interoperability: https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/receiptid-interoperability.md
~~~

## 3. OpenClaw / ClawHub Security Review

Target:

- https://github.com/openclaw/clawhub
- fallback: https://github.com/openclaw/openclaw

Preferred action:

- Ask for a security review path for an AIPOU skill.

Title:

```text
Review path for an AIPOU MCP receipt skill with explicit no-hidden-wallet-action rules
```

Body:

~~~markdown
I am preparing [AI Proof of Us](https://github.com/0xddneto/AI-Proof-of-Us) for OpenClaw users.

AIPOU is an MCP receipt/provenance server for AI-agent tasks. It can run in two modes:

- Local Receipt Mode: private signed receipts for local AI work; no claim, no payment, no raw prompt upload.
- Claim / Payment Mode: optional AIPOU claim or settlement only after explicit user instruction.

Because AIPOU touches wallets only for optional claims, I would like feedback on the safest review path before promoting an OpenClaw skill.

I added a checklist here:

https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/openclaw-skill-review-checklist.md

The intended safety rules are:

- no hidden wallet actions
- no background claims
- no primary wallet usage
- no raw prompt/output upload by default
- explicit user command required for settlement
- all contract addresses documented

What additional metadata, manifest fields, or review evidence would ClawHub/OpenClaw reviewers want before considering this safe to list or recommend?
~~~

## 4. LLMOps / Trace Metadata

Target:

- https://github.com/traceloop/openllmetry
- fallback: Helicone issue/discussion

Preferred action:

- Open an issue/question about metadata mapping.

Title:

```text
Mapping external AI-task receipt IDs into LLM trace/span metadata
```

Body:

~~~markdown
I am exploring how [AI Proof of Us](https://github.com/0xddneto/AI-Proof-of-Us) receipts should map into LLM traces.

AIPOU creates signed MCP task receipts with hashes, nonce/replay checks, local collector signatures, and explicit evidence boundaries. It does not replace traces, and trace systems should not be responsible for validating AIPOU rewards.

For observability, the useful part may be a small external reference:

```json
{
  "aipou.receipt_id": "0x...",
  "aipou.validation_status": "local | validated | claimed | rejected",
  "aipou.evidence_boundary": "https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/evidence-boundaries.md"
}
```

Would this belong as span attributes, session metadata, a linked event, or an external reference? I am trying to keep raw prompts/outputs private and avoid noisy or misleading metadata.

Interoperability note:

https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/receiptid-interoperability.md
~~~

## 5. Agentic Payments / x402 / AP2

Target:

- x402 / AgentKit / agentic-payment discussions where work evidence is relevant.

Preferred action:

- Do not ask to replace payment rails.
- Share demo outline as adjacent evidence.

Title:

```text
Using signed AI-work receipt IDs as external evidence beside agentic payments
```

Body:

~~~markdown
I am testing [AI Proof of Us](https://github.com/0xddneto/AI-Proof-of-Us) beside agentic payments, not as a replacement.

AIPOU creates signed MCP work receipts:

```text
payment request -> AI task -> AIPOU receiptId -> payment record external evidence
```

Humans can claim AIPOU for approved AI-assisted work receipts, and agents/marketplaces can voluntarily accept AIPOU as settlement. But AIPOU does not replace x402, AP2, stablecoins, or wallet automation.

The payment rail can simply reference:

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

Demo outline:

https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/x402-ap2-demo-outline.md

Would this kind of external work evidence be useful around agentic payment flows?
~~~

## 6. Local AI / Ollama Communities

Target:

- Local AI communities, Ollama tutorials, privacy-first agent workflows.

Preferred action:

- Do not lead with token claims.

Title:

```text
Private receipt trail for local AI work
```

Body:

~~~markdown
I am testing [AI Proof of Us](https://github.com/0xddneto/AI-Proof-of-Us) as a private receipt trail for local AI work.

The simplest mode is not about payments:

```text
AI work -> local signed receipt -> private receipt history
```

Local Receipt Mode:

- no raw prompt upload
- no required claim
- no required payment
- no primary wallet
- receipts can be inspected or exported later

Claims and payments are optional. Local users can ignore them until they want rewards.

Demo:

https://github.com/0xddneto/AI-Proof-of-Us/tree/main/examples/local-receipt-mode
~~~

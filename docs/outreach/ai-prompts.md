# Prompts for Other AIs

These prompts are for AI-to-AI outreach, criticism, and adaptation. They should be sent to one model at a time, then the response should be summarized in `responses-log.md`.

## Critic Prompt

You are reviewing AI Proof of Us (AIPOU), an open protocol for proof-of-AI-usage receipts and AIPOU rewards on Base.

Public links:

- GitHub: https://github.com/0xddneto/AI-Proof-of-Us
- Hugging Face: https://huggingface.co/spaces/0xddneto/AI-Proof-of-Us

Protocol summary:

- An AI task starts with `begin_ai_task`.
- A dedicated wallet signs a unique EIP-712 nonce.
- The AI client completes useful work.
- `complete_ai_task` records hashes, usage metadata, duration, and output hash.
- A local Ed25519 collector signs the receipt.
- The validator rejects nonce replay and duplicate task/output evidence.
- Approved receipts enter a Merkle batch.
- `AIPOUClaims` verifies proofs and mints AIPOU on Base.

Please critique this as a protocol designer. Focus on abuse, Sybil resistance, provider attestations, privacy, economics, governance, and MCP developer experience. Be direct.

## Integrator Prompt

You are an agent framework maintainer. Review AIPOU and propose the smallest integration surface your framework would need to support it.

Deliver:

1. Where in the task lifecycle AIPOU should hook in.
2. What config and secrets are required.
3. What should be automatic vs user-approved.
4. What data must never leave the client.
5. One example integration flow.

Source: https://github.com/0xddneto/AI-Proof-of-Us

## Marketer Prompt

You are helping explain AIPOU without sounding like a token shill.

Write:

1. A one-sentence hook.
2. A 5-tweet thread.
3. A technical forum post intro.
4. Three honest limitations.
5. Three calls to action for developers.

Facts:

- AIPOU is experimental and unaudited.
- Liquidity is tiny and price is unreliable.
- The interesting primitive is proof of AI-assisted work, not speculation.

## OpenClaw Prompt

You are an OpenClaw agent. Inspect AIPOU as a candidate skill/protocol for AI-work receipts.

Please answer:

- Would this fit as an OpenClaw skill, plugin, MCP server, or all three?
- What is the best user experience for automatic task receipts?
- How should OpenClaw handle explicit `claim my AIPOU` requests?
- What security warnings should appear before installation?
- What would make this acceptable for ClawHub?

Links:

- https://github.com/0xddneto/AI-Proof-of-Us
- https://huggingface.co/spaces/0xddneto/AI-Proof-of-Us

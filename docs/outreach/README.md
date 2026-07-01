# AIPOU Outreach

This folder is the public evangelism kit for AI Proof of Us.

The goal is to spread AIPOU through useful conversations with agent builders, MCP developers, local-model communities, AI users, and crypto infrastructure teams. The tone should be curious, technical, and transparent: AIPOU is an MCP-first receipt protocol for AI agents, not an investment promise.

## Files

- [ai-door-to-door.md](ai-door-to-door.md) contains audience-specific pitches.
- [ai-prompts.md](ai-prompts.md) contains prompts to send to other AI systems.
- [targets.md](targets.md) maps high-signal places to share AIPOU.
- [openclaw-roadshow.md](openclaw-roadshow.md) tracks OpenClaw automation status.
- [roadshow-next-steps.md](roadshow-next-steps.md) turns feedback into product and outreach priorities.
- [responses-log.md](responses-log.md) records AI and community feedback.
- [sprint-2026-07-01.md](sprint-2026-07-01.md) records the long outreach sprint, target queue, and prepared messages.
- [action-plan-2026-07-01.md](action-plan-2026-07-01.md) turns the sprint into a destination-specific outreach queue.
- [agent-roadshow-2026-07-01.md](agent-roadshow-2026-07-01.md) records the ongoing local-agent roadshow.
- [pr-drafts/](pr-drafts/) contains ready-to-adapt PR and discussion drafts for MCP lists, security lists, OpenClaw review, and LLMOps trace questions.

## Core Message

AI work is becoming distributed across many agents, providers, and local models. AIPOU asks a simple question:

```text
Can useful AI-assisted work produce portable, privacy-preserving receipts across agent clients?
```

The current answer is an MCP collector plus Base contracts:

1. A dedicated farming wallet authorizes a task with EIP-712.
2. The AI client records hashes and usage metadata, not raw private content.
3. A local Ed25519 collector signs the receipt.
4. The validator rejects replayed nonces and duplicate task/output evidence.
5. Approved receipts enter a Merkle batch.
6. `AIPOUClaims` verifies the proof and mints AIPOU on Base.

The strongest public framing is **MCP receipts for AI agents**, not "AI usage mining" or "earn tokens for using AI." AIPOU should sound like infrastructure for attestable AI workflows: billing, audit, provenance, routing, reputation, and agent marketplaces.

## Public Links

- GitHub: https://github.com/0xddneto/AI-Proof-of-Us
- Hugging Face Space: https://huggingface.co/spaces/0xddneto/AI-Proof-of-Us
- Reddit announcement: https://www.reddit.com/user/Any_Praline805/comments/1uklabn/i_built_an_open_mcp_protocol_that_rewards/
- Token: https://basescan.org/token/0x55f0Cc5e51A1284D20337d6cbb18938C8A1ABCbB
- Claims: https://basescan.org/address/0x4ca4C98fB784D20EdC8E2A7F531dAab4c6e53058

## Outreach Rules

- Do not spam. Prefer public posts, issues, discussions, and relevant replies.
- Do not promise token price, yield, liquidity, or future exchange listings.
- Do not hide limitations: client-signed receipts are not provider attestations.
- Do not ask anyone to paste private keys into chat.
- Do not imply a provider endorsed AIPOU unless there is explicit proof.
- Invite criticism. AIPOU gets stronger when skeptics test the assumptions.

## What to Ask For

- MCP clients: test the tool flow and report integration friction.
- Agent frameworks: add a farming skill or receipt hook.
- Local AI users: test receipts for local model tasks.
- Security people: attack the replay and Sybil assumptions.
- Crypto builders: review the Merkle claim design and emissions after understanding the MCP receipt layer.
- Market makers/liquidity providers: only after understanding tiny-liquidity risk.

## First Roadshow Findings

The first AI-to-AI review round produced three durable lessons:

- AIPOU currently proves authorization, receipt integrity, replay resistance, and claim inclusion. It does not yet prove objective value creation.
- AIPOU does not detect hidden AI use, replace scanners or policy gates, or imply provider endorsement.
- Public integrations should be a thin MCP lifecycle adapter, not a deep framework rewrite.
- Serious adoption needs trust packaging: dedicated wallet setup, explicit onchain warnings, provider-signed evidence, validator/multisig policy, emission controls, and clear anti-abuse rules.

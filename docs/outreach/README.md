# AIPOU Outreach

This folder is the public evangelism kit for AI Proof of Us.

The goal is to spread AIPOU through useful conversations with agent builders, MCP developers, local-model communities, AI users, security reviewers, privacy advocates, and crypto infrastructure teams. The tone should be proud, human-first, technical, and transparent: AIPOU is an MCP-first receipt protocol for humans working with AI, not an investment promise or token-mining pitch.

## Files

- [ai-door-to-door.md](ai-door-to-door.md) contains audience-specific pitches.
- [ai-prompts.md](ai-prompts.md) contains prompts to send to other AI systems.
- [targets.md](targets.md) maps high-signal places to share AIPOU.
- [door-to-door-2026-07-05.md](door-to-door-2026-07-05.md) contains the current human-first agent roadshow plan and messages.
- [door-to-door-2026-07-14.md](door-to-door-2026-07-14.md) records verified registry milestones, selected follow-ups, and three new technical outreach conversations.
- [door-to-door-2026-07-17.md](door-to-door-2026-07-17.md) records the Kuberna pin follow-up, AutoGen PR update, and new mcp-agent, AgentGraph, and ZeroID outreach.
- [door-to-door-2026-07-18.md](door-to-door-2026-07-18.md) records a new outreach round to ArmorerLabs, MCP core, A2A, and GitHub Community, plus drafts blocked by issue-comment UI limits.
- [door-to-door-2026-07-21.md](door-to-door-2026-07-21.md) verifies the public demo, `0.4.0` persistent identity release, Glama listing, and external directory submissions.
- [door-to-door-2026-07-22.md](door-to-door-2026-07-22.md) records the Glama trust manifest, GitHub `v0.4.0` release, current-version documentation fixes, and npm measurement checkpoint.
- [service-bounties-2026-07-23.md](service-bounties-2026-07-23.md) records the first concrete image, video, pixel-art, and 3D commissions offered for AIPOU settlement and the targeted providers contacted.
- [openclaw-roadshow.md](openclaw-roadshow.md) tracks OpenClaw automation status.
- [roadshow-next-steps.md](roadshow-next-steps.md) turns feedback into product and outreach priorities.
- [responses-log.md](responses-log.md) records AI and community feedback.
- [sprint-2026-07-01.md](sprint-2026-07-01.md) records the long outreach sprint, target queue, and prepared messages.
- [action-plan-2026-07-01.md](action-plan-2026-07-01.md) turns the sprint into a destination-specific outreach queue.
- [agent-roadshow-2026-07-01.md](agent-roadshow-2026-07-01.md) records the ongoing local-agent roadshow.
- [external-posts-2026-07-01.md](external-posts-2026-07-01.md) contains destination-specific drafts for real outreach posts.
- [external-results-2026-07-01.md](external-results-2026-07-01.md) records the first published external posts and links.
- [pr-drafts/](pr-drafts/) contains ready-to-adapt PR and discussion drafts for MCP lists, security lists, OpenClaw review, and LLMOps trace questions.

## Core Message

AI work is becoming distributed across many agents, providers, and local models. AIPOU starts with a human claim:

```text
People who spend their day working with AI should be able to keep private receipts and claim rewards for approved work.
```

Then it asks a technical question:

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

The strongest public framing is **humans working with AI can keep receipts and claim approved rewards**. The technical framing is **receipts for AI work**, not "AI usage mining" or passive token hype. AIPOU should sound like useful infrastructure for people, agents, and marketplaces: billing, audit, provenance, routing, reputation, and settlement.

For agent frameworks, the ask is intentionally small: a lifecycle adapter that starts a receipt, ends a receipt, and exposes `receiptId`, provider/model metadata, task hash, output hash, and validation status. Framework maintainers should not need to understand Merkle trees, Base claims, validator keys, or token settlement.

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

- MCP clients: test the tool flow and report where `receiptId` belongs.
- Agent frameworks: test a lifecycle adapter or receipt hook.
- Local AI users: test receipts for local model tasks.
- Security people: attack the replay and Sybil assumptions.
- Privacy advocates: review whether the hash-only receipt trail avoids leaking prompts and outputs.
- Crypto builders: review the Merkle claim design, validator assumptions, and emissions after understanding the MCP receipt layer.
- Market makers/liquidity providers: only after understanding tiny-liquidity risk.

## First Roadshow Findings

The first AI-to-AI review round produced three durable lessons:

- AIPOU currently proves authorization, receipt integrity, replay resistance, and claim inclusion. It does not yet prove objective value creation.
- AIPOU does not detect hidden AI use, replace scanners or policy gates, or imply provider endorsement.
- Public integrations should be a thin MCP lifecycle adapter, not a deep framework rewrite.
- Serious adoption needs trust packaging: dedicated wallet setup, explicit onchain warnings, provider-signed evidence, validator/multisig policy, emission controls, and clear anti-abuse rules.

# AIPOU Launch Kit

## Short announcement

AI Proof of Us is an MCP-first protocol for AI agents and agent developers. It gives Codex, Claude, Cursor, OpenClaw, local models, and other MCP-compatible clients a shared way to create signed receipts for useful AI-assisted work. AIPOU is the Base reward token attached to approved receipts after validation.

GitHub: https://github.com/0xddneto/AI-Proof-of-Us
Hugging Face: https://huggingface.co/spaces/0xddneto/AI-Proof-of-Us

## Published links

- Hugging Face Space: https://huggingface.co/spaces/0xddneto/AI-Proof-of-Us
- Reddit announcement: https://www.reddit.com/user/Any_Praline805/comments/1uklabn/i_built_an_open_mcp_protocol_that_rewards/
- Outreach kit: docs/outreach/README.md

## Reddit post

### Title

I built an MCP-first receipt protocol for AI agents on Base

### Body

I have been exploring a simple question: can useful work performed with any AI become portable proof instead of staying trapped inside one provider's usage dashboard?

AI Proof of Us is an open-source experiment built around MCP and Base. It is aimed at agent developers, MCP client builders, and model-neutral clients such as Codex, Claude, Cursor, OpenClaw, and local models.

The flow:

1. A dedicated farming wallet authorizes a task with EIP-712 and a unique nonce.
2. The AI client completes the work and records hashes plus usage metadata, not the raw prompt or output.
3. A local Ed25519 collector signs the receipt.
4. The validator checks signatures, nonce reuse, and duplicate task/output evidence.
5. Approved receipts enter a Merkle batch.
6. The AIPOUClaims contract verifies the proof and mints AIPOU on Base.

Users can work across many projects with one farming identity and later tell the agent, "Claim my AIPOU." The agent handles batching and settlement.

Why this might matter: if agents can share a neutral receipt layer, AIPOU could eventually become one primitive for agent incentives or agent-to-agent payment. That is a direction, not a claim that the network is already there.

Important limitations: the protocol is experimental and unaudited. Client-signed receipts do not independently prove provider inference. Sybil resistance and work-quality validation remain open problems. The AIPOU/WETH pool has intentionally tiny liquidity, so its market price is highly volatile and should not be treated as reliable. This is not an investment pitch.

I am looking for developers and agent builders who want to test the MCP flow, improve attestations, challenge the anti-abuse model, or integrate another client.

Source and setup: https://github.com/0xddneto/AI-Proof-of-Us

## Discussion prompts

- What evidence should qualify as provider-signed without centralizing the protocol?
- How should useful work be distinguished from prompt spam?
- Should reward rates be governed by stake, reputation, fees, or task markets?
- What would an agent need before accepting AIPOU from another agent?

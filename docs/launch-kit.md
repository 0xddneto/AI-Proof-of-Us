# AIPOU Launch Kit

## Short announcement

AI Proof of Us is an MCP-first receipt protocol for humans working with AI. It gives Codex, Claude, Cursor, OpenClaw, local models, and other MCP-compatible clients a shared way to create signed task receipts without publishing raw prompts or outputs. AIPOU is the Base reward and settlement token attached only to validator-approved receipts.

GitHub: https://github.com/0xddneto/AI-Proof-of-Us
Hugging Face: https://huggingface.co/spaces/0xddneto/AI-Proof-of-Us

## Published links

- Hugging Face Space: https://huggingface.co/spaces/0xddneto/AI-Proof-of-Us
- Reddit announcement: https://www.reddit.com/user/Any_Praline805/comments/1uklabn/i_built_an_open_mcp_protocol_that_rewards/
- Outreach kit: docs/outreach/README.md

## Reddit post

### Title

I built an MCP-first receipt protocol for people working with AI all day

### Body

I have been exploring a simple question: if people spend the whole day working with AI agents, can that effort leave a private receipt and become claimable later?

AI Proof of Us is an open-source experiment built around MCP and Base. It is aimed at the humans using AI agents to actually work, and at the developers building the clients those humans depend on: Codex, Claude, Cursor, OpenClaw, local models, and other MCP-compatible tools.

The flow:

1. A dedicated farming wallet authorizes a task with EIP-712 and a unique nonce.
2. The AI client completes the work and records hashes plus usage metadata, not the raw prompt or output.
3. A local Ed25519 collector signs the receipt.
4. The validator checks signatures, nonce reuse, and duplicate task/output evidence.
5. Approved receipts enter a Merkle batch.
6. The AIPOUClaims contract verifies the proof and mints AIPOU on Base.

The human loop is the point: work with AI, keep private receipts, claim AIPOU for approved work.

Frameworks do not need to understand Base, Merkle proofs, or reward formulas to support that loop. The smallest useful integration is a lifecycle adapter: start a receipt, end a receipt, then expose `receiptId`, provider/model metadata, task hash, output hash, and validation status.

Users can work across many projects with one receipt identity and later, if they want settlement, tell the agent, "Claim my AIPOU." The agent handles batching and settlement.

Why this might matter: the AI workday is becoming real work across many tools. If agents can share a neutral receipt layer, humans get a way to carry proof of effort across clients, and AIPOU can become useful infrastructure for billing, audit, provenance, routing, reputation, marketplaces, and eventually agent-to-agent settlement. That is a direction, not a claim that the network is already there.

Important limitations: the protocol is experimental and unaudited. Client-signed receipts do not independently prove provider inference or trustlessly prove useful work. The validator is currently a protocol authority for `client_signed` receipts. Sybil resistance and work-quality validation remain open problems. The AIPOU/WETH pool is still small, although `99.9999%` of its LP supply is locked until July 8, 2027. Its market price remains volatile and should not be treated as reliable. This is not an investment pitch.

I am looking for developers, agent builders, security reviewers, and privacy-minded local AI users who want to test the MCP flow, improve attestations, challenge the anti-abuse model, or integrate another client.

Source and setup: https://github.com/0xddneto/AI-Proof-of-Us

## Discussion prompts

- What evidence should qualify as provider-signed without centralizing the protocol?
- Where should `receiptId` live in agent frameworks: lifecycle hooks, traces, `_meta`, or external audit references?
- How should useful work be distinguished from prompt spam?
- Should reward rates be governed by stake, reputation, fees, or task markets?
- What would an agent need before accepting AIPOU from another agent?

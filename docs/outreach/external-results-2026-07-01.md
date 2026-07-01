# External Outreach Results - 2026-07-01

This file records the first real destination-specific AIPOU outreach pass.

Rules followed:

- One message per destination.
- No mass posting.
- No price, yield, liquidity, or guaranteed payment promises.
- No claim that AIPOU replaces scanners, traces, x402, AP2, stablecoins, wallets, or provenance tools.
- Each post asked for placement, review, interoperability feedback, or category fit.

## Published

### Awesome MCP Servers

- URL: https://github.com/punkpeye/awesome-mcp-servers/issues/9036
- Type: issue
- Topic: category fit for an MCP receipt/provenance server
- Goal: ask whether AIPOU belongs in the list and whether a provenance/audit category is appropriate.
- Follow-up: added a transparency update pointing to `docs/tokenomics.md`, Local Receipt Mode, no hidden wallet actions, and the returned experimental pool buy.

### Model Context Protocol

- URL: https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2996
- Type: discussion
- Category: Q&A - Client implementation
- Topic: where external task receipt IDs should live in MCP client workflows
- Goal: ask whether `receiptId` belongs in a companion server, lifecycle hook, tool result `_meta`, trace/span attribute, or another surface.
- Follow-up: clarified that AIPOU remains receipt-first, claims are optional for the human operating the agent, and Local Receipt Mode is the safest test path.

### OpenClaw / ClawHub

- URL: https://github.com/openclaw/clawhub/issues/2946
- Type: issue
- Topic: review path for an AIPOU MCP receipt skill
- Goal: ask what metadata, manifest fields, or review evidence ClawHub/OpenClaw reviewers want before listing or recommending the skill.
- Follow-up: added safety and tokenomics transparency framing for OpenClaw review.
- Status: ClawHub automation started a review placeholder on the issue.

### OpenLLMetry / Traceloop

- URL: https://github.com/traceloop/openllmetry/issues/4340
- Type: issue
- Topic: mapping external AI-task receipt IDs into LLM trace/span metadata
- Goal: ask whether AIPOU receipt references belong as span attributes, session metadata, linked events, or external references.
- Follow-up: clarified that traces should not validate rewards; they can optionally carry `aipou.receipt_id` as an external reference.

### a2a-x402

- URL: https://github.com/google-agentic-commerce/a2a-x402/discussions/143
- Type: discussion
- Category: Ideas
- Topic: using signed AI-work receipt IDs as external evidence beside agentic payments
- Goal: position AIPOU as optional work evidence beside x402/AP2-style payment flows, not a payment rail replacement.
- Follow-up: clarified that x402-style flows handle payment and AIPOU only supplies optional signed work evidence and human reward claims.

### lastmile-ai / mcp-agent

- URL: https://github.com/lastmile-ai/mcp-agent/discussions/715
- Type: discussion
- Category: Q&A
- Topic: whether MCP task receipts fit as an `mcp-agent` workflow companion
- Goal: ask whether AIPOU should integrate as a companion MCP server, workflow hook, trace/span receipt metadata, or another pattern.
- Message: emphasized Local Receipt Mode, human rewards for approved AI-assisted work, no raw prompt upload, no required payment, no primary wallet use, and tokenomics transparency.

## Recurring Outreach

A recurring Codex heartbeat named `AIPOU agent outreach loop` was created to continue this mission every 10 minutes.

Standing rules:

- Search for genuinely relevant AI agent, MCP, local AI, LLMOps, agentic payment, and developer-tool communities.
- Do not spam or post duplicates.
- Do not promise price, yield, liquidity, investment value, or guaranteed rewards.
- Prefer technical discussions, review requests, and interoperability questions.
- Record links, replies, and decisions in this outreach folder.

## Not Posted

### Local AI / Ollama Communities

The local AI message was kept as a repo demo instead of being posted externally in this pass.

Reason: no clean official Ollama discussion target was identified during this pass, and the project should avoid generic community posting that looks like promotion rather than useful interoperability work.

Relevant artifact:

- https://github.com/0xddneto/AI-Proof-of-Us/tree/main/examples/local-receipt-mode

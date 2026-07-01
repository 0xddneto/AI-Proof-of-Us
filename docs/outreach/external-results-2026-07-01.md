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

### Discovery Pass - 17:20 UTC

- CrewAI: https://github.com/crewAIInc/crewAI/discussions
  - Fit: active agent framework with first-party MCP support and public discussion categories for integrations and production workflows.
  - Decision: strong next outreach target, but no post was made in this pass because the previous outreach round had just finished. A later message should ask where a receipt companion belongs in CrewAI task lifecycle hooks, not advertise a token.
- Shinkai Local AI Agents: https://github.com/dcSpark/shinkai-local-ai-agents
  - Fit: unusually close match because it combines local and remote AI agents, MCP, crypto, and payments.
  - Decision: do not open a generic promotional issue. The repository does not expose GitHub Discussions; wait for a concrete integration question, contribution path, or official community channel.
- Chidori: https://github.com/ThousandBirdsInc/chidori
  - Fit: deterministic agent execution, checkpointing, replay, and logged side effects could provide useful receipt inputs.
  - Decision: keep as a later technical interoperability target; any message should focus on mapping replay/session evidence into an external receipt, with claims remaining optional.
- E2B: https://github.com/e2b-dev
  - Fit: agent sandbox and execution evidence are adjacent to receipt validation.
  - Decision: no contact yet. AIPOU should first define a concrete sandbox attestation or execution-hash integration question so the outreach is useful rather than generic.

### CrewAI Attempt - 17:30 UTC

- Destination: https://github.com/crewAIInc/crewAI/discussions
- Category considered: General
- Result: not posted. GitHub returned `You can't perform that action at this time` when opening the new-discussion flow.
- Decision: do not retry repeatedly, post into an unrelated existing thread, or work around the destination restriction.
- Draft topic: where a receipt-only MCP companion should attach to CrewAI task execution: task callback, step callback, event bus, trace metadata, or a separate MCP tool call.
- Required framing for a later attempt:
  - Receipts prove an authorized task flow; they do not claim to detect hidden AI use.
  - Local Receipt Mode does not upload raw prompts and does not require a wallet, token claim, or payment.
  - Optional validated claims reward the human operating the agent; CrewAI itself would not become a reward validator.
  - Link to the runnable example and tokenomics disclosure only after the technical question is clear.

### Local AI / Ollama Communities

The local AI message was kept as a repo demo instead of being posted externally in this pass.

Reason: no clean official Ollama discussion target was identified during this pass, and the project should avoid generic community posting that looks like promotion rather than useful interoperability work.

Relevant artifact:

- https://github.com/0xddneto/AI-Proof-of-Us/tree/main/examples/local-receipt-mode

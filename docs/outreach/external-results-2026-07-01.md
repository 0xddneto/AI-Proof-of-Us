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

### Discovery Pass - 17:40 UTC

- Previous-thread check:
  - Awesome MCP Servers issue remains open with no visible maintainer response.
  - MCP discussion remains unanswered; its only visible follow-up is the AIPOU author update.
  - OpenClaw / ClawHub issue remains open with no visible reviewer response.
  - Decision: no additional follow-up. Repeating the same links would add noise.
- Microsoft AutoGen: https://github.com/microsoft/autogen/discussions
  - Fit: active discussions already cover pre-action authority receipts, post-run trace audit reports, governance hooks, and trust verification for MCP tool calls.
  - Decision: do not create a parallel AIPOU announcement. First inspect the existing receipt/audit discussions and contribute only if AIPOU can answer a concrete schema, lifecycle-hook, or replay-protection question.
- PydanticAI: https://github.com/pydantic/pydantic-ai
  - Fit: first-party MCP support, OpenTelemetry observability, human-in-the-loop approvals, and durable execution provide clear integration points for external receipt IDs.
  - Decision: prepare a narrow technical question around carrying a receipt reference in spans or durable run state; do not open a generic project-promotion issue.
- Mastra: https://github.com/mastra-ai/mastra
  - Fit: MCP tooling, workflow run history, authorization, and observability traces make it relevant to receipt interoperability.
  - Decision: wait for a concrete mapping example between Mastra run IDs and AIPOU `receiptId` before outreach.

### Discovery Pass - 17:50 UTC

- Coinbase AgentKit: https://github.com/coinbase/agentkit
  - Fit: agent wallets, Base support, MCP integration, and framework adapters make it a natural consumer of optional receipt references.
  - Decision: do not pitch AIPOU as another wallet or payment rail. A useful future question is whether a wallet action result should carry an external `receiptId` or only an application-level binding.
- x402 Foundation: https://github.com/x402-foundation/x402
  - Fit: the project is actively discussing independently verifiable payment receipts and extension mechanisms, including issue https://github.com/x402-foundation/x402/issues/2357.
  - Decision: no comment yet. AIPOU must first provide a runnable binding example with `paymentHash`, `actionRef`, `receiptId`, mismatch rejection, and independent payment/receipt validation.
- ElizaOS: https://github.com/elizaOS/eliza
  - Fit: autonomous agents, wallet actions, and x402-adjacent projects are relevant.
  - Decision: defer outreach until there is an Eliza-specific receipt plugin or callback example; generic token promotion would be inappropriate.
- Documentation improvement: expanded `docs/x402-ap2-demo-outline.md` with an explicitly non-standard illustrative binding and failure requirements. The document now states that payment verification remains with x402 and receipt validation remains with AIPOU.

### Discovery Pass - 18:00 UTC

- Open WebUI: https://github.com/open-webui/open-webui/discussions
  - Fit: active MCP discussions include per-user authentication, privacy boundaries, tool execution, and missing per-user audit trails.
  - Decision: do not insert AIPOU into the existing OAuth discussion. That thread is solving identity isolation and token forwarding; a receipt protocol does not solve those requirements.
- Jan: https://github.com/menloresearch/jan
  - Fit: offline-first local AI is compatible with Local Receipt Mode.
  - Decision: no outreach until a Jan-specific MCP installation and private receipt example exists.
- AnythingLLM: https://github.com/Mintplex-Labs/anything-llm
  - Fit: local agents and MCP tools are relevant.
  - Decision: do not post into unrelated MCP bug and feature issues. Prepare a reproducible integration example first.
- ClawRouter: https://github.com/BlockRunAI/ClawRouter/discussions
  - Fit: OpenClaw integration, locally generated agent wallets, and x402 USDC payments make it a strong target for an optional external work-receipt reference.
  - Decision: draft prepared, but not posted while GitHub is refusing new-discussion actions on the account.

#### ClawRouter Draft

Title: `Where should an external work receipt ID attach to a paid ClawRouter model call?`

Body:

> I am testing AI Proof of Us beside OpenClaw and x402, not as a router or payment replacement. ClawRouter would continue to handle model routing, wallet authentication, and USDC settlement. AIPOU would only create a local signed task receipt, with no raw prompt upload and optional human reward claims after validation.
>
> For a portable `receiptId`, which ClawRouter surface would be least intrusive: response metadata, the local stats record, an x402 payment-context reference, or an OpenClaw lifecycle hook? Payment verification would remain with x402; receipt validation would remain with AIPOU.
>
> Local Receipt Mode: https://github.com/0xddneto/AI-Proof-of-Us/tree/main/examples/local-receipt-mode
>
> Illustrative x402 binding and failure boundaries: https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/x402-ap2-demo-outline.md

### Distribution Pass - 18:10 UTC

- Official MCP Registry: https://github.com/modelcontextprotocol/registry
  - Finding: this is the correct discovery channel for a public MCP server. The registry hosts metadata and verifies the separately published package.
  - Requirements found: a public npm package, a matching `mcpName`, `server.json`, namespace authentication, and publication through `mcp-publisher`.
  - Repository state before this pass: the MCP package was private and had no registry metadata.
  - Prepared: renamed the package to the currently unclaimed `aipou-mcp-server`, added `mcpName` `io.github.0xddneto/ai-proof-of-us`, package safety documentation, and `mcp-server/server.json`.
  - Not performed: npm publication, registry login, or registry publication. These require the owner's npm and GitHub authorization and should happen only after package validation.
- Docker MCP Registry: https://github.com/docker/mcp-registry
  - Decision: defer until the npm/official MCP Registry path is working. Maintaining two catalog submissions before the package is installable would create avoidable review noise.

### Distribution Pass - 18:20 UTC

- npm authentication check: this machine is not logged in; `npm whoami` returned `ENEEDAUTH`.
- MCPB alternative: https://github.com/modelcontextprotocol/mcpb
  - Finding: MCPB can distribute a one-click local bundle without npm, but it requires bundling runtime dependencies and maintaining a separate signed release artifact.
  - Decision: keep npm as the primary path because the prepared package is small, its production dependency audit is clean, and npm is the documented TypeScript quickstart for the official MCP Registry.
- OCI alternative:
  - Finding: the official registry supports OCI packages, but that would require a container build, registry publication, and additional runtime maintenance.
  - Decision: do not add a container solely to bypass npm authentication.
- Blocker: the owner must authorize `npm adduser` before the first `npm publish --access public`. Registry authentication can then use the existing GitHub namespace.

### Security Pass - 18:30 UTC

- Cloud Security Alliance MCP Server Audit: https://github.com/ModelContextProtocol-Security/mcpserver-audit
  - Fit: community review and shared MCP security findings are relevant after the package is publicly installable.
  - Decision: do not request an audit before npm or MCP Registry publication provides a reproducible package identifier.
- Cisco AI Defense MCP Scanner: https://github.com/cisco-ai-defense/mcp-scanner
  - Attempt: ran the documented YARA-only stdio scan against the local compiled server, without API or LLM keys.
  - Result: scan not executed. Installation stopped while building `yara-python` because Microsoft Visual C++ 14 or newer is not installed.
  - Decision: do not describe this as a pass or failure, and do not install a large native build toolchain solely for this scan.
- Existing checks that did complete:
  - MCP protocol tests: 2 passed.
  - npm production dependency audit for the MCP workspace: 0 known vulnerabilities.
  - package dry run: successful.
- Improvement: added a repository security policy with private-reporting guidance, dedicated-wallet rules, explicit settlement boundaries, and a warning that the project is experimental and unaudited.

### Local AI / Ollama Communities

The local AI message was kept as a repo demo instead of being posted externally in this pass.

Reason: no clean official Ollama discussion target was identified during this pass, and the project should avoid generic community posting that looks like promotion rather than useful interoperability work.

Relevant artifact:

- https://github.com/0xddneto/AI-Proof-of-Us/tree/main/examples/local-receipt-mode

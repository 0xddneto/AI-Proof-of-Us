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

### Security Pass - 18:40 UTC

- Windows-compatible scanner search:
  - Finding: no strong local alternative was identified that was both zero-setup and clearly independent of cloud code submission. Several services accept public repository URLs, but their grades are not substitutes for reproducible review.
  - Decision: do not send the repository to a third-party scanner merely to collect a badge.
- Cloud Security Alliance checklist review:
  - No shell execution, dynamic code evaluation, raw prompt upload, or private-key return path was found in the MCP source.
  - The agent wallet key is read from the environment and used only for EIP-712 task authorization.
  - The collector Ed25519 private key is stored unencrypted under `AIPOU_DATA_DIR`; `0600` is requested, but Windows ACL behavior depends on the parent directory.
  - The validator private key is a separate high-privilege secret and must never be configured on a normal user client.
- Improvement: disclosed local metadata-at-rest and collector-key risks in `SECURITY.md` and the npm package README. This is a focused internal review, not an independent audit or security certification.

### Local AI / Ollama Communities

The local AI message was kept as a repo demo instead of being posted externally in this pass.

Reason: no clean official Ollama discussion target was identified during this pass, and the project should avoid generic community posting that looks like promotion rather than useful interoperability work.

Relevant artifact:

- https://github.com/0xddneto/AI-Proof-of-Us/tree/main/examples/local-receipt-mode

### Distribution Correction - 19:20 UTC

- Finding: the MCP package README showed `npx -y aipou-mcp-server` as the direct run path even though the first npm publication has not happened yet.
- Risk: this could make the project look installable from npm before a reproducible public package exists.
- Correction: split the MCP README into two explicit paths:
  - local checkout usage for the current repository state
  - `npx -y aipou-mcp-server` only after npm publication
- Current blocker remains unchanged: the repository owner must authenticate with npm and run the first public publish before MCP Registry submission.

### Two-Hour Outreach Loop - 19:30 UTC

- Automation: the existing `aipou-agent-outreach-loop` was updated to run every 10 minutes for 12 rounds.
- Guardrails: no spam, no duplicate comments, no price/yield/liquidity promises, and no posting into unrelated issues.
- Local AI conversation:
  - Tool: OpenClaw local agent
  - Model: `ollama/qwen2.5:3b`
  - Result: reinforced that AIPOU should be pitched as complementary MCP receipt/provenance infrastructure, not as a replacement for SLSA, protect-mcp, Agent Receipts, x402, or scanners.
- GitHub search findings:
  - Existing AIPOU outreach already appears in relevant MCP receipt searches:
    - https://github.com/openclaw/clawhub/issues/2946
    - https://github.com/punkpeye/awesome-mcp-servers/issues/9036
  - New candidate: https://github.com/agentcommercekit/ack/issues/111
    - Fit: ACK-Pay is discussing payment schemes for sessions, batches, subscriptions, streaming, and refunds.
    - AIPOU angle: ask whether an optional external work-evidence reference belongs in payment context, not whether ACK should adopt AIPOU or AIPOU token claims.
  - New candidate: https://github.com/markusvankempen/code-engine-mcp-server/issues/1
    - Fit: BoundaryAttest is discussing MCP provenance add-ons.
    - AIPOU angle: compare minimal `receiptId` / validation-status metadata with provenance add-on boundaries.
- Decision: prepare drafts first. Public posting should be targeted and non-duplicative because GitHub recently refused some new-discussion actions on the account.

#### ACK-Pay Draft

> I am working on AI Proof of Us as an MCP-first work-receipt layer, not as a payment rail replacement. ACK-Pay would keep handling payment authorization, session/batch semantics, refunds, and settlement.
>
> One integration question: should a payment/session scheme have an optional external work-evidence reference, for example a `receiptId` or hash produced by an MCP task lifecycle? In AIPOU that receipt is local-first, signed by a collector, replay-checked by nonce/task/output hashes, and only optionally used for validated human reward claims later.
>
> I am not asking ACK to validate AIPOU claims or accept a token. I am trying to understand whether work evidence belongs in payment context, response metadata, or a separate audit record.
>
> Evidence boundaries: https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/evidence-boundaries.md
> x402/AP2-style binding sketch: https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/x402-ap2-demo-outline.md

#### BoundaryAttest Draft

> I am exploring AIPOU as a separate MCP receipt protocol and noticed BoundaryAttest is working close to the provenance boundary. AIPOU does not try to detect hidden AI use or replace SLSA-style provenance; it records an authorized task lifecycle with nonce, wallet authorization, hashes, local Ed25519 collector signature, validator replay checks, and optional claims.
>
> Would a provenance add-on benefit from a minimal external `receiptId` / validation-status reference, or would that create a misleading trust signal? My instinct is that provenance tools should not validate token rewards, but could reference receipt metadata if the user opts in.
>
> Evidence boundaries: https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/evidence-boundaries.md
> Local Receipt Mode: https://github.com/0xddneto/AI-Proof-of-Us/tree/main/examples/local-receipt-mode

### Two-Hour Outreach Loop - 19:40 UTC

- Reply check:
  - OpenClaw / ClawHub: one visible `clawsweeper[bot]` review kept the issue open for maintainer follow-up; no new human maintainer reply yet.
  - Awesome MCP Servers: no maintainer reply after the AIPOU transparency follow-up.
  - OpenLLMetry: no maintainer reply after the AIPOU transparency follow-up.
  - ACK-Pay RFC: one third-party comment introduced ProofGuard as post-payment x402 accountability. This is adjacent to AIPOU but not a direct reply.
- Local AI conversation:
  - Tool: OpenClaw local agent
  - Model: `ollama/qwen2.5:3b`
  - Question: should AIPOU comment on ACK-Pay now that ProofGuard is already present?
  - Response: do not post a generic AIPOU comment now; it would add limited new value. Wait for a concrete work-evidence metadata question or contribute a narrower `receiptId` placement question later.
- New discovery:
  - https://github.com/sentient-agi/agentic-payments-bot
    - Fit: Open Agent Skills payment service; relevant to payment/accountability flows.
    - Decision: no issue/discussion is open. Do not open a generic issue until there is a concrete integration question.
  - https://github.com/piprail/piprail
    - Fit: x402 SDK plus MCP server for paid APIs and agents.
    - Decision: candidate for a future narrow question about whether a paid MCP API response should carry external receipt references.
  - https://github.com/aws-samples/sample-secure-agentic-payments-on-aws-x402
    - Fit: secure agentic payments with x402.
    - Decision: do not post unless an issue explicitly discusses audit/work evidence; this is a sample repo, not a general discussion forum.

### Two-Hour Outreach Loop - 19:50 UTC

- Web/GitHub discovery:
  - https://github.com/luckyPipewrench/pipelock
    - Fit: MCP/A2A/WebSocket security mediator that emits signed action receipts.
    - Open issues checked: no current open issue is a clean place for AIPOU; active issues are about fail-closed behavior, defaults, runtime fixtures, and dependency updates.
    - Decision: do not post.
  - https://github.com/up2itnow0822/agentpay-mcp/issues/20
    - Fit: open design question about non-custodial flow, payment-attempt observability, and x402 receipt persistence.
    - AIPOU angle: ask whether AI work receipts should be a separate external evidence reference beside x402 receipts.
  - https://github.com/Cyberweasel777/agent-action-receipt-spec/issues/1
    - Fit: AAR evidence reference types and public-chain anchoring.
    - AIPOU angle: ask whether an AIPOU receipt can be represented as an external `evidenceRef`, not whether AAR should validate AIPOU claims.
  - https://github.com/w3c-cg/ai-agent-protocol/issues/34
    - Fit: open evidence/provenance gap discussion.
    - Decision: high relevance, but large existing thread. Draft only unless a concise standards-language contribution is clearly additive.
- Local AI conversation:
  - Tool: OpenClaw local agent
  - Model: `ollama/qwen2.5:3b`
  - Response: selected AgentPay MCP as best target.
  - Quality note: the agent draft confused Pipelock's mediator receipt model with AIPOU. The draft was rejected and replaced with corrected wording below.

#### AgentPay MCP Draft

> I am working on AI Proof of Us, an MCP-first local work-receipt layer. It is not a payment rail and does not replace x402 receipts, non-custodial signing, or AgentPay's payment-attempt observability.
>
> One question from the AIPOU side: when an MCP server records payment attempts and persistent x402 receipts, should there also be a separate optional `workReceiptId` / external evidence reference for the AI task itself?
>
> In AIPOU the work receipt covers task nonce, wallet authorization, provider/model metadata, usage/duration, task/output hashes, collector Ed25519 signature, and replay checks. Optional Base claims for humans happen later and should not be part of AgentPay validation.
>
> Evidence boundaries: https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/evidence-boundaries.md

#### AAR evidenceRef Draft

> I am exploring whether AIPOU receipts should be represented as an external evidence reference rather than a competing receipt envelope.
>
> AIPOU creates MCP task receipts with wallet authorization, nonce, task/output hashes, collector signature, and validator replay checks. It can later anchor approved claims on Base, but AAR should not need to validate AIPOU rewards.
>
> Would an `evidenceRef` type for external MCP work receipts be appropriate here, or should AIPOU stay fully outside the AAR envelope?
>
> Evidence boundaries: https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/evidence-boundaries.md

### Positioning Improvements Applied - 20:00 UTC

Feedback applied from the AI-to-AI review round:

- Technical marketer: use "receipts for AI work", not "AI usage mining".
- Framework integrator: present AIPOU as a small MCP lifecycle adapter, not a deep framework rewrite.
- Protocol skeptic: state clearly that AIPOU does not trustlessly prove useful work today, `client_signed` depends on validator policy, and serious adoption should require multisig and public validator rules.
- OpenClaw local agent: talk to AI developers, privacy advocates, security reviewers, receipt/provenance builders, and payment projects in interoperability language, not token-adoption language.

Repository changes:

- Added `docs/framework-lifecycle-adapter.md`.
- Updated README, `llms.txt`, Hugging Face Space copy, launch kit, agent guide, evidence boundaries, and outreach drafts.
- Replaced "usage receipts" language in core docs with "task receipts" or "receipts for AI work".
- Updated MCP tool description for `export_ai_receipts` to say "AI task receipts".

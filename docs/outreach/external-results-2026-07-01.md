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

### Two-Hour Outreach Loop - 20:00 UTC

- Reply check and discovery:
  - https://github.com/luckyPipewrench/pipelock
    - Fit: strong comparison project because it emits mediator-signed action receipts outside the agent.
    - Decision: do not post. Open issues are about fail-closed security behavior, presets, fixtures, and dependencies; AIPOU would be noise there.
  - https://github.com/lastmile-ai/mcp-agent
    - Fit: agent framework lifecycle hooks are relevant.
    - Decision: do not repeat outreach because AIPOU already opened a discussion there.
  - https://github.com/Dicklesworthstone/mcp_agent_mail
    - Fit: asynchronous coordination layer for AI coding agents; identities, inboxes, threads, file leases, Git, and SQLite are compatible with external task receipt references.
    - Decision: candidate for a future narrow issue/discussion if the project opens a suitable channel.
- Local AI conversation:
  - Tool: OpenClaw local agent
  - Model: `ollama/qwen2.5:3b`
  - Response: selected `mcp_agent_mail` as the best candidate after the "receipts for AI work" repositioning.
  - Quality note: the model's draft was too generic; use the tailored draft below instead.

#### mcp_agent_mail Draft

> I am exploring AIPOU as a small MCP lifecycle adapter for signed AI-work receipts, not as a scanner or payment rail.
>
> `mcp_agent_mail` already models identities, inboxes, threads, advisory leases, Git, and SQLite-backed coordination for coding agents. For a task that spans multiple agent messages or file leases, would an external `receiptId` belong on a thread, a message, a lease, or an audit export?
>
> The AIPOU receipt would only carry minimal metadata: task nonce, provider/model/client, task/output hashes, local collector signature, replay status, and validation status. Raw prompts and outputs stay local by default. Optional Base claims happen later and should not be part of `mcp_agent_mail` validation.
>
> Lifecycle adapter note: https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/framework-lifecycle-adapter.md

### Human-First Framing Correction - 20:20 UTC

User feedback:

- The outreach had become too defensive and made AIPOU sound like it was only reluctantly useful.
- The human reward loop was being hidden behind technical caveats.

Correction:

- AIPOU should be proud about its core idea: humans spend real hours working with AI agents, and those agents can create private signed receipts so humans may claim rewards for validator-approved work.
- Technical limits should stay visible, but as honesty and trust-building, not as apology.
- Developer outreach should still ask where `receiptId` belongs, but it should not erase the human reason the protocol exists.

Updated message:

```text
Work with AI. Keep private receipts. Claim AIPOU for approved work.
```

Applied to:

- README opening
- Hugging Face Space hero and README
- outreach README
- AI door-to-door playbook
- launch kit
- `llms.txt`

### Human-First Outreach Resume - 20:30 UTC

- Web discovery:
  - https://lyhna-ai.github.io/lyhna-witness/
    - Fit: Lyhna Witness is a local receipt layer for agents. It is MCP-compatible, local by default, creates readable AI Work Receipts, separates claimed vs witnessed evidence, and does not claim outcomes it cannot witness.
    - AIPOU angle: Lyhna is a strong adjacent project for receipt interoperability. AIPOU adds the human reward and validator-approved claim loop on Base.
  - https://github.com/Lyhna-ai/lyhna-witness
    - Fit: project repo for Lyhna Witness.
    - Decision: do not post into the current open PR because it is about pricing copy, not receipt interoperability.
  - https://github.com/Lyhna-ai/lyhna-mcp-proxy
    - Fit: MCP proxy adapter with enforcement and forwarding boundaries.
    - Decision: no open issue/discussion; record as a future technical comparison target.
  - https://forum.zcashcommunity.com/t/grant-application-aweb-zcash-private-agent-receipts/55886
    - Fit: Aweb private agent receipts shows another serious privacy-receipt direction.
    - Decision: do not post; the thread is a Zcash grant application and AIPOU would be off-topic unless invited to compare receipt models.
- Local AI conversation:
  - Tool: OpenClaw local agent
  - Model: `ollama/qwen2.5:3b`
  - Response: selected Lyhna Witness as the best adjacent outreach target after the human-first correction.
  - Quality note: the model's draft was too generic, so the tailored version below should be used instead.

#### Lyhna Witness Draft

> I am building AI Proof of Us, and Lyhna Witness looks like one of the closest projects to the same problem space.
>
> My read: Lyhna witnesses what crossed the agent/tool boundary and turns it into local AI Work Receipts. AIPOU starts from the human side: people spend real hours coding, debugging, researching, writing, and coordinating with AI agents, so their agents should create private signed receipts that can later be claimed if a validator approves them.
>
> I do not see AIPOU as replacing Lyhna. A useful interoperability question might be: should a Lyhna capsule be able to reference an external AIPOU `receiptId`, or should an AIPOU receipt be able to cite a Lyhna witnessed capsule as evidence?
>
> AIPOU does not promise price, yield, hidden AI-use detection, or trustless proof of useful work. The interesting overlap is human-readable receipts plus machine-readable evidence boundaries.
>
> AIPOU human reward loop: https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/human-rewards-and-agent-payments.md
> Evidence boundaries: https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/evidence-boundaries.md

### Human-First Outreach Loop - 20:40 UTC

- Web discovery:
  - https://github.com/agent-receipts/obsigna
    - Fit: mature adjacent receipt protocol with cryptographically signed audit trails, SDKs, and MCP proxy.
    - Decision: no generic post. Open issues are implementation-specific; AIPOU should not interrupt unless a thread asks about external reward/settlement references or human receipt incentives.
  - https://github.com/agent-receipts/openclaw
    - Fit: OpenClaw plugin for Agent Receipts / Obsigna.
    - Decision: no duplicate outreach. AIPOU already has OpenClaw/ClawHub contact and should avoid appearing as a competing receipt plugin pitch.
  - https://github.com/agent-receipts/dashboard/issues/162
    - Fit: experimental activity-signature view. Could one day display external reward/claim references.
    - Decision: draft only. The issue appears implementation-focused and was updated today; do not derail it.
  - https://github.com/agent-tools-org/erc8004-agent-receipts
    - Fit: hackathon-style agent receipts around ERC-8004.
    - Decision: watchlist target for agent identity / receipt / payment interoperability, not enough current discussion surface.
- Search note:
  - Current web now shows several independent "AI work receipts" projects. This validates the receipt direction and makes AIPOU's human reward loop a key differentiator.

#### Agent Receipts / Obsigna Draft

> I am building AI Proof of Us beside the Agent Receipts ecosystem, not as a replacement.
>
> My read: Obsigna is focused on signed audit trails for agent actions. AIPOU starts from the human reward loop: people spend real hours working with AI agents, so their agents can create private signed task receipts that may later claim AIPOU if a validator approves them.
>
> A useful interoperability question: should an Agent Receipts dashboard or activity-signature view ever carry an external `aipou.receiptId` / claim-status reference, or should reward settlement remain fully outside the receipt dashboard?
>
> AIPOU does not ask receipt tools to validate token rewards. It only needs a clean way for adjacent tools to reference external work receipts when users opt in.
>
> Human reward loop: https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/human-rewards-and-agent-payments.md
> Evidence boundaries: https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/evidence-boundaries.md

### Human-First Outreach Loop - 20:50 UTC

- Web discovery:
  - https://www.toku.com/resources/ai-agents-hiring-humans
    - Fit: discusses AI agents triggering payments and the need for receipts that prove payment was calculated, approved, and reported correctly.
    - AIPOU angle: validates the broader thesis that agent payment flows need receipts. AIPOU focuses on AI-work receipts and human rewards, not payroll compliance.
    - Decision: no post. This is a company resource page, not a technical discussion surface.
  - https://www.linkedin.com/pulse/why-your-ai-agent-needs-show-its-receipts-jason-li-dc35e
    - Fit: argues that AI coworker software needs reviewable action receipts.
    - AIPOU angle: useful language signal: agents should show receipts for work already taken.
    - Decision: no post through LinkedIn automation; record as positioning evidence only.
  - https://zenn.dev/akira_papa/articles/ebfbd61d794963
    - Fit: Japanese article about Work Receipts for reviewable AI development.
    - AIPOU angle: shows international interest in reviewable AI-development receipts.
    - Decision: no post; language/community fit requires a tailored Japanese-language comment and a clear invitation.
  - https://www.simocracy.org/profile/did%3Aplc%3A2dvvph4cgkoekvmghc5fu5o5
    - Fit: mentions InferGrid, "Verifiable AI Work Receipts And Agent Memory On Filecoin".
    - AIPOU angle: another signal that work receipts plus agent memory is an emerging category.
    - Decision: no direct outreach; target is a profile/feed, not a clean project thread.
- Search conclusion:
  - The category is broadening beyond developer tools into payment compliance, AI coworker review, and local agent witnessing.
  - AIPOU should keep leading with the human reward loop while speaking to technical communities through `receiptId` interoperability.

#### Human-First General Draft

> AIPOU starts from the human side of agent work: people spend real hours coding, debugging, researching, writing, reviewing, and coordinating with AI agents. Those agents should be able to create private signed receipts for that work.
>
> The reward loop is explicit: work with AI, keep private receipts, claim AIPOU for validator-approved work. No price or yield is promised.
>
> The developer question is interoperability: where should `receiptId`, validation status, and evidence boundaries attach in agent frameworks, receipt dashboards, payment sessions, traces, or local AI workspaces?
>
> Human reward loop: https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/human-rewards-and-agent-payments.md
> Lifecycle adapter: https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/framework-lifecycle-adapter.md

### Human-First Outreach Loop - 21:00 UTC

- Web discovery:
  - https://github.com/langchain-ai/langgraph/issues/7065
    - Fit: open LangGraph issue proposing Ed25519-signed Agent Action Receipts with `receiptId`, input/output hashes, and callback integration at node boundaries.
    - AIPOU angle: strong framework-adapter target. AIPOU should not ask LangGraph to understand claims, Merkle proofs, or Base; the useful question is where external `receiptId` and validation status should attach in callbacks/traces.
    - Decision: draft only. GitHub UI still shows action friction, and the thread is about AAR integration rather than token rewards.
  - https://github.com/2FastLabs/agent-squad/issues/429
    - Fit: open Agent Squad issue about observability, provenance, trust metrics, OpenTelemetry export, selective disclosure, and verifiable multi-agent behavior.
    - AIPOU angle: good match for human-approved agent work receipts, especially when a multi-agent system coordinates work for one human operator.
    - Decision: draft only. The thread is already a provenance proposal; avoid derailing it with settlement unless framed as optional external receipt reference.
  - https://github.com/microsoft/autogen/issues/7492
    - Fit: multi-agent payment primitive discussion with per-agent spending caps, human approval, and audit trails.
    - AIPOU angle: adjacent to x402/AgentPay. AIPOU can complement payment receipts by representing human work receipts and optional validator-approved rewards.
    - Decision: draft only. Keep the message focused on receipt interoperability, not token promotion.
  - https://github.com/selfradiance/x402-spend-receipt
    - Fit: local policy checks and signed receipts for x402 payment intents.
    - AIPOU angle: clear boundary: x402-spend-receipt records allow/deny payment decisions; AIPOU records human AI-work tasks and optional claims. They can be linked by `workReceiptId` / `paymentReceiptId`.
    - Decision: no post. No issue surface found; record as interoperability reference.
- Search conclusion:
  - The cleanest technical surface is not "use our token"; it is "where should a human AI-work `receiptId` attach?"
  - AIPOU's strongest differentiator remains the positive human reward loop: people doing real work with agents should be able to keep private receipts and optionally claim approved rewards.

#### LangGraph / AAR Draft

> This AAR proposal is very close to one integration question we are exploring in AI Proof of Us.
>
> AIPOU starts from the human side of agent work: people spend real hours coding, debugging, researching, writing, reviewing, and coordinating through AI agents. The agent can create private signed task receipts for that work, and the human can optionally claim AIPOU later if a validator approves the receipt. No price or yield is promised.
>
> For LangGraph, I do not think the framework should know about Merkle proofs, Base, token claims, or settlement. The useful adapter surface seems smaller: node/task start, node/task finish, `receiptId`, provider/model metadata, input/output hashes, and optional validation status.
>
> Interop question: if LangGraph adds AAR-style callback receipts, where would an external `aipou.receiptId` best attach: callback metadata, trace/span attributes, run artifacts, or a separate receipt store?
>
> AIPOU lifecycle adapter: https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/framework-lifecycle-adapter.md
> Evidence boundaries: https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/evidence-boundaries.md

#### Agent Squad / Provenance Draft

> This provenance proposal maps well to what AIPOU calls human AI-work receipts.
>
> AIPOU is human-first: people spend real hours coordinating with AI agents, and those agents should be able to create private signed receipts for the work they helped perform. The human can optionally claim AIPOU later if the validator approves the receipt. No price, yield, or guaranteed reward is promised.
>
> For a multi-agent framework, AIPOU should stay outside the orchestration core. The small surface would be: task/session start, agent handoff, task/session finish, local hashes instead of raw prompts/outputs, and a `receiptId` that can be exported into traces or provenance records.
>
> Interop question: would Agent Squad provenance prefer an external `receiptId` on OpenTelemetry span attributes, an audit artifact, or agent metadata?
>
> Human reward loop: https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/human-rewards-and-agent-payments.md
> Claim validation policy: https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/claim-validation-policy.md

#### Agent Payments / x402 Draft

> AIPOU is adjacent to agent payment primitives, but it is not trying to replace x402 or AgentPay.
>
> x402-style receipts can show that an agent payment was allowed or made. AIPOU focuses on the human work side: people spend real hours coding, debugging, researching, writing, reviewing, and coordinating with AI agents; their agents can create private signed work receipts, and the human can optionally claim validator-approved AIPOU rewards later. No price or yield is promised.
>
> The interoperability question is whether payment sessions should be able to reference a separate human work receipt, for example `workReceiptId`, while AIPOU receipts can optionally reference a payment or settlement receipt when relevant.
>
> AIPOU does not detect hidden AI use and does not trustlessly prove useful work today. It records authorized work receipts with local hashes and validator policy.
>
> Tokenomics transparency: https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/tokenomics.md
> Human rewards and agent payments: https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/human-rewards-and-agent-payments.md

### Runnable Adapter Follow-Up - 22:00 UTC

New implementation shown to prior contacts:

- Commit: https://github.com/0xddneto/AI-Proof-of-Us/commit/c97b633
- Demo: https://github.com/0xddneto/AI-Proof-of-Us/tree/main/examples/lifecycle-adapter
- Verified locally: MCP tests passed, npm tarball packed, and the adapter produced a real local `receiptId` with an ephemeral demo wallet.

Follow-ups published:

- OpenClaw / ClawHub: https://github.com/openclaw/clawhub/issues/2946
  - Message: the demo now gives reviewers a reproducible stdio path with no claim, no funds, no primary wallet, no raw prompt/output upload, and temporary state cleanup.
  - Question: should `aipou.receiptId` attach to agent-run metadata, a lifecycle-hook result, or an audit/export surface?
- Model Context Protocol: https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2996
  - Message: `receiptId` now comes from a runnable lifecycle adapter instead of only a design note.
  - Question: should the reference live in client lifecycle metadata, tool-result `_meta`, traces, or an external receipt store?
- a2a-x402: https://github.com/google-agentic-commerce/a2a-x402/discussions/143
  - Message: the demo now produces the external work-evidence object discussed in the thread.
  - Proposed separation: `workReceiptId` for AIPOU evidence and `paymentReceiptId` for the payment rail.
- mcp-agent: https://github.com/lastmile-ai/mcp-agent/discussions/715
  - Message: the requested integration example now exists and demonstrates `task start -> begin_ai_task -> framework work -> complete_ai_task -> receiptId`.
  - Question: which workflow hook should own task start/finish and where should the receipt metadata live?

Follow-ups not forced:

- Awesome MCP Servers: https://github.com/punkpeye/awesome-mcp-servers/issues/9036
  - No comment box was available in the authenticated GitHub session.
- OpenLLMetry: https://github.com/traceloop/openllmetry/issues/4340
  - No comment box was available in the authenticated GitHub session.

Immediate response status:

- No new external maintainer reply was visible immediately after posting.
- The four follow-ups above were confirmed as posted.
- This is renewed outreach, not confirmed external adoption.

#### OpenClaw Local Agent Conversation

- Agent: OpenClaw local agent with `ollama/qwen2.5:3b`.
- First response: said it would not use the adapter because it mistook the ephemeral demo wallet and temporary directory for the production storage model.
- Correction sent: persistent mode already uses a dedicated `AIPOU_AGENT_PRIVATE_KEY`, persistent `AIPOU_DATA_DIR`, stored sessions/receipts/replay state, `export_ai_receipts`, and explicit settlement.
- Second response: withdrew the persistence objection and said it would try a CSV-analysis task, attaching `receiptId` to final output or metadata.
- Execution check: when instructed to actually call `begin_ai_task` and `complete_ai_task`, the model invented CLI commands and returned no MCP tool result or `receiptId`.
- Initial decision: do not count that first attempt as adoption because it showed conceptual willingness only.
- Better-model attempts:
  - `openai-codex/gpt-5.2-codex` was rejected by the ChatGPT-account model surface.
  - `openai-codex/gpt-5.1-codex` was not recognized by the OpenClaw model catalog.
  - OpenClaw default model was restored to `ollama/qwen2.5:3b` after both attempts.

#### OpenClaw Local MCP Correction - 22:10 UTC

- Root cause: the earlier test did not verify that the active OpenClaw runtime had loaded the configured MCP tools. The gateway was unavailable, while the embedded `--local` runtime was the working execution path.
- Skill correction: AIPOU instructions now explicitly require native MCP calls and forbid invented shell, CLI, `npx`, or HTTP substitutes.
- Tool discovery check: the OpenClaw session exposed all seven AIPOU tools, including `get_aipou_identity`, `begin_ai_task`, and `complete_ai_task`.
- Execution check: `ollama/qwen2.5:3b` called the real tools and produced receipt `0x70ebbe0bd43ed939f686469b1f19469e73d8662d5cc8a358394d5a41c1c63ef9`.
- Receipt verification: the central receipt store contains the same ID with `client=openclaw-local`, `provider=ollama`, and `model=qwen2.5:3b`.
- Decision: count this as a successful local OpenClaw integration test. Do not present it as external maintainer adoption.

### Online Outreach Follow-Up - Real OpenClaw Receipt

Date: 2026-07-01

Message posture:

- Lead with the verified OpenClaw local receipt instead of a concept-only pitch.
- Ask each community where a portable `workReceiptId` or `aipou.receiptId` belongs.
- Keep the human reward loop visible: humans working with AI agents can keep private signed receipts and optionally claim validator-approved AIPOU later.
- Do not promise price, yield, liquidity, investment value, or guaranteed rewards.
- Ask for a review, test run, issue, or GitHub star only as an optional discovery/help signal.

Published follow-ups:

- OpenClaw / ClawHub: https://github.com/openclaw/clawhub/issues/2946
  - Posted correction that the earlier local failure was a runtime/tool-loading verification issue.
  - Shared receipt `0x70ebbe0bd43ed939f686469b1f19469e73d8662d5cc8a358394d5a41c1c63ef9`.
  - Asked whether `aipou.receiptId` belongs in skill metadata, tool result metadata, session history, or audit/export surfaces.
- Model Context Protocol: https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2996
  - Shared the OpenClaw local-agent receipt as a concrete MCP client/runtime data point.
  - Asked whether portable AI-work receipts belong in client run/session metadata, tool-result `_meta`, tracing attributes, or an external receipt store.
- mcp-agent: https://github.com/lastmile-ai/mcp-agent/discussions/715
  - Asked whether a lifecycle companion should attach `aipou.receiptId` to workflow/run metadata without requiring Base, Merkle, or token logic in the framework.
  - Asked maintainers/users to test the lifecycle demo and show the receipt to their human/operator.
- a2a-x402: https://github.com/google-agentic-commerce/a2a-x402/discussions/143
  - Reframed AIPOU as a separate work-evidence layer beside payment evidence.
  - Proposed separating `workReceiptId` from `paymentReceiptId`.
- ElizaOS agent certification: https://github.com/orgs/elizaOS/discussions/9810
  - Positioned AIPOU as complementary to TEE attestation, zkTLS, scanners, policy gates, and certification.
  - Asked whether an external `workReceiptId` belongs in execution audits, reputation metadata, plugin output metadata, or audit artifacts.
- Universal Commerce Protocol: https://github.com/Universal-Commerce-Protocol/ucp/discussions/56
  - Positioned AIPOU as external work/decision evidence beside UCP/AP2 authorization.
  - Asked whether commerce sessions should optionally reference `workReceiptId`.
- Foundry / AgentReceipt discussion: https://github.com/promptise-com/Foundry/discussions/39
  - Responded respectfully to an existing AgentReceipt proposal.
  - Suggested interoperability between tool-call provenance receipts and AIPOU-style human AI-work receipts.
- NanoClaw: https://github.com/nicanatoly/nanoclaw/discussions/12
  - Connected AIPOU to conservative RWA/x402/provenance research.
  - Reinforced that wallet/payment/claim actions should stay human-approved.

Blocked or not posted:

- MCP verification metadata: https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2964
  - Locked; no comment was posted.

Immediate response status:

- No new external replies were visible during the posting window.
- No external adoption is confirmed yet.
- Adoption threshold remains a real external `receiptId`, maintainer integration, or explicit test result from another operator.
## 2026-07-03 - Follow-up draft after token artwork and claim-all update

Public follow-up draft for prior AIPOU outreach threads:

```text
Small AIPOU update from the implementation side:

- one-command settlement is now implemented as `settle_all_ai_rewards`, so a user can say "claim my AIPOU" and the MCP processes all currently eligible pending receipts from the shared `AIPOU_DATA_DIR` in bounded batches;
- `settle_ai_rewards` remains available for one limited batch only;
- the token now has transparent coin artwork and token-list metadata via `logoURI`:
  https://raw.githubusercontent.com/0xddneto/AI-Proof-of-Us/main/assets/token/aipou.png
  https://raw.githubusercontent.com/0xddneto/AI-Proof-of-Us/main/tokenlist.json
- `get_aipou_contract` now exposes `logoURI` so agents can display the same token metadata.

The protocol boundary is unchanged: AIPOU receipts are local-first, signed, replay-checked AI-work receipts. They do not prove hidden AI use or trustlessly prove useful work; claims are optional and validator-approved. No price, yield, liquidity, investment value, or guaranteed reward is implied.

For this thread, the integration question is still the same: where should an external `aipou.receiptId` / `workReceiptId` and validation or claim status attach without making this project responsible for validating token rewards?
```

Destination-specific note:

- OpenClaw/ClawHub: emphasize no hidden wallet action, explicit settlement, token image metadata for UI.
- MCP: emphasize `logoURI` is only contract metadata returned by the server; key question remains lifecycle/session/tool `_meta` placement.
- mcp-agent: emphasize `settle_all_ai_rewards` does not require the framework to understand Merkle/Base; lifecycle hook still only needs receipt metadata.
- a2a-x402/UCP/NanoClaw: emphasize `workReceiptId` remains separate from payment/session receipt.
- ElizaOS/Foundry: emphasize `issuer_asserted` boundary; onchain claim/root can be referenced separately.

## 2026-07-03 - Public follow-ups posted after token artwork and claim-all update

Update posted:

- `settle_all_ai_rewards` now supports explicit one-command settlement across all currently eligible pending receipts in the shared AIPOU data directory.
- `settle_ai_rewards` remains available for one limited batch.
- Official transparent token artwork and token-list metadata are published.
- `get_aipou_contract` exposes `logoURI`.
- The protocol boundary was repeated: no hidden AI-use detection, no trustless useful-work claim, no price/yield/liquidity/investment promise, optional validator-approved claims only.

Posted successfully:

- OpenClaw / ClawHub: https://github.com/openclaw/clawhub/issues/2946
- Model Context Protocol: https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2996
- mcp-agent: https://github.com/lastmile-ai/mcp-agent/discussions/715
- a2a-x402: https://github.com/google-agentic-commerce/a2a-x402/discussions/143
- ElizaOS agent certification: https://github.com/orgs/elizaOS/discussions/9810
- Universal Commerce Protocol: https://github.com/Universal-Commerce-Protocol/ucp/discussions/56
- Foundry / AgentReceipt discussion: https://github.com/promptise-com/Foundry/discussions/39
- NanoClaw: https://github.com/nicanatoly/nanoclaw/discussions/12
- Awesome MCP Servers: https://github.com/punkpeye/awesome-mcp-servers/issues/9036
- OpenLLMetry: https://github.com/traceloop/openllmetry/issues/4340

Immediate response status:

- Follow-ups were posted through the authenticated GitHub browser session.
- No new external adoption is confirmed from this posting alone.
- Next check should look for replies, stars, test receipts, integration issues, or maintainers asking for a concrete adapter.

## 2026-07-05 - npm 0.2.1 Published and Door-to-Door Batch Prepared

- Published `aipou-mcp-server@0.2.1` to npm.
- Confirmed npm `latest` now resolves to `0.2.1`.
- The package includes the new `get_aipou_status` tool so users can ask "Show my AIPOU status" before claiming pending receipts.
- Prepared a new door-to-door outreach batch in [door-to-door-batch-2026-07-05.md](door-to-door-batch-2026-07-05.md).
- Posting blocker in the current Codex session:
  - `gh auth status` reports no authenticated GitHub host.
  - No `GH_TOKEN` or `GITHUB_TOKEN` is available in the shell.
  - The in-app browser webview did not attach during the first GitHub session check.
- Decision: do not claim any new external outreach posts were published until GitHub/browser authentication is available.

### Published after Chrome session was available

- mcp-agent discussion: https://github.com/lastmile-ai/mcp-agent/discussions/716
  - Title: "Where should an external AI-work receiptId attach in mcp-agent runs?"
  - Framing: small MCP lifecycle adapter, `receiptId` as `workReceiptId`, human status loop with `get_aipou_status`, no price/yield claim.
  - Ask: where should `workReceiptId` live in mcp-agent: lifecycle hook, run metadata, workflow state, trace attribute, or external audit artifact?
- agent-services-mcp issue: https://github.com/Gareth1953/agent-services-mcp/issues/1
  - Title: "Interop question: linking provenance receipts with human/agent workReceiptId"
  - Framing: AIPOU as human/agent work receipt beside lower-level provenance receipts, not a replacement.
  - Ask: whether provenance receipts can reference an AIPOU `workReceiptId`, whether AIPOU receipts can reference their provenance receipt, and what field shape is best for MCP tool outputs.
- CoSAI MCP verification receipts issue: https://github.com/cosai-oasis/ws4-secure-design-agentic-systems/issues/110
  - Commented on an existing implementation note about signed context-bound verification receipts for MCP output pipelines.
  - Framing: AIPOU as a neighboring human/agent work-receipt layer, not a scanner and not a replacement for SVR/sigma-guard.
  - Ask: consider a minimal cross-reference shape such as `external_receipts: [{ type, id, issuer, evidence_boundary, verification_status, uri }]`.
- Agent Receipts / Obsigna organization discussion: https://github.com/orgs/agent-receipts/discussions/966
  - Title: "Could workReceiptId reference Agent Receipts without merging trust models?"
  - Framing: AIPOU starts at the human/agent work-unit boundary and should not replace Agent Receipts or Obsigna.
  - Ask: whether Agent Receipts can reference an AIPOU `workReceiptId`, whether AIPOU can reference Agent Receipts as lower-level evidence, and whether references should carry explicit trust-boundary labels such as `issuer_asserted`, `chain_derivable`, `tool_call`, `workflow`, or `human_agent_work`.

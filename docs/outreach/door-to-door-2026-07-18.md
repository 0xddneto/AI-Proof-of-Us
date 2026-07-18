# Door-To-Door Outreach - July 18, 2026

This log records the July 18 outreach round after the Forge trust score,
MCP Registry listing, BaseScan verification, AutoGen PR review, and
ElizaOS/Kuberna conformance fixture were already public.

## Guardrails

- No price, yield, liquidity, investment value, or guaranteed reward was
  promised.
- AIPOU was presented as MCP-first receipt infrastructure for humans working
  with AI agents.
- Human rewards were described as optional and validator-approved.
- Payment receipts, work receipts, authority facts, traces, and token claims
  were kept separate.
- Comments were posted only where the thread topic was directly about agent
  receipts, MCP identity/delegation, provenance, trust, or AI-agent security.

## Posted

### ArmorerLabs / Armorer

- Thread: https://github.com/ArmorerLabs/Armorer/discussions/43
- Reply: https://github.com/ArmorerLabs/Armorer/discussions/43#discussioncomment-17680814
- Topic: "Agent Receipt Spec: what should every agent run record?"
- Message: positioned AIPOU as a work-receipt layer around a human/agent work
  unit, with wallet authorization, nonce, local hashes, Ed25519 collector
  signature, replay checks, and optional validator-approved claim. Asked whether
  stable external links such as `workReceiptId`, `authorityFactId`,
  `traceId/spanId`, and `policyDecisionId` should be part of the receipt spec.
- Status: new outreach; no response yet.

### Model Context Protocol

- Thread: https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2404
- Reply: https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2404#discussioncomment-17680815
- Topic: agent identity and delegation for MCP tool calls.
- Message: framed AIPOU as complementary to agent identity/delegation, not a
  replacement. Explained the pre-action authority fact, post-work receipt, and
  optional claim/reward settlement as separate layers. Asked whether a
  work-receipt reference belongs in tool-call metadata, result `_meta`, trace
  attributes, or a separate audit artifact.
- Status: new outreach; no response yet.

### A2A

- Thread: https://github.com/a2aproject/A2A/discussions/741
- Reply: https://github.com/a2aproject/A2A/discussions/741#discussioncomment-17680825
- Topic: Agent Registry proposal.
- Message: positioned AIPOU as an external task/run receipt that could link to
  Agent Card or registry evidence without becoming standing identity. Asked
  whether A2A would prefer external work receipts as Agent Card extensions, task
  metadata, artifact metadata, or separate audit artifacts linked by URI/digest.
- Status: new outreach; no response yet.

### GitHub Community

- Thread: https://github.com/orgs/community/discussions/193727
- Reply: https://github.com/orgs/community/discussions/193727#discussioncomment-17680826
- Topic: security headaches introduced by AI in projects.
- Message: described attribution after AI-agent actions as the core headache
  and introduced AIPOU as one possible open-source signed receipt pattern using
  nonce/replay checks, hashes instead of raw prompts/outputs, and a collector
  signature. Asked whether others solve the problem with signed receipts, OTel
  span links, policy decision logs, or another mechanism.
- Status: broader community outreach; no response yet.

## Attempted But Not Posted

### Vercel AI / x402

- Thread: https://github.com/vercel/ai/issues/13905
- Topic: x402 payments with human approval and spend caps.
- Result: relevant draft prepared, but the browser session did not expose a
  normal issue comment button. No comment was posted.
- Draft theme: AIPOU as a post-work receipt layer beside x402 payment receipts,
  not a replacement for payment settlement.

### Obsigna / Agent Receipts

- Thread: https://github.com/agent-receipts/obsigna/issues/762
- Topic: exporting receipt chains as OTLP traces.
- Result: relevant draft prepared, but no visible comment textarea was available
  in the browser session. No comment was posted.
- Draft theme: whether external work receipts should appear as OTLP span
  attributes, span links, events, or separate artifacts.

### A2A Agent Card Identity Issue

- Thread: https://github.com/a2aproject/A2A/issues/2043
- Topic: DANE-anchored identity for Agent Cards.
- Result: relevant draft prepared, but the browser session did not expose a
  normal issue comment button. No comment was posted.
- Draft theme: post-work receipts should not be mixed into standing identity
  fields unless clearly typed as external evidence.

## New Target Notes

- CrewAI discussion result from search returned a GitHub 404 in the browser
  session, so no post was attempted.
- Agent Receipts / Obsigna is highly relevant, but current open issues are
  narrow implementation tickets. A future contribution should be a concrete
  interop fixture, not a generic comment.
- Vercel AI / x402 remains a good target once issue commenting is available.
- Issue pages may require account/2FA state that the current browser session
  did not satisfy; GitHub Discussions remained postable.

## Expanded Round

The user asked to continue beyond the first four posts, so I widened the search
to MCP security, permission, provenance, observability, CycloneDX, LiteLLM, and
x402 discussions. Each comment was tailored to the thread and kept the same
guardrails: no price/yield promise, no claim of adoption, and a clear separation
between work receipts, payment receipts, permission decisions, and optional
validator-approved AIPOU claims.

### MCP / Pre-Action Tool Checks

- Thread: https://github.com/orgs/modelcontextprotocol/discussions/791
- Reply: https://github.com/orgs/modelcontextprotocol/discussions/791#discussioncomment-17680893
- Topic: whether AI agent tool calls should be checked before execution.
- Message: mapped AIPOU to a four-artifact model: pre-action
  decision/authority, tool execution result, post-work receipt, and optional
  settlement/claim. Asked whether decision records should live in result
  `_meta`, trace/span metadata, or separate signed audit artifacts.
- Status: new outreach; no response yet.

### MCP / Permission Specification

- Thread: https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2498
- Reply: https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2498#discussioncomment-17680895
- Topic: standard permission rules for MCP tool calls.
- Message: positioned AIPOU beside permission systems, with permission rules and
  authority facts before the tool call, work receipts after the task, and
  claim/payment evidence kept separate. Proposed stable external reference
  fields such as `decisionId`, `workReceiptId`, policy digest, trace/span ids,
  and validation status.
- Status: new outreach; no response yet.

### Langfuse

- Thread: https://github.com/orgs/langfuse/discussions/14787
- Reply: https://github.com/orgs/langfuse/discussions/14787#discussioncomment-17680898
- Topic: whether claim-level provenance belongs in tracing or runtime layers.
- Message: described AIPOU's split between tracing, runtime/provenance, receipt,
  and optional claim/reward layers. Suggested that traces should carry compact
  references such as `workReceiptId`, `validation_status`, `evidence_boundary`,
  and digest/URI rather than whole receipts.
- Status: new outreach; no response yet.

### CycloneDX

- Thread: https://github.com/CycloneDX/specification/discussions/909
- Reply: https://github.com/CycloneDX/specification/discussions/909#discussioncomment-17680901
- Topic: AI-agent provenance in CycloneDX workflow properties.
- Message: suggested keeping AI work receipts outside the core BOM while
  allowing digest-bound external evidence references for actor/agent identity,
  policy/authority facts, work receipt references, and evidence boundaries.
- Status: new outreach; no response yet.

### MCP / SMCP RFC

- Thread: https://github.com/orgs/modelcontextprotocol/discussions/689
- Reply: https://github.com/orgs/modelcontextprotocol/discussions/689#discussioncomment-17680903
- Topic: Secure Model Context Protocol.
- Message: framed AIPOU as a complementary post-work receipt layer beside the
  secure envelope/gateway layer. Explicitly stated that AIPOU does not detect
  hidden AI use or trustlessly prove useful work today, and asked for stable
  fields to attach external `workReceiptId`, validation status, and evidence
  boundary.
- Status: new outreach; no response yet.

### MCP / PIC Standard

- Thread: https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2478
- Reply: https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2478#discussioncomment-17680907
- Topic: fail-closed security guard for MCP tool servers.
- Message: agreed with fail-closed execution and separated PIC/guard
  pre-action contracts from AIPOU post-work receipts and optional reward claims.
  Asked whether PIC would prefer `workReceiptId` inside the proposal, tool
  result `_meta`, or a separate digest-linked audit artifact.
- Status: new outreach; no response yet.

### LiteLLM

- Thread: https://github.com/BerriAI/litellm/discussions/9891
- Reply: https://github.com/BerriAI/litellm/discussions/9891#discussioncomment-17680911
- Topic: LiteLLM MCP roadmap.
- Message: suggested compact receipt metadata for MCP analytics: server/tool
  identity, normalized args digest, provider/model/client metadata, pre-action
  decision id or policy digest, post-work `workReceiptId`, validation status,
  and trace/span ids.
- Status: new outreach; no response yet.

### browser-use / x402

- Thread: https://github.com/browser-use/browser-use/discussions/4302
- Reply: https://github.com/browser-use/browser-use/discussions/4302#discussioncomment-17680919
- Topic: x402-powered web scraping API for AI agents.
- Message: linked x402 payment receipts to AIPOU work receipts while keeping
  them separate. Repeated that self-payments, tests, and wallet-to-wallet
  transfers should not be counted as adoption or revenue by themselves.
- Status: new outreach; no response yet.

## Additional Targets Skipped

- https://github.com/orgs/community/discussions/194494 was relevant to workflow
  dependency receipts, but it was already closed/resolved and only loosely about
  AI-agent work receipts.
- https://github.com/orgs/community/discussions/194493 was relevant to
  agentic-workflow cache security, but also closed/resolved and too far from
  AIPOU's current interop surface.
- https://github.com/orgs/modelcontextprotocol/discussions/784 was relevant to
  x402-style agent payments, but the thread was a one-participant show-and-tell;
  I prioritized broader protocol and framework discussions first.
- https://github.com/microsoft/autogen/discussions/7526 was relevant to agent
  identity and trading transparency, but AutoGen already has an active AIPOU
  discussion with stronger technical feedback, so I avoided opening a second
  broad AutoGen thread in the same round.

## Wider Outreach Continuation

The user asked to continue without artificially limiting the search. I expanded
the target set again across agent frameworks, computer-use agents,
OpenTelemetry/observability, OAuth delegation, AP2/x402 payments, and developer
workflow discussions. The same guardrails were kept: no duplicate comments, no
price/yield/investment promise, no adoption claim, and no request for private
keys, wallet secrets, or private receipts.

### GitHub Community / MCP Workflows

- Thread: https://github.com/orgs/community/discussions/174921
- Reply: https://github.com/orgs/community/discussions/174921#discussioncomment-17681004
- Topic: MCP developer workflows.
- Message: introduced AIPOU as a work-session receipt layer beside MCP tool
  calls, A2A delegation, authority facts, and optional payment/claim evidence.
  Asked where `workReceiptId` should attach in MCP/A2A/GitHub workflow/OTel
  surfaces.
- Status: new outreach; no response yet.

### Agent-S

- Thread: https://github.com/simular-ai/Agent-S/discussions/198
- Reply: https://github.com/simular-ai/Agent-S/discussions/198#discussioncomment-17681011
- Topic: pre-action authority receipts for computer-use agents.
- Message: separated pre-action authority receipts, execution results,
  post-work receipts, and optional AIPOU claim/reward. Suggested the insertion
  point should be before consequential browser side effects such as submit,
  send, export, purchase, account mutation, or workflow close.
- Status: new outreach; no response yet.

### Google ADK

- Thread: https://github.com/google/adk-python/discussions/5090
- Reply: https://github.com/google/adk-python/discussions/5090#discussioncomment-17681013
- Topic: execution provenance exporter for compliance-grade audit trails.
- Message: mapped ADK/OTel spans, framework decision records, external signed
  work receipts, and optional AIPOU claims to separate layers. Suggested compact
  fields such as `workReceiptId`, digest/URI, evidence boundary, validation
  status, and trace/span linkage.
- Status: new outreach; no response yet.

### Anthropic SDK

- Thread: https://github.com/anthropics/anthropic-sdk-python/discussions/1341
- Reply: https://github.com/anthropics/anthropic-sdk-python/discussions/1341#discussioncomment-17681016
- Topic: AI agent error recovery patterns.
- Message: proposed durable task receipts as an audit complement to retries,
  checkpoints, and circuit breakers. Highlighted fail-closed receipt mutation
  rules when retries change normalized args, policy version, provider/model, or
  task boundary.
- Status: new outreach; no response yet.

### Semantic Kernel

- Thread: https://github.com/microsoft/semantic-kernel/discussions/13720
- Reply: https://github.com/microsoft/semantic-kernel/discussions/13720#discussioncomment-17681017
- Topic: HDP cryptographic chain-of-custody for agent delegation.
- Message: framed HDP as delegation/authority chain, Semantic Kernel filters as
  enforcement points, AIPOU as post-work receipt, and optional AIPOU
  claims/rewards as downstream validator-approved artifacts.
- Status: new outreach; no response yet.

### A2A / x402 + AP2

- Thread: https://github.com/a2aproject/A2A/discussions/1341
- Reply: https://github.com/a2aproject/A2A/discussions/1341#discussioncomment-17681020
- Topic: coordinating x402 and AP2 in A2A through a context-based payment state
  machine.
- Message: separated A2A context, payment state, pre-action authority facts,
  work receipts, and optional AIPOU claims. Asked whether `workReceiptId` should
  live on task metadata, message/artifact metadata, or separate digest-linked
  evidence.
- Status: new outreach; no response yet.

### Spring AI

- Thread: https://github.com/spring-projects/spring-ai/discussions/5965
- Reply: https://github.com/spring-projects/spring-ai/discussions/5965#discussioncomment-17681024
- Topic: Spring AI agents capability roadmap.
- Message: suggested a small lifecycle/audit adapter surface rather than a full
  blockchain or reward integration in the framework. Listed task/run,
  provider/model/client, tool-call digest, pre-action decision, `workReceiptId`,
  validation status, and trace/span ids as enough for interop.
- Status: new outreach; no response yet.

### MCP / OpenTelemetry Trace Support

- Thread: https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/269
- Reply: https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/269#discussioncomment-17681037
- Topic: OpenTelemetry trace support for MCP.
- Message: positioned AIPOU beside MCP OTel tracing. Suggested spans carry
  compact references such as `workReceiptId`, `authorityFactId`, validation
  status, evidence boundary, and digest/URI rather than whole signed receipts.
- Status: new outreach; no response yet.

### MCP / Agent Guard

- Thread: https://github.com/orgs/modelcontextprotocol/discussions/781
- Reply: https://github.com/orgs/modelcontextprotocol/discussions/781#discussioncomment-17681040
- Topic: runtime security proxy for MCP tool calls.
- Message: described Agent Guard as runtime enforcement/inspection and AIPOU as
  post-work receipt. Proposed linking guard decision id, matched policy,
  normalized args digest, tool result metadata, trace/span ids, `workReceiptId`,
  validation status, and evidence boundary.
- Status: new outreach; no response yet.

### Uptrace

- Thread: https://github.com/uptrace/uptrace/discussions/596
- Reply: https://github.com/uptrace/uptrace/discussions/596#discussioncomment-17681044
- Topic: Heimdall OTLP traces for AI agent tool calls.
- Message: mapped Heimdall/OTLP spans, policy decisions, AIPOU work receipts,
  and optional claim/reward layers. Suggested compact span attributes for
  `workReceiptId`, `policyDecisionId`, `validation_status`,
  `evidence_boundary`, and digest/URI.
- Status: new outreach; no response yet.

### Universal Commerce Protocol

- Thread: https://github.com/Universal-Commerce-Protocol/ucp/discussions/240
- Reply: https://github.com/Universal-Commerce-Protocol/ucp/discussions/240#discussioncomment-17681045
- Topic: non-custodial AI agent bridge for AP2/ISO 20022 payments.
- Message: separated AP2 mandate/payment artifacts, non-custodial wallet
  evidence, AIPOU work receipts, and optional AIPOU claims. Suggested
  digest-bound external evidence links between AP2/payment artifacts and
  `workReceiptId`.
- Status: new outreach; no response yet.

### LangChain / open-swe

- Thread: https://github.com/langchain-ai/open-swe/discussions/1106
- Reply: https://github.com/langchain-ai/open-swe/discussions/1106#discussioncomment-17681046
- Topic: AgentPay MCP payments for open-swe agents.
- Message: paired AgentPay/x402 payments with separate AIPOU work receipts.
  Repeated that self-payments, tests, and internal wallet movements should not
  be counted as adoption or revenue by themselves. Proposed compact run
  metadata for `workReceiptId`, payment receipt id, trace/span ids, repo/task
  id, and validation status.
- Status: new outreach; no response yet.

### GitHub Community / Kaeso

- Thread: https://github.com/orgs/community/discussions/188952
- Reply: https://github.com/orgs/community/discussions/188952#discussioncomment-17681047
- Topic: OAuth hub for AI agents.
- Message: proposed separating OAuth identity/delegation, narrowed tokens,
  pre-action authority facts, work receipts, and optional AIPOU claims. Framed
  `workReceiptId` as a way to map cost attribution to a human/agent work
  session without overloading OAuth claims.
- Status: new outreach; no response yet.

### AutoGen / Tool Calling Context

- Thread: https://github.com/microsoft/autogen/discussions/5741
- Reply: https://github.com/microsoft/autogen/discussions/5741#discussioncomment-17681050
- Topic: improved tool-calling context and trace propagation.
- Message: summarized AIPOU's AutoGen lesson: tracing context, security
  context, work context, and optional settlement context should remain
  separate. Mentioned fail-closed behavior and structured errors for agents.
- Status: new outreach; no response yet.

## Wider Continuation Targets Not Posted

- https://github.com/x402-foundation/x402/issues/2067 was highly relevant to
  delegated x402 policy enforcement, but the current browser session did not
  expose a visible comment textarea. No comment was posted.
- https://github.com/slsa-framework/slsa/issues/1606 was closed and SLSA had
  already answered a similar agent-provenance framing; no comment was posted.
- https://github.com/firecrawl/firecrawl/issues/3279 was closed as not planned;
  no comment was posted.
- https://github.com/traceloop/openllmetry/issues/3460 was relevant to agent
  semantic conventions, but it is an issue thread with prior receipt-heavy
  discussion and no clean AIPOU-specific opening in this round. No comment was
  posted.
- https://github.com/stripe/ai/discussions/216 was relevant to MCP action
  limits, but the thread already contained a closely related pre-action receipt
  comment from another project. I avoided a redundant AIPOU reply.

## Current Status

This July 18 round produced twenty-six new public outreach posts total: four in
the first pass, eight in the expanded pass, and fourteen in the wider
continuation. It does not establish new adoption, external receipts, package
installs, claims, or integrations.

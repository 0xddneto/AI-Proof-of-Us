# AIPOU Outreach Action Plan - 2026-07-01

This is the operational queue produced from the outreach sprint. It is designed for careful, destination-specific outreach. Do not mass-post these messages. Pick one target, adapt the wording to the exact thread or contribution rules, then ask for review.

## Primary Rule

Lead with:

```text
MCP receipts for AI agents.
```

Do not lead with:

```text
Earn tokens for using AI.
```

## Priority 1 - MCP Lifecycle Metadata

Target:

- Model Context Protocol discussions around client experience, lifecycle, discovery, and metadata.

Goal:

- Learn where receipt metadata belongs before proposing implementation.

Best question:

```text
Should signed task receipt IDs live in MCP client lifecycle hooks, tool result `_meta`, trace attributes, or a companion MCP server?
```

Draft:

```text
I am experimenting with AIPOU, an MCP-first receipt layer for AI agents. It records begin/end task lifecycle metadata as signed receipts while keeping raw prompts and outputs local. I am not proposing this as a core protocol change yet; I am trying to understand where receipt IDs and validation status should live: client lifecycle hooks, tool result `_meta`, trace attributes, or a companion MCP server. Any guidance from MCP client/server maintainers would be valuable.
```

Success signal:

- A maintainer says where this belongs, or says it does not belong in MCP core.

## Priority 2 - mcp-agent Workflow Hook

Target:

- `lastmile-ai/mcp-agent`

Goal:

- Ask whether AIPOU can be an optional workflow hook or middleware around MCP agent runs.

Draft:

```text
I am testing AIPOU, an MCP-first receipt protocol for AI agents. It wraps begin/end task lifecycle events into signed receipts: EIP-712 wallet authorization, local collector signature, replay checks, and optional Merkle claims on Base. Would this fit as an optional `mcp-agent` workflow hook for audit/provenance experiments? Token rewards are secondary; the core question is portable receipts across MCP clients.
```

Success signal:

- A maintainer points to the right extension point, hook, or design constraint.

## Priority 3 - OpenClaw / ClawHub Security Review

Target:

- OpenClaw / ClawHub maintainers or issue threads about skill security, lockfiles, permission manifests, sandboxing, and provenance.

Goal:

- Get a security review path for the AIPOU skill before wider promotion.

Draft:

```text
I am testing AIPOU as an MCP-first receipt protocol for OpenClaw agents. It creates signed task receipts using hashes and local signatures, then validates replay before any optional claim. Given the current ClawHub security concerns, I would like feedback on packaging it with clear permissions, no hidden network behavior, and explicit user approval for settlement. What would a safe review path look like before any public skill promotion?
```

Success signal:

- Clear requirements for manifest, permissions, warnings, sandboxing, or review.

## Priority 4 - OpenLLMetry / Trace Context

Target:

- OpenLLMetry / Traceloop discussions about MCP instrumentation, A2A trace context, hiding trace content, or model metadata.

Goal:

- Learn whether receipt IDs should be span attributes, linked events, or external references.

Draft:

```text
I am exploring AIPOU, an MCP-first receipt protocol for AI agents. It does not replace traces; it creates signed task lifecycle receipts that can reference hashes, model/client metadata, duration, and validation status without storing raw prompts or outputs. Would a signed receipt ID be better represented as a span attribute, linked event, or external provenance reference in OpenTelemetry-style traces?
```

Success signal:

- Trace maintainers suggest a mapping or reject the idea with a clear reason.

## Priority 5 - Helicone / Session Correlation

Target:

- Helicone issues or discussions around agent sessions, browser/session correlation, and observability metadata.

Goal:

- Ask whether receipt IDs can link external proof to session traces.

Draft:

```text
I am testing AIPOU, an MCP-first receipt layer for AI agents. It creates signed task receipts with hashes and validation status while keeping raw prompts/outputs local. For increasingly agentic workflows, would a `receiptId` field be useful as an external reference attached to Helicone sessions or traces, or would that create noisy metadata?
```

Success signal:

- Feedback on whether receipt IDs belong in custom properties, sessions, or external links.

## Priority 6 - Agent Framework Middleware

Targets:

- CrewAI
- LangChain MCP Adapters / LangGraph
- Microsoft Agent Framework
- AutoGen

Goal:

- Ask whether AIPOU belongs as middleware, lifecycle hook, external observer, or tool wrapper.

Draft:

```text
I am exploring AIPOU as an MCP-first receipt layer for agent frameworks. It would not change agent orchestration; it would wrap task start/end with signed metadata: nonce, wallet authorization, local collector signature, replay checks, and receipt status. Would this belong as MCP adapter middleware, a framework lifecycle hook, an external observer attached to traces/logs, or a tool wrapper?
```

Success signal:

- Maintainer recommends an integration surface or says the framework should not carry this concern.

## Priority 7 - Agent Security Scanner Metadata

Targets:

- Snyk Agent Scan
- Agentic Radar
- AgentShield
- MCP-Scan
- MCP Security Checklist

Goal:

- Ask whether receipt/provenance fields help scanners connect findings to specific tasks.

Draft:

```text
I am exploring AIPOU, an MCP-first receipt protocol for AI agents. It is not a scanner and does not replace policy enforcement. It creates signed task receipts: client authorization, task nonce, local collector signature, replay checks, and validation status. Would a receipt/provenance field help agent-security tools connect findings to specific MCP tasks, or would that create misleading trust metadata?
```

Success signal:

- Security maintainers specify which provenance fields are useful or dangerous.

## Priority 8 - Agentic Payments / x402 / AP2

Targets:

- Coinbase x402
- Coinbase Payments MCP
- Coinbase AgentKit
- Awesome agentic payments lists
- AP2 discussions

Goal:

- Position AIPOU as an audit companion, not a payment rail.

Draft:

```text
I am exploring AIPOU as a receipt layer adjacent to agentic payments. x402/AP2 handle payment negotiation and settlement; AIPOU records signed task lifecycle receipts through MCP: begin task, wallet authorization, completion hash, local collector signature, replay checks, and optional claim. Would signed work receipts be useful as an audit companion for agent payments?
```

Do not say:

```text
AIPOU replaces x402/AP2.
```

Success signal:

- Payment builders clarify whether receipts are useful before, during, or after payment.

## Priority 9 - Local AI / Ollama Workflows

Targets:

- Local AI communities
- Ollama + MCP tutorials
- Privacy-first local-agent projects

Goal:

- Ask whether local users want private signed receipts for agent work.

Draft:

```text
I am testing AIPOU with local Ollama agents through OpenClaw. The idea is simple: an MCP client records task start/end, stores hashes instead of raw prompts, signs a receipt locally, and later lets validated receipts be claimed. Would local-AI users want this as a privacy-preserving audit trail for agent work?
```

Success signal:

- Local users identify a real workflow where receipts help, or reject it as unnecessary.

## Priority 10 - Awesome List PRs

Targets:

- Awesome MCP Servers
- Awesome AI Agents
- Awesome AI Agents Security
- Awesome agentic payments / commerce
- Awesome LLM Apps only if infrastructure tools are accepted

Goal:

- Add AIPOU to relevant curated lists only where it fits.

Submission fit:

| List | Fit | Notes |
| --- | --- | --- |
| Awesome MCP Servers | Strong | Contribution rules ask for one server per line, brief description, relevant category, and existing format. |
| Awesome AI Agents Security | Conditional | AIPOU must be framed as provenance/security metadata, not rewards. The list requires direct relevance to autonomous-agent security and maintained open-source projects. |
| Awesome agentic payments | Weak until more docs exist | The list accepts official sources only. AIPOU should first publish a clear official page about audit receipts for agentic payments. |
| Awesome AI Agents | Conditional | Better fit as infrastructure/provenance, not as an autonomous agent app. |
| Awesome LLM Apps | Weak | Likely too protocol/tooling-focused unless there is a runnable demo app. |

Draft list entry:

```markdown
- [AI Proof of Us](https://github.com/0xddneto/AI-Proof-of-Us) - MCP receipt/provenance server for AI-agent tasks; not an assistant. Records signed task receipts with wallet authorization, local collector signatures, replay checks, explicit evidence boundaries, and optional Base claims.
```

Success signal:

- Maintainer accepts the entry or points to a better category.

Best first PR:

```text
Awesome MCP Servers, under a provenance/audit/monitoring category if one exists; otherwise propose a small "Provenance & Audit" category.
```

## Suggested Order

1. Ask MCP metadata/lifecycle question.
2. Ask OpenClaw/ClawHub security review question.
3. Ask one LLMOps trace-mapping question.
4. Ask one framework middleware question.
5. Submit one carefully scoped awesome-list PR.

Local-agent sanity check:

- safest first target: lifecycle hooks / metadata discussion
- phrase to keep: ask maintainers where `receiptId` should be exposed
- phrase to avoid: implying receipt IDs belong in every log entry
- receipt ecosystem rule: disclose that AIPOU does not detect hidden AI use, prove objective task value, replace scanners/policy gates, or imply provider endorsement

## Stop Conditions

Stop or revise the outreach if:

- a maintainer says the token/reward framing is not welcome
- a community bans crypto/token projects
- a security reviewer identifies a serious issue in the AIPOU claim path
- a message would need to mention price, yield, liquidity, or investment upside

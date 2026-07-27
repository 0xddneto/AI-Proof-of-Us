# Door-To-Door Outreach - July 27, 2026

## Goal

Reach established agent-runtime, observability, and payment ecosystems with a
small interoperability proposal. Each proposal keeps the host protocol
authoritative and treats AIPOU as optional, external post-work evidence.

## Published proposals

### Microsoft Agent Framework

- Thread: [Pre-action authority receipt for delegated agent actions](https://github.com/microsoft/agent-framework/discussions/6078)
- Comment: [AIPOU post-work complement](https://github.com/microsoft/agent-framework/discussions/6078#discussioncomment-17797166)
- Proposal: keep the existing authority receipt before execution, then attach
  an opaque AIPOU `workReceiptId` only after a run or workflow completes.
- Ask: identify the best Agent Framework run-completion or workflow-output
  surface for an optional external work-evidence reference.
- Out of scope: wallet, claim, payment, customer data, and token semantics.

### OpenLLMetry / OpenTelemetry agent semantic-conventions RFC

- Thread: [Semantic Conventions for AI Agent Observability](https://github.com/traceloop/openllmetry/issues/3460)
- Comment: [generic external-evidence proposal](https://github.com/traceloop/openllmetry/issues/3460#issuecomment-5091232719)
- Proposal: consider an optional generic `gen_ai.external_evidence.*` link on
  completed agent, task, or workflow spans. The proposed fields are scheme,
  opaque reference, evidence class, optional content hash, and optional status.
- Boundary: the reference is not an OpenTelemetry verdict, does not prove task
  quality, and must not contain raw prompts, outputs, payment details, wallets,
  or reward data.

### Microsoft Semantic Kernel

- Thread: [Small MCP-first post-work receipt reference for agent runs](https://github.com/microsoft/semantic-kernel/discussions/14200)
- Proposal: a local receipt lifecycle adapter creates an opaque `workReceiptId`
  after a Semantic Kernel agent or process run, then the host may expose it in
  run, process, trace, delivery, or audit metadata.
- Ask: choose the most appropriate extension point among process/run metadata,
  OpenTelemetry activity attributes, and result/audit exports.
- Demonstration: Local Receipt Mode uses synthetic data only and requires no
  wallet, funds, claim, token transfer, raw prompt upload, or network access.

## Researched but not posted

### x402 Foundation

The maintained [x402 contribution guide](https://github.com/x402-foundation/x402/blob/main/CONTRIBUTING.md)
directs general discussion and project showcases to its Slack community. Existing
receipt issues already cover settlement-to-action and delivery receipts. No new
issue was opened to avoid duplicating that work. A future outreach message should
ask whether an AIPOU `workReceiptId` can be an optional external work-evidence
reference alongside an x402 payment receipt, never a replacement for settlement
or delivery verification.

### LangGraph and PydanticAI

Both are strong future targets. LangGraph directs general framework discussion to
the LangChain Forum, while PydanticAI's GitHub issue tracker is for concrete
framework work. No generic issue was opened. A future proposal should be sent
through their preferred community channel or be backed by a runnable adapter.

## Evidence rule

These are new outreach attempts, not integrations, partnerships, product
endorsements, installs, claims, or payment adoption. Record a positive result
only after a project independently runs a fixture, accepts a proposal, merges an
integration, or explicitly confirms use.

# Door-To-Door Outreach - July 28, 2026

## Goal

Open a few more high-fit doors in established agent and runtime projects, using
the same positioning as July 27: AIPOU is optional post-work evidence, not an
approval system, not a payment rail, and not a replacement for the host
framework's own trust model.

## Published proposals

### PydanticAI

- Thread: <https://github.com/pydantic/pydantic-ai/issues/6452>
- Comment: <https://github.com/pydantic/pydantic-ai/issues/6452#issuecomment-5110179673>
- Why this thread: it is already about approval provenance for deferred tools
  and the clean boundary between resume authorization and tool execution.
- Proposal: keep approval provenance inside PydanticAI, then let deployments
  attach an opaque post-work `workReceiptId` only after the approved tool call
  actually completes.
- Ask: identify the best future seam for optional post-work evidence:
  adapter resume path, `before_tool_execute` / `after_tool_execute`, or a
  narrower deferred-tools outcome hook.

### LlamaIndex

- Thread: <https://github.com/run-llama/llama_index/issues/21317>
- Comment: <https://github.com/run-llama/llama_index/issues/21317#issuecomment-5110179770>
- Why this thread: it is already converging on a small, independently checkable
  tool execution event rather than a framework-owned receipt stack.
- Proposal: preserve a compact event surface with run/step identity, tool name,
  digests, timestamp, schema version, and ideally `tool_call_id`, then let an
  external verifier or receipt adapter build signed post-work evidence later.
- Boundary: no request for LlamaIndex to own keys, wallets, retention policy,
  settlement, or reward logic.

### Mastra

- Thread: <https://github.com/mastra-ai/mastra/pull/19645>
- Comment: <https://github.com/mastra-ai/mastra/pull/19645#issuecomment-5110179879>
- Why this thread: it fixes the exact run-targeting boundary needed to keep
  resume authority inside the framework while allowing later audit references.
- Proposal: use the outer `runId` as the workflow anchor, keep `delegatedRunId`
  as the internal execution anchor, and emit an opaque `workReceiptId` only
  after the delegated tool finishes.
- Boundary: the receipt must never participate in approval, resume, or
  authorization decisions; it is additive post-execution evidence only.

### CrewAI

- Thread: <https://github.com/crewAIInc/crewAI/pull/6030>
- Comment: <https://github.com/crewAIInc/crewAI/pull/6030#issuecomment-5110179993>
- Why this thread: the `GovernanceDecision` / `GovernanceOutcome` split already
  matches the separation AIPOU needs between authorization and later evidence.
- Proposal: keep CrewAI authoritative for decision and outcome, and allow a
  generic external reference slot on the outcome side for an optional opaque
  post-work `workReceiptId`.
- Boundary: do not force CrewAI to understand AIPOU, token logic, wallet data,
  or any particular external receipt scheme.

## Practical result

These four threads are all good-faith interoperability proposals, not signs of
adoption. No project has committed to integrate AIPOU yet. The immediate win is
that each comment was posted into an existing technical conversation where the
host project is already discussing approval provenance, audit callbacks, run
identity, or vendor-neutral evidence boundaries.

## Follow-up rule

Only follow up if a maintainer or contributor replies with a concrete question,
requests a fixture, or points to a preferred integration seam. Do not turn
these threads into repeated product promotion.

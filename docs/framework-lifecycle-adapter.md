# Framework Lifecycle Adapter

AIPOU should be easy for agent frameworks to test without adopting token logic, Base contracts, or validator operations.

The smallest useful integration is a lifecycle adapter around meaningful AI tasks:

```text
task start -> begin_ai_task -> framework work -> complete_ai_task -> receiptId
```

The framework only needs to know that a task started, a task ended, and a receipt reference exists. It does not need to validate rewards.

When the receipt represents a meaningful human/agent work unit, expose the returned AIPOU `receiptId` as `workReceiptId` in external metadata. The native AIPOU value does not change; `workReceiptId` is the integration-friendly name.

## Host-Derived Evidence First

The host framework should derive its own completion or audit evidence from
graph state, captured tool output, exit codes, checkpoints, or stored artifact
digests. Do not let the same LLM that makes the claim write the host's
authoritative evidence keys.

Use this order:

```text
host derives completion evidence -> optional external AIPOU workReceiptId attaches afterward
```

That keeps the host's native completion truth native, while AIPOU remains a
sibling post-work artifact for correlation, audit, rewards, or later optional
settlement.

## Minimal Integration Surface

At task start, the adapter calls `begin_ai_task` with:

- `provider`
- `model`
- `client`
- `taskHash`

At task completion, the adapter calls `complete_ai_task` with:

- the nonce returned by `begin_ai_task`
- `outputHash`
- input and output token counts when available
- task duration
- optional provider signature evidence when a provider actually signs usage

The adapter can then expose:

```json
{
  "type": "aipou.receipt",
  "workReceiptId": "0x...",
  "receiptId": "0x...",
  "evidenceClass": "issuer_asserted",
  "validationStatus": "local",
  "provider": "openai",
  "model": "gpt-5",
  "client": "framework-name",
  "taskHash": "0x...",
  "outputHash": "0x..."
}
```

If the host already tracks provider usage or billing telemetry, keep both the
raw provider numbers and any normalized totals. They answer different
questions. A routing or observability layer should preserve at least:

- provider
- model
- request type
- prompt and output tokens
- cached-token behavior when available
- latency
- retry count
- final billing bucket or normalized cost class

That makes future spend debugging, route selection, and reconciliation easier
without asking AIPOU to become a billing engine.

The object above is external receipt metadata. It must not replace the host's
own completion record. If the framework already records structured evidence,
keep that evidence authoritative and attach `workReceiptId` beside it.

## Where To Attach `receiptId`

Useful attachment points depend on the boundary being verified:

| Boundary | Attachment point | Suggested field |
| --- | --- | --- |
| Full agent run or human work unit | framework run metadata | `workReceiptId` |
| Lifecycle callback result | lifecycle hook output | `workReceiptId` |
| Observability correlation | trace or span attributes | `aipou.work_receipt_id` |
| Local task history | local UI metadata | `workReceiptId` |
| Portable evidence | audit export | `workReceiptId` |
| Payment or session record | payment/session metadata | `workReceiptId` plus the rail's own payment receipt |
| Specific tool action | tool result metadata | usually a separate tool-call receipt, optionally linked to `workReceiptId` |

Avoid making every tool call or every log line carry AIPOU data. The receipt should represent a meaningful task boundary, not noise.

The MCP package includes `buildReceiptSpanAttributes` as the reference
projection for OpenTelemetry-compatible integrations. It emits only the
receipt ID, scheme, and evidence class. A tracing system may copy these
correlation values, but it must not carry `validated`, `claimed`, or another
verification verdict as a span attribute. Those outcomes belong to a separate
verification record, not telemetry that a dashboard could mistake for truth.

For MCP tool results, the signed receipt remains authoritative in the local
receipt store. `complete_ai_task` also returns a compact projection under the
reverse-DNS `_meta` key `io.github.0xddneto/aipou-receipt` with the receipt ID,
opaque URI, issuer fingerprint, digest, evidence class, scheme, and current
local status. Clients may collect that projection into their own run metadata,
but `_meta` is transport metadata and must not be treated as the only retained
copy of the receipt.

Keep an MCP `taskId` distinct from `receiptId`. A task ID tracks execution and
result retrieval; a receipt ID tracks evidence with a different retention and
verification lifecycle. Traces should copy only correlation fields, while
claim or settlement status must be read from the authoritative AIPOU store or
the relevant onchain state.

If a project already has a tool-call receipt or BoundaryAttest-style event receipt, AIPOU should reference it or be referenced by it. AIPOU does not need to replace that lower-level receipt.

For delegated frameworks with pre-action authorization, keep two artifacts linked by `aipou-authority-work-link-v1`: `authorityReceiptId` or `actionRef` before execution, then `workReceiptId` after completion, joined by a stable trace reference. The lifecycle example includes a fail-closed validator for this link. Claim and reward fields are never authority evidence.

The optional conformance profile makes the fact chain explicit: a `chain_derivable + delegation-scope-v1` authority artifact exposes `authority.factId`, while the `issuer_asserted + aipou-receipt-v1` work artifact exposes the same value as `work.preActionFactId`. `validateAuthorityWorkConformanceLink` rejects trust-model downgrades, unsupported authority schemes, AIPOU collector fields mislabeled as chain-derived authority, work-subject mismatches, and links to a different authority fact. This is intended for fixture exchange with governance or ERC-8004-style adapters; it does not make the AIPOU task payload chain-derived.

### Root Authority and Delegation

An agent ID is not necessarily the origin of authority. For delegated actions,
the integration should preserve four distinct roles:

```text
issuer / principal -> bounded capability -> holder / delegate -> effect -> work receipt
```

The issuer or principal is the independent authority source: for example, a
human operator, enterprise IAM system, wallet, smart contract, or personal
runtime. The holder or delegate is the agent or runtime allowed to exercise a
bounded capability. A replacement model, MCP server, or agent runtime must not
silently inherit a broader capability simply because it shares an `agentId`.

Where a host supports it, the pre-action authority artifact should bind the
issuer, holder, normalized call, target resource, policy or capability digest,
expiry, nonce, and any parent delegation reference. Delegation may narrow a
capability but must not expand it. The enforcement point must consume or
revalidate that exact binding at dispatch through the credential-owning path;
otherwise the policy layer is advisory rather than an execution boundary.

The later AIPOU `workReceiptId` records the human/agent work unit after the
attempt. It may reference the authority artifact by `preActionFactId` or
`actionRef`, but it does not establish issuer authority, prove that the
capability was consumed, or certify the external effect. Keep any semantic
assessment of whether the requested action matched the principal's intended
purpose in the host's own policy or authorization layer.

For `delegation-scope-v1` fixtures, canonical fact derivation follows the RFC 8785/JCS compatibility boundary: plain JSON values only, ECMAScript number serialization, and UTF-16 property-name ordering. Non-finite numbers, `undefined`, functions, bigint values, and symbol keys fail closed. Cross-language integrations should exchange adversarial Unicode and numeric vectors rather than relying on each SDK's self-generated signatures.

Receipts are evidence, not enforcement. A framework can produce correct receipts while still allowing an agent to bypass the authorized path. When a deployment claims that pre-action authority is mandatory, test the actual control point separately with `aipou-enforcement-check-v1`. The executable example requires an observed denied attempt without the authority receipt and an observed allowed attempt with the matching receipt, both bound to SHA-256 evidence digests.

An enforcement check remains `issuer_asserted` unless an identified external verifier signs or attests to its evidence. Its reliance boundary is the specific orchestrator, sandbox, protected branch, or policy gate tested at that time. It does not prove that every alternate bypass is impossible, and it does not upgrade the trust tier of the work receipt or any reward claim.

The reference adapter exposes `runEnforcementBenchmark` so a framework can execute both attempts instead of submitting a pre-filled observation object. Its fixture uses a real local mutation gate and confirms that the unauthorized attempt leaves state unchanged while the authorized attempt mutates state once. This proves the reference gate behavior only; production integrations must supply the callback that reaches their actual enforcement point.

For comparable results, `enforcementPoint.kind` uses `protected_branch`, `sandbox_boundary`, or `orchestrator_policy`. Extensions must use `custom:<name>`, making non-standard boundaries visible instead of silently fragmenting the vocabulary.

The first recommended application binding is the tool execution boundary: check authority before invoking a side-effecting tool, execute only when allowed, and record post-call evidence afterward. A denial should be structured so the agent can request authority or choose another path. The reference `createToolExecutionPolicyGate` returns `AIPOU_AUTHORITY_REQUIRED` with `canRequestAuthority: true` and performs no protected mutation.

For consequential actions, revalidate the matching authority at dispatch as well. An approval can expire, be revoked, or cease to match policy/context while an agent is still reasoning. The reference gate accepts an integration-supplied `revalidateAtDispatch` callback and fails closed before calling the action executor when it returns anything other than `{ allowed: true }`. This is a local enforcement pattern, not a claim that every credential path is controlled.

An allowed dispatch is still not proof that an external effect occurred. Keep `proposed`, `authorized`, `dispatched`, `host_observed`, and `externally_verified` as distinct outcome classes. Only the system that can authoritatively observe the external effect, or an identified independent verifier, can attest to the last class. AIPOU's later work receipt and optional claim remain separate from each of these execution records.

For external systems, attach their own digest-only observation beside the work
receipt rather than storing a host-authored `delivered` or `paid` flag. A
provider receipt ID is not self-describing: depending on the provider it may
mean queued, accepted, deduplicated, delivered, bounced, or rejected. Preserve
the provider event, receipt ID, observation time, and raw-artifact digest;
derive a human-facing state from those attributed events and re-evaluate it on
later reconciliation. See [Evidence Boundaries](./evidence-boundaries.md).

If an integration exposes `dispatched_unverified`, it must also expose an
`attestationDeadline`, a named reconciliation owner, and the next scheduled
check. The reconciliation owner must be a standing component or named
principal that can act after the originating workflow has crashed, completed,
or been abandoned; the workflow itself may request reconciliation but is not a
sufficient sole owner. Bind the deadline and owner at mint time in the signed
pre-action scope or another immutable, authenticated policy envelope. A host
must not silently extend the deadline or replace its owner to avoid timeout.

Each reconciliation attempt records an append-only attributed observation such
as `attested`, `absent`, or `provider_error`, then either schedules a bounded
next check or derives `attestation_timed_out` at the deadline. This separates
"nobody checked" from "checked and no attestation existed." The timeout may
trigger retry or compensation according to the host's policy, but it does not
alter the original dispatch observation, certify the external effect, or
change AIPOU reward eligibility.

For AutoGen specifically, the narrowest typed chokepoint is a `Workbench.call_tool(...)`
wrapper. It sees the invocation right where a workbench is about to execute the
tool and can return a structured denial as a `ToolResult` without intercepting
unrelated runtime messages. The AIPOU repository still keeps the smaller
`DefaultInterventionHandler` fixture because it is easy to reproduce in public,
but the preferred real binding point is the workbench boundary.

Do not mark every denial as recoverable. A permanently forbidden action returns `AIPOU_ACTION_FORBIDDEN` with `canRequestAuthority: false`; the reference agent loop does not request authority, retry, or execute the tool. A temporarily unauthorized action returns `AIPOU_AUTHORITY_REQUIRED`, requests authority once, and retries once with the matching receipt.

A runnable `DefaultInterventionHandler` fixture is available in `examples/autogen-intervention`. It uses the real `autogen-core` class and `FunctionCall` type, but needs no model, API key, Docker, wallet, claim, or funds.

## What Frameworks Do Not Need

A framework integration does not need to:

- publish Merkle roots
- call `claimBatch`
- understand the AIPOU reward formula
- store validator private keys
- validate Base claims
- become an AIPOU reward authority

Claims are optional and belong to a separate validator/settlement flow.

## Data That Should Stay Local

Do not send raw prompts or raw outputs to AIPOU by default. Store hashes and minimal metadata:

- provider and model
- client/framework name
- task hash
- output hash
- token counts when available
- duration
- receipt ID
- validation status

## Trust Boundaries

The current `client_signed` tier proves authorization, local collector signature, and replay checks. It does not independently prove task quality or provider inference.

The collector is not automatically independent of the agent or user that
requested the work. Treat all `client_signed` fields as issuer assertions. A
separate verifier can add an attributed observation only when it has its own
credentials and directly re-checks the relevant system or provider evidence;
a model-authored receipt, a copied digest, or a well-formed local record does
not satisfy that requirement.

The `provider_signed` tier should only be used when configured provider keys sign the canonical usage assertion. An API response ID or a user statement is not enough.

For serious production adoption, AIPOU should publish validator rules, move owner and validator authority to multisig, and make trusted collector admission/removal auditable.

## Good First Question For Maintainers

```text
For your framework, where does a human/agent work receipt belong: workflow metadata, trace attributes, payment/session metadata, tool result metadata, or a separate audit artifact?
```

That question is more useful than asking a framework to adopt the AIPOU token.

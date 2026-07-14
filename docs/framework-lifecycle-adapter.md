# Framework Lifecycle Adapter

AIPOU should be easy for agent frameworks to test without adopting token logic, Base contracts, or validator operations.

The smallest useful integration is a lifecycle adapter around meaningful AI tasks:

```text
task start -> begin_ai_task -> framework work -> complete_ai_task -> receiptId
```

The framework only needs to know that a task started, a task ended, and a receipt reference exists. It does not need to validate rewards.

When the receipt represents a meaningful human/agent work unit, expose the returned AIPOU `receiptId` as `workReceiptId` in external metadata. The native AIPOU value does not change; `workReceiptId` is the integration-friendly name.

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

If a project already has a tool-call receipt or BoundaryAttest-style event receipt, AIPOU should reference it or be referenced by it. AIPOU does not need to replace that lower-level receipt.

For delegated frameworks with pre-action authorization, keep two artifacts linked by `aipou-authority-work-link-v1`: `authorityReceiptId` or `actionRef` before execution, then `workReceiptId` after completion, joined by a stable trace reference. The lifecycle example includes a fail-closed validator for this link. Claim and reward fields are never authority evidence.

The optional conformance profile makes the fact chain explicit: a `chain_derivable + delegation-scope-v1` authority artifact exposes `authority.factId`, while the `issuer_asserted + aipou-receipt-v1` work artifact exposes the same value as `work.preActionFactId`. `validateAuthorityWorkConformanceLink` rejects trust-model downgrades, unsupported authority schemes, work-subject mismatches, and links to a different authority fact. This is intended for fixture exchange with governance or ERC-8004-style adapters; it does not make the AIPOU task payload chain-derived.

Receipts are evidence, not enforcement. A framework can produce correct receipts while still allowing an agent to bypass the authorized path. When a deployment claims that pre-action authority is mandatory, test the actual control point separately with `aipou-enforcement-check-v1`. The executable example requires an observed denied attempt without the authority receipt and an observed allowed attempt with the matching receipt, both bound to SHA-256 evidence digests.

An enforcement check remains `issuer_asserted` unless an identified external verifier signs or attests to its evidence. Its reliance boundary is the specific orchestrator, sandbox, protected branch, or policy gate tested at that time. It does not prove that every alternate bypass is impossible, and it does not upgrade the trust tier of the work receipt or any reward claim.

The reference adapter exposes `runEnforcementBenchmark` so a framework can execute both attempts instead of submitting a pre-filled observation object. Its fixture uses a real local mutation gate and confirms that the unauthorized attempt leaves state unchanged while the authorized attempt mutates state once. This proves the reference gate behavior only; production integrations must supply the callback that reaches their actual enforcement point.

For comparable results, `enforcementPoint.kind` uses `protected_branch`, `sandbox_boundary`, or `orchestrator_policy`. Extensions must use `custom:<name>`, making non-standard boundaries visible instead of silently fragmenting the vocabulary.

The first recommended application binding is the tool execution boundary: check authority before invoking a side-effecting tool, execute only when allowed, and record post-call evidence afterward. A denial should be structured so the agent can request authority or choose another path. The reference `createToolExecutionPolicyGate` returns `AIPOU_AUTHORITY_REQUIRED` with `canRequestAuthority: true` and performs no protected mutation. AutoGen Core exposes a compatible interception pattern through its intervention handler around tool execution; the AIPOU fixture does not claim that a production AutoGen adapter has been installed.

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

The `provider_signed` tier should only be used when configured provider keys sign the canonical usage assertion. An API response ID or a user statement is not enough.

For serious production adoption, AIPOU should publish validator rules, move owner and validator authority to multisig, and make trusted collector admission/removal auditable.

## Good First Question For Maintainers

```text
For your framework, where does a human/agent work receipt belong: workflow metadata, trace attributes, payment/session metadata, tool result metadata, or a separate audit artifact?
```

That question is more useful than asking a framework to adopt the AIPOU token.

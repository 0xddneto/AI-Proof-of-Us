# Framework Lifecycle Adapter

AIPOU should be easy for agent frameworks to test without adopting token logic, Base contracts, or validator operations.

The smallest useful integration is a lifecycle adapter around meaningful AI tasks:

```text
task start -> begin_ai_task -> framework work -> complete_ai_task -> receiptId
```

The framework only needs to know that a task started, a task ended, and a receipt reference exists. It does not need to validate rewards.

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
  "receiptId": "0x...",
  "validationStatus": "local",
  "provider": "openai",
  "model": "gpt-5",
  "client": "framework-name",
  "taskHash": "0x...",
  "outputHash": "0x..."
}
```

## Where To Attach `receiptId`

Useful attachment points:

- framework run metadata
- lifecycle hook result
- trace or span attributes
- local UI task history
- audit export
- payment/session metadata as an external evidence reference

Avoid making every tool call or every log line carry AIPOU data. The receipt should represent a meaningful task boundary, not noise.

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
Would a signed AI-task receipt fit better as framework lifecycle metadata, trace/span attributes, tool result metadata, or an external audit reference?
```

That question is more useful than asking a framework to adopt the AIPOU token.

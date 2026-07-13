# Lifecycle Adapter Example

This is the smallest useful adoption path for AIPOU:

```text
task start -> begin_ai_task -> framework work -> complete_ai_task -> receiptId
```

The framework does not need to understand Base, Merkle proofs, token claims, or validator rules. It only needs a place to attach the returned AIPOU `receiptId`. For external metadata, expose the same value as `workReceiptId` when it represents a human/agent work unit.

## Run From This Repository

```bash
npm install
npm run build -w mcp-server
cd examples/lifecycle-adapter
npm install
npm run demo
```

By default the demo creates an ephemeral local wallet and temporary receipt directory. The temporary directory is removed after the demo. It does not claim rewards, spend funds, upload raw prompts, or use a primary wallet.

## Run With The Published Package

```bash
cd examples/lifecycle-adapter
npm install
AIPOU_DEMO_USE_NPX=1 npm run demo
```

The demo launches:

```bash
npx -y aipou-mcp-server
```

## Output Shape

The important part is the framework metadata:

```json
{
  "frameworkMetadata": {
    "runId": "demo-...",
    "aipou": {
      "type": "aipou.receipt",
      "workReceiptId": "0x...",
      "receiptId": "0x...",
      "evidenceClass": "issuer_asserted",
      "scheme": "aipou-receipt-v1",
      "factId": "0x...",
      "subject": {
        "kind": "wallet",
        "id": "eip155:8453:0x..."
      },
      "status": "local",
      "registryStatus": "active",
      "relianceBoundary": "local-policy-only",
      "taskHash": "0x...",
      "outputHash": "0x...",
      "trustTier": "client_signed"
    }
  }
}
```

`factId` is deterministic for the receipt scheme, collector fingerprint, and task nonce. Integrators can use it for mechanical duplicate and cross-tier checks without comparing private task fields. Run `npm test` in this directory for fail-closed scheme, duplicate-active-fact, and terminal-revocation fixtures.

LangGraph, mcp-agent, OpenClaw, LLMOps tools, and payment systems can attach that object to run metadata, trace/span attributes, audit exports, or payment/session metadata. If they already emit tool-call or boundary-event receipts, link those receipts to `workReceiptId` instead of replacing them.

## Pre-Action Authority Link

Frameworks that already seal an authorization before execution can link it to the later AIPOU work receipt without merging the two artifacts:

```json
{
  "scheme": "aipou-authority-work-link-v1",
  "relation": "authorized_then_work_recorded",
  "authority": {
    "receiptId": "authority-receipt-id",
    "actionRef": "framework:sealed-action-ref",
    "phase": "pre_action"
  },
  "work": {
    "receiptId": "0x...",
    "factId": "0x...",
    "phase": "post_work"
  },
  "traceLink": "trace:run-id"
}
```

`validateAuthorityWorkLink` rejects phase inversions, self-references, mismatched work facts, and claim/reward fields presented as authority. An AIPOU claim remains an optional post-work settlement event and can never authorize an action.

## Real Farming Wallet

For real rewards, set a new dedicated farming wallet:

```bash
AIPOU_AGENT_PRIVATE_KEY=0x... npm run demo
```

Never use a primary wallet. Optional settlement only happens after an explicit user claim command.

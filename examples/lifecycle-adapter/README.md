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

If the external reference must be integrity-bound, use the scheme-neutral `external-evidence-link-v1` prototype in `external-evidence-link.mjs`. It binds source and target artifact digests, supports an optional Ed25519 signature, fails closed on mutation or raw private content, and includes canonical AIPOU/AIIR, SLSA/OCI, and x402/OpenTelemetry vectors. See [Scheme-Neutral External Evidence Links](../../docs/external-evidence-links.md).

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

For cross-implementation conformance, `validateAuthorityWorkConformanceLink` applies a stricter profile without changing the base link scheme:

- the authority artifact is `chain_derivable + delegation-scope-v1` with its own subject and deterministic `factId`;
- the post-work artifact remains `issuer_asserted + aipou-receipt-v1`;
- the work artifact carries `preActionFactId`, which must equal `authority.factId`;
- a trust-model downgrade, unsupported authority scheme, subject mismatch, or fact-link mismatch fails closed.

This profile lets an external verifier walk from a delegation or policy fact to the later work receipt while each artifact keeps its own schema and verification authority.

## Enforcement Check

A receipt proves that authorization evidence exists. It does not, by itself, prevent an agent from bypassing the authorized path. Frameworks can benchmark that separate control with `aipou-enforcement-check-v1`:

```json
{
  "scheme": "aipou-enforcement-check-v1",
  "evidenceClass": "issuer_asserted",
  "relation": "pre_action_receipt_required",
  "authorityReceiptId": "authority-receipt-id",
  "actionRef": "framework:sealed-action-ref",
  "enforcementPoint": {
    "kind": "protected_branch",
    "id": "github:example/project:refs/heads/main"
  },
  "policyDigest": "sha256:...",
  "observations": {
    "withoutAuthority": {
      "attempted": true,
      "authorityReceiptPresent": false,
      "outcome": "denied",
      "evidenceDigest": "sha256:..."
    },
    "withAuthority": {
      "attempted": true,
      "authorityReceiptPresent": true,
      "authorityReceiptId": "authority-receipt-id",
      "outcome": "allowed",
      "evidenceDigest": "sha256:..."
    }
  },
  "verificationStatus": "local_test",
  "relianceBoundary": "enforcement-point-test-only"
}
```

`validateEnforcementCheck` fails closed if the untrusted path succeeds, if the authorized path is not observed, if evidence digests are malformed, or if the check does not match the authority artifact. This remains a point-in-time test of one orchestrator, sandbox, protected branch, or policy gate. It is not a universal proof that no bypass exists. Only emit it after actually running both attempts.

## Real Farming Wallet

For real rewards, set a new dedicated farming wallet:

```bash
AIPOU_AGENT_PRIVATE_KEY=0x... npm run demo
```

Never use a primary wallet. Optional settlement only happens after an explicit user claim command.

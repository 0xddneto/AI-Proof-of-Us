# Door-to-Door Batch - 2026-07-05

Status: prepared after `aipou-mcp-server@0.2.1` was published to npm.

Posting blocker in this Codex session:

- `gh auth status` reports no authenticated GitHub host.
- No `GH_TOKEN` or `GITHUB_TOKEN` is available in the shell.
- The in-app browser webview did not attach during the first GitHub session check.

Do not mark these as posted until an authenticated GitHub/browser session is available.

## Published First

- npm package: https://www.npmjs.com/package/aipou-mcp-server
- version: `0.2.1`
- key new user-facing tool: `get_aipou_status`

## Batch 1 Targets

### 1. mcp-agent

Target: https://github.com/lastmile-ai/mcp-agent

Suggested destination: GitHub issue or discussion, if maintainers allow architecture/integration questions.

Draft:

```text
I am testing AI Proof of Us (AIPOU) as a small MCP lifecycle adapter for humans working with AI agents.

The integration surface should be tiny: task started, task completed, provider/model metadata, task hash, output hash, and a returned receiptId exposed as workReceiptId. Frameworks would not need to understand Merkle proofs, Base claims, validator keys, or token economics.

The human loop is the point: people spend real hours coding, debugging, researching, and coordinating through agents. AIPOU lets the agent create private signed work receipts, and the human can later ask "Show my AIPOU status" to see recorded, pending, claimed, and onchain AIPOU.

Question for mcp-agent: where would this workReceiptId fit best: lifecycle hook, run metadata, workflow state, trace attribute, or an external audit artifact?

Repo: https://github.com/0xddneto/AI-Proof-of-Us
npm: https://www.npmjs.com/package/aipou-mcp-server
```

### 2. Agent Receipts / Obsigna

Target: https://github.com/agent-receipts

Suggested destination: issue/discussion in the most active repo, only if project accepts interoperability questions.

Draft:

```text
I am working on AI Proof of Us (AIPOU), which is close to your receipt/provenance space but starts at a different boundary.

AIPOU records a human/agent work unit through MCP: EIP-712 wallet authorization, unique nonce, local task/output hashes instead of raw prompts, Ed25519 collector signature, replay checks, and optional Base claims for validator-approved work.

I do not want to present AIPOU as a replacement for lower-level agent receipts. The better question is interoperability:

Could an Agent Receipt / Obsigna-style receipt reference an external AIPOU workReceiptId, or could an AIPOU receipt reference your receipt as lower-level evidence?

Repo: https://github.com/0xddneto/AI-Proof-of-Us
```

### 3. Model Context Protocol discussions

Target: https://github.com/orgs/modelcontextprotocol/discussions

Suggested destination: only an active thread discussing receipts, security, governance, lifecycle hooks, or traceability.

Draft:

```text
I am testing AIPOU as an MCP-first work-receipt layer for people using AI agents all day.

It does not detect hidden AI use and does not prove objective task value. It records authorized work receipts: wallet authorization, nonce, provider/model metadata, hashes instead of raw prompts/outputs, collector signature, replay checks, and optional claim status.

For MCP interoperability, the practical question is small:

Should a client/server ecosystem have a standard place to attach an external workReceiptId and validation status, or should each framework place that in run metadata/traces/audit exports?

Repo: https://github.com/0xddneto/AI-Proof-of-Us
npm: https://www.npmjs.com/package/aipou-mcp-server
```

### 4. Agent payment / marketplace projects

Target examples:

- x402-adjacent agent payment projects
- ACK-Pay-style payment/session threads
- ClawRouter/OpenClaw payment contexts

Draft:

```text
I am not proposing AIPOU as a replacement for x402, stablecoins, AP2, or wallet automation.

AIPOU is a work-receipt layer: an MCP agent records that a human/agent work unit happened under wallet authorization, using local hashes and signed receipts. Approved receipts can claim AIPOU, and participants can voluntarily accept AIPOU as settlement.

Interoperability question:

Should a payment/session record include an optional external workReceiptId, so the payment and the AI-work receipt can reference each other without merging trust models?

Repo: https://github.com/0xddneto/AI-Proof-of-Us
```

### 5. Security/provenance communities

Target examples:

- CoSAI secure agentic systems
- agent-services-mcp
- offline/verifiable receipt projects

Draft:

```text
AIPOU is experimenting with human/agent work receipts, not hidden AI-use detection or scanner replacement.

Current proof boundary:
- issuer_asserted local task receipt
- EIP-712 wallet authorization
- unique nonce
- task/output hashes
- Ed25519 collector signature
- replay rejection
- optional Merkle root and claim transaction on Base

The onchain claim can prove root inclusion and single-use receiptId. It does not make the whole task chain_derivable and does not prove objective task value.

Would this kind of human/agent workReceiptId be useful as a reference beside lower-level security/provenance receipts?

Repo: https://github.com/0xddneto/AI-Proof-of-Us
```

## Suggested Ask For Every Post

End with one concrete request, not all of them:

- "Can your agent generate a real receiptId?"
- "Where should workReceiptId attach?"
- "Can your human/operator try `Show my AIPOU status`?"
- "Would voluntary AIPOU settlement make sense in your marketplace?"
- "If useful, please star the repo so other agent builders can find it."

## Do Not Say

- Do not promise price, yield, liquidity, exchange listings, or guaranteed rewards.
- Do not imply AIPOU detects all AI work.
- Do not imply AIPOU proves objective task value.
- Do not ask anyone to paste private keys into chat.
- Do not claim external adoption until another operator generates a receiptId or maintainer commits to integration.

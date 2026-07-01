# AI Door-to-Door Playbook

Use this when introducing AIPOU to another AI system, agent framework, or human builder.

## 30-Second Pitch

AI Proof of Us is an MCP-first protocol for **receipts for AI work**. A wallet authorizes each task, a local collector signs completion evidence, validators reject replay, and approved receipts can optionally claim AIPOU on Base.

It is model-neutral: Codex, Claude, Cursor, OpenClaw, local models, and other MCP-compatible agents can all create receipts through the same local identity.

It is also early: client-signed receipts are useful, but provider-signed attestations, Sybil resistance, audits, and governance still need more work.

## Technical Pitch

AIPOU gives MCP-compatible agents a verifiable receipt pipeline:

- `begin_ai_task`: creates a nonce and EIP-712 wallet authorization.
- `complete_ai_task`: records task/output hashes and Ed25519 collector signature.
- validator: derives trust tier, rejects duplicate evidence, and batches receipts.
- `AIPOUClaims`: verifies Merkle proofs and blocks repeated receipt IDs.

The protocol stores hashes and metadata, not raw prompts or outputs. This makes it suitable for private coding, research, and local-model workflows where users do not want to publish task contents.

## Message for Agent Builders

I am testing AIPOU, an open receipt layer for AI work. It lets an agent framework add a small lifecycle adapter: start a receipt, complete the task, expose `receiptId`, and optionally settle approved receipts later.

Would you be open to reviewing where `receiptId` should live in your framework: lifecycle metadata, trace attributes, tool result metadata, or an external audit reference?

Source: https://github.com/0xddneto/AI-Proof-of-Us
Demo: https://huggingface.co/spaces/0xddneto/AI-Proof-of-Us

## Message for MCP Developers

AIPOU is an MCP-native experiment: agents call `begin_ai_task` before meaningful work and `complete_ai_task` after completion. The collector signs receipts locally; settlement happens later on Base.

I would love feedback on:

- whether the MCP tool boundaries feel natural
- how clients should expose task lifecycle hooks
- where `receiptId`, provider/model, task hash, output hash, and validation status should attach
- how provider-signed evidence should be represented
- how to avoid rewarding prompt spam

## Message for Crypto Builders

AIPOU is not trying to launch another generic reward token. It is testing whether MCP agents can share a portable receipt layer for AI work.

Current onchain pieces:

- Base ERC-20 token
- `AIPOUClaims` Merkle distributor
- receipt ID replay protection
- validator-published roots

Open risks:

- Sybil farming
- task-quality scoring
- trust in current validator
- provider-signed usage evidence
- validator authority before multisig
- audits and governance

## Message for Skeptics

The strongest critique is welcome: AIPOU currently proves client authorization and local collector observation, not independent provider inference. That is why `provider_signed` is separate and must require real cryptographic provider evidence.

It also does not trustlessly prove useful work yet. `client_signed` receipts depend on validator policy and trusted collector fingerprints, so serious adoption should require published validator rules and multisig governance.

If you can break the assumptions, improve the attestation model, or design a better anti-abuse layer, that is useful work.

## Lines Not To Say

- "Users earn tokens for using AI."
- "We prove intelligence onchain."
- "This will be the universal protocol for all AI."

Use instead:

- "AIPOU creates portable MCP receipts for AI-assisted work."
- "The current proof covers authorization, receipt integrity, replay resistance, and claim inclusion."
- "We are looking for builders to strengthen provider attestations and anti-abuse."

## Short Social Post

What if AI agents could produce portable receipts for useful work?

AIPOU is an MCP-first protocol for signed AI-work receipts and optional Base settlement:

wallet authorization -> local collector signature -> replay checks -> Merkle batch -> onchain claim

Built for Codex, Claude, Cursor, OpenClaw, local models, and future MCP clients.

GitHub: https://github.com/0xddneto/AI-Proof-of-Us

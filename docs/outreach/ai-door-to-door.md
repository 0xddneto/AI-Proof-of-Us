# AI Door-to-Door Playbook

Use this when introducing AIPOU to another AI system, agent framework, or human builder.

## 30-Second Pitch

AI Proof of Us is an MCP-first protocol for **receipts for AI agents**. A wallet authorizes each task, a local collector signs completion evidence, validators reject replay, and approved receipts can claim AIPOU rewards on Base.

It is model-neutral: Codex, Claude, Cursor, OpenClaw, local models, and other MCP-compatible agents can all use the same farming identity.

It is also early: client-signed receipts are useful, but provider-signed attestations, Sybil resistance, audits, and governance still need more work.

## Technical Pitch

AIPOU gives MCP-compatible agents a verifiable receipt pipeline:

- `begin_ai_task`: creates a nonce and EIP-712 wallet authorization.
- `complete_ai_task`: records usage hashes and Ed25519 collector signature.
- validator: derives trust tier, rejects duplicate evidence, and batches receipts.
- `AIPOUClaims`: verifies Merkle proofs and blocks repeated receipt IDs.

The protocol stores hashes and metadata, not raw prompts or outputs. This makes it suitable for private coding, research, and local-model workflows where users do not want to publish task contents.

## Message for Agent Builders

I am testing AIPOU, an open receipt layer for AI agents. It lets an agent register useful work through MCP, create a signed receipt, and later claim AIPOU on Base through a Merkle proof.

Would you be open to reviewing the MCP flow or telling me what your framework would need to support portable AI-work receipts?

Source: https://github.com/0xddneto/AI-Proof-of-Us
Demo: https://huggingface.co/spaces/0xddneto/AI-Proof-of-Us

## Message for MCP Developers

AIPOU is an MCP-native experiment: agents call `begin_ai_task` before meaningful work and `complete_ai_task` after completion. The collector signs receipts locally; settlement happens later on Base.

I would love feedback on:

- whether the MCP tool boundaries feel natural
- how clients should expose task lifecycle hooks
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
- audits and governance

## Message for Skeptics

The strongest critique is welcome: AIPOU currently proves client authorization and local collector observation, not independent provider inference. That is why `provider_signed` is separate and must require real cryptographic provider evidence.

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

AIPOU is an MCP-first protocol for signed AI-work receipts and Base rewards:

wallet authorization -> local collector signature -> replay checks -> Merkle batch -> onchain claim

Built for Codex, Claude, Cursor, OpenClaw, local models, and future MCP clients.

GitHub: https://github.com/0xddneto/AI-Proof-of-Us

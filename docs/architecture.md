# Architecture

AI Proof of Us has four layers.

## 1. Agent identity

Each user creates a dedicated farming wallet. Its private key is supplied only to the local MCP process through `AIPOU_AGENT_PRIVATE_KEY`; it must never be pasted into a chat or reused as a primary wallet.

`begin_ai_task` creates a random 32-byte nonce. The MCP signs an EIP-712 `TaskAuthorization` containing the wallet, nonce, task hash, provider, model, and timestamp.

## 2. Usage receipt

After the task, the client sends usage counts and an output hash to `complete_ai_task`. Raw prompts, outputs, files, and API keys are not stored.

The collector signs the receipt with Ed25519. Its public key lets validators verify the receipt without receiving a secret capable of creating new signatures. The protocol validator accepts only collector fingerprints listed in `AIPOU_TRUSTED_COLLECTORS_FILE`.

This receipt is an `issuer_asserted` audit artifact: the collector is the issuer, and the verifier checks the collector signature, wallet authorization, nonce, replay state, and validator policy. Onchain settlement can prove Merkle inclusion and claimed state for a `receiptId`, but it does not make the private receipt payload itself `chain_derivable`.

## 3. Validation

The user cannot select a trust tier.

```txt
client_signed: valid wallet EIP-712 authorization and valid collector signature
provider_signed: client_signed plus a valid signature from a configured provider public key
```

Closed providers that do not issue cryptographic usage signatures remain `client_signed`. A response ID or the agent's own statement is not treated as a provider signature.

See [Evidence Boundaries](evidence-boundaries.md) for what these signatures prove and do not prove. See [Claim Validation Policy](claim-validation-policy.md) for the settlement policy.

The state store rejects:

- reuse of a completed nonce
- reuse of the same task hash and output hash
- duplicate receipt IDs
- invalid wallet, collector, or provider signatures
- collectors not registered by the protocol validator

There is no daily reward limit. This leaves Sybil farming as an open economic risk even though exact receipt replay is blocked.

## 4. Merkle settlement

The protocol validator builds leaves as:

```txt
keccak256(keccak256(abi.encode(wallet, amount, receiptId)))
```

It publishes the Merkle root to `AIPOUClaims`, then calls `claimBatch`. The contract verifies each proof, marks each `receiptId` as claimed, and calls `AIPOU.mintUsageReward` for the farming wallet.

```txt
AI client
  -> begin_ai_task / EIP-712 nonce
  -> complete_ai_task / Ed25519 receipt
  -> validator / signature and duplicate checks
  -> Merkle root on Base
  -> AIPOUClaims.claimBatch
  -> AIPOU minted to farming wallet
```

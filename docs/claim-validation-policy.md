# Claim Validation Policy

This page explains why a receipt can become an AIPOU claim.

The short version:

```text
Users do not self-report trust tier. The validator derives it from signatures and configured public keys.
```

## Claim Scope

AIPOU claims are optional settlement for approved AI task receipts. They are not automatic proof that a task was valuable, correct, safe, or provider-endorsed.

A receipt is eligible for settlement only when it passes the local and validator checks described below.

## Minimum Receipt Evidence

Every claimable receipt must include:

- `receiptId`
- `nonce`
- farming wallet address
- client, provider, and model identifiers
- task hash
- output hash
- input and output token counts
- duration in seconds
- EIP-712 wallet authorization
- authorization chain ID
- authorization claims contract
- collector public key
- Ed25519 collector signature
- validator-derived trust tier
- estimated reward

Raw prompts, raw outputs, private project files, API keys, and wallet private keys must not be included.

## Trust Tier Rules

Current tiers:

| Tier | Who derives it | Requirement |
| --- | --- | --- |
| `client_signed` | MCP and validator | Valid wallet authorization plus trusted local collector signature |
| `provider_signed` | Validator | All `client_signed` checks plus a valid provider signature from a configured provider public key |

The user cannot choose a tier.

The validator recomputes the tier during settlement. If the receipt says `provider_signed` but the provider signature is missing, invalid, or not signed by a configured provider key, settlement fails.

## Validator Checks Before Settlement

Before a receipt enters a Merkle batch, the protocol validator checks:

- collector fingerprint is in `AIPOU_TRUSTED_COLLECTORS_FILE`
- Ed25519 collector signature verifies over the receipt payload
- EIP-712 wallet authorization verifies for the task session
- provider signature verifies when `providerEvidence` is present
- derived trust tier matches the receipt trust tier
- receipt is still unsettled
- `AIPOUClaims` is the token emission controller
- the validator wallet matches the validator configured in `AIPOUClaims`

Then the validator builds a Merkle leaf:

```text
keccak256(keccak256(abi.encode(wallet, amount, receiptId)))
```

The amount comes from the reward model and the derived trust tier, not from user input.

## Onchain Claim Checks

`AIPOUClaims` verifies:

- the Merkle root was published by the validator
- the wallet, reward amount, and `receiptId` are included in the approved root
- the `receiptId` has not already been claimed

If the proof is valid, `AIPOUClaims` mints AIPOU to the farming wallet.

## Reward Formula

Current formula:

```text
token_score    = min((input_tokens + output_tokens) / 1,000, 30)
duration_score = min(duration_seconds / 300, 12)
reward         = min((token_score + duration_score) * tier_multiplier, 50)
```

Current multipliers:

| Tier | Multiplier | Maximum reward |
| --- | ---: | ---: |
| `client_signed` | 0.75 | 31.5000 AIPOU |
| `provider_signed` | 1.50 | 50.0000 AIPOU |

Duration stops increasing after one hour per task. Token score stops increasing after 30,000 tokens per task.

## Rejection Reasons

The validator should reject or delay receipts when:

- the nonce was already completed
- the task/output evidence was already used
- the collector is not trusted
- the collector signature is invalid
- the wallet authorization is invalid
- provider evidence is claimed but cannot be verified
- the trust tier does not match the derived tier
- the receipt is already settled
- the receipt appears to be generated only for spam, Sybil farming, or reward extraction

## Privacy Boundary

AIPOU claims should be reviewable without exposing raw prompts or raw outputs.

The public chain should only see the approved root, wallet, amount, and `receiptId` used in a proof. Private evidence remains local unless a user or validator intentionally publishes more context.

## Current Governance Boundary

The current validator is a protocol authority. That is intentional for the first experimental version and should be disclosed clearly.

Future hardening should include:

- multisig owner and validator control
- published collector admission rules
- public provider-key registry
- dispute process for rejected receipts
- stronger economics for provider-signed or externally attested receipts

# Audit Checklist

AIPOU is experimental. Before broad public farming, these areas should be reviewed.

## Replay and Uniqueness

Check:

- nonces are cryptographically random
- completed nonces cannot be reused
- duplicate task/output evidence is rejected
- duplicate `receiptId` values are rejected locally
- duplicate `receiptId` values are rejected by `AIPOUClaims`
- Merkle leaves bind wallet, amount, and `receiptId`

## Collector Trust

Check:

- collector public keys are fingerprinted consistently
- trusted collector fingerprints are allowlisted
- collector signatures are verified over canonical payloads
- collector private keys are never written to receipts
- collector rotation and removal are documented

## Provider Evidence

Check:

- `provider_signed` requires a configured provider public key
- provider signatures verify over canonical usage assertions
- response IDs are never treated as provider signatures
- invalid provider evidence fails settlement
- users cannot self-report a higher trust tier

## Validator Operations

Check:

- validator wallet matches `AIPOUClaims.validator()`
- `AIPOUClaims` is the token emission controller
- settlement recomputes trust tier
- settlement rejects untrusted collectors
- settlement records root and transaction hashes
- validator policy is documented publicly
- owner and validator authority should move to multisig before larger public adoption

## Smart Contracts

Check:

- only validator can publish roots
- only approved roots can claim
- claimed receipt IDs cannot claim twice
- batch claims preserve wallet, amount, and receipt ID binding
- token cap cannot be exceeded
- emission controller permissions are constrained

## Privacy

Check:

- raw prompts are not stored
- raw outputs are not stored
- private project files are not stored
- API keys are not stored
- wallet private keys are not committed
- public records reveal only intended claim data

## Economic Abuse

Check:

- client-signed receipts have lower rewards than provider-signed receipts
- exact replay is blocked
- Sybil farming remains documented as an open risk
- high-value claims can be delayed for review
- future staking, slashing, identity cost, or reputation options are documented

## Outreach Safety

Check:

- no price promises
- no yield promises
- no liquidity promises
- no exchange listing promises
- no claim that AIPOU detects hidden AI use
- no claim that AIPOU proves objective task value
- no claim that AIPOU replaces scanners, policy gates, x402, AP2, or observability tools

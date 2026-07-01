# Evidence Boundaries

AIPOU is a receipt protocol, not an AI detector, scanner, policy engine, or oracle of task value.

This page exists so reviewers can see exactly what the current proof means before discussing claims or rewards.

## What AIPOU Proves

For a valid `client_signed` receipt, AIPOU proves:

- a dedicated farming wallet authorized a specific task nonce through EIP-712
- the task nonce is bound to a provider, model, client, task hash, chain ID, and claims contract
- a local Ed25519 collector signed the completed receipt payload
- the collector public key can be verified without exposing the collector private key
- the validator accepted the collector fingerprint as trusted
- the same nonce was not completed twice in the local receipt store
- the same task/output evidence was not accepted twice in the local receipt store
- the receipt can be included in a Merkle batch as wallet, amount, and `receiptId`
- `AIPOUClaims` can reject the same `receiptId` after its first onchain claim

For a valid `provider_signed` receipt, AIPOU additionally proves:

- the configured provider key signed the canonical usage assertion
- the validator found that provider key in `AIPOU_PROVIDER_KEYS_FILE`

## Evidence Class

An AIPOU task receipt should be treated as an `issuer_asserted` audit artifact.

The issuer is the local collector that signs the receipt. Verifying the receipt means checking the collector signature, the wallet authorization, the nonce, replay state, trusted collector admission, and any validator policy that accepted it.

The receipt payload is not `chain_derivable` by default. A Merkle root or claim transaction can make the receipt hash, inclusion, timestamp, wallet, amount, and `receiptId` externally checkable on Base, but the underlying task metadata remains collector-signed evidence. External systems should keep those two claims separate:

- `issuer_asserted`: the signed receipt payload and local hashes
- `chain_derivable`: onchain root publication, proof inclusion, and claimed `receiptId` state

This distinction is important for integrations with certification, provenance, audit, and payment systems. AIPOU receipts can be useful external evidence without being presented as trustless proof of useful work.

## What AIPOU Does Not Prove

AIPOU does not prove:

- hidden AI use in work that never called the MCP
- that a task was objectively useful or economically valuable
- that "useful work" has been proven without validator policy or later review
- that a provider endorsed AIPOU
- that an API response ID is a provider signature
- that token counts are truthful when the provider does not sign them
- that a human did or did not inspect the output
- that a project is free of malicious tools, prompt injection, or supply-chain risk
- that a user has only one wallet or one collector
- that Sybil farming is impossible
- that the current validator policy is decentralized

## Boundaries for Public Language

Use this:

```text
AIPOU records wallet-authorized MCP task receipts, verifies local collector signatures, rejects replay, and can settle approved receipts through a Merkle claim contract.
```

Do not use this:

```text
AIPOU detects all AI work, proves real value, prevents all abuse, or replaces scanners and policy gates.
```

Also avoid:

```text
AIPOU mining rewards people for using AI.
```

Prefer:

```text
AIPOU creates receipts for AI work. Optional rewards are attached only after validation.
```

## Relationship to Other Provenance Tools

AIPOU should be presented as complementary to:

- AI provenance receipts
- MCP security scanners
- SLSA-style supply-chain attestations
- policy gates
- observability traces
- agent payment rails

Those systems can decide whether an AIPOU `receiptId` is useful as external evidence. They should not be expected to validate AIPOU rewards or token claims.

## Current Trust Assumption

The first public version relies on protocol validator policy for `client_signed` receipts. Reviewers should treat this as an explicit trust assumption, not as a solved decentralization claim.

Before broader public farming, the project should move owner and validator authority to multisig, publish validator rules, and document how trusted collector fingerprints are admitted or removed.

This means AIPOU should be presented as an experimental receipt layer today, not as a trustless oracle for task value. Stronger versions should add provider-signed evidence, public validator policy, auditable collector admission, and multisig governance.

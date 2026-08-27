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

## External Effects Need External Observations

An AIPOU receipt can describe a task boundary or a host-observed action. It
must not turn a local success path, command exit code, or provider message ID
into a claim that an external effect happened.

For a message, payment, deployment, notification, or delivery, retain the
provider's observation as an attributed sibling artifact:

```json
{
  "provider": "transport-or-target-system",
  "receiptId": "provider-issued-opaque-id",
  "event": "accepted | reported_delivered | bounced | rejected",
  "observedAt": "2026-08-26T00:00:00.000Z",
  "rawDigest": "sha256:..."
}
```

The host may derive a display status only from events the provider actually
reports. `accepted` is not `reported_delivered`, and a later `bounced` event
must downgrade a prior display rather than overwrite the attributed history.
An AIPOU work receipt can link to the digest-only artifact, but does not issue,
reinterpret, or validate that provider observation.

Keep these outcomes distinct:

- `not_dispatched`: no host attempt was observed;
- `transport_snapshot_membership`: an exact event appeared in a supplied or
  captured transport snapshot, but the transport's native signature or
  acceptance semantics have not been verified;
- `signed_transport_verified`: the transport's native verifier checked the
  signed event bytes and its nonce rules; this proves the bounded transport
  statement only, not delivery or persistence;
- `transport_accepted`: the transport accepted an attempt;
- `provider_reported_delivered`: the provider later reported delivery;
- `externally_verified`: an authoritative target or named verifier observed
  the intended effect;
- `undelivered_or_unverified`: no sufficient external observation exists.

Re-evaluate derived status when observations are read or reconciled. A stale
write-time conclusion must not remain a permanent success claim after later
transport evidence contradicts it. A counterparty decision such as
`asked_and_declined` requires an observation from that counterparty; a
transport receipt alone cannot establish it.

An integration that waits for an external attestation should also name an
`attestationDeadline` and the component responsible for reconciliation. Until
then, `dispatched_unverified` is only a local observation, not an open-ended
success state. If no sufficient provider observation exists when the deadline
passes, the derived state must become `attestation_timed_out` (or the
integration's equivalent of `undelivered_or_unverified`) and route to its
named retry, compensation, or human-review path. Derive that timeout when the
record is read or reconciled; do not rewrite the immutable local dispatch
observation. This is integration-owned execution lifecycle data, separate from
an AIPOU work receipt and from any AIPOU claim eligibility decision.

## Imported Transport Artifacts

An artifact exported from a room, queue, trace, or API snapshot should carry
the narrowest evidence class the receiving verifier actually established. An
exact `did`, nonce, text, and sequence match inside supplied JSON is
`transport_snapshot_membership`; it is not a cryptographic verification just
because the source protocol normally supports signatures.

Before a receiver upgrades such an artifact to `signed_transport_verified`, it
must retain or integrity-bind the raw snapshot, preserve the signed tuple and
signature, verify the source protocol's canonical bytes under the source key,
and reject ambiguous reuse of a nonce in the source protocol's nonce scope.
Even that result does not prove that the remote system retained the event,
fulfilled a task, accepted a deliverable, made a payment, or approved an AIPOU
claim.

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

An artifact that resolves successfully is not automatically verified. A URI,
ID, or digest can correlate sibling artifacts, but each artifact must still
pass its own verifier before it can affect authority, reputation, payment, or
reward state.

## Receipt Verification vs Claim Validation

AIPOU separates receipt verification from reward validation.

Receipt verification is meant to be portable: a third party can verify that a
receipt payload was signed by the published collector public key, that the
wallet authorization matches the task nonce and chain context, and that the
receipt hash or `receiptId` matches the artifact being referenced. This makes
the work receipt usable as an external audit artifact beside identity,
payment, trace, or provenance records.

Claim validation is narrower and protocol-specific: only the current AIPOU
validator policy decides whether a receipt is eligible for an AIPOU reward,
which trust tier applies, and which Merkle batch can settle on Base. A valid
receipt can be useful external evidence even when it has no approved claim, and
an approved claim does not upgrade the private receipt payload into a
trustless proof of useful work.

In short:

- `verify receipt`: check collector signature, wallet authorization, nonce,
  digest, and published public keys;
- `validate claim`: apply AIPOU validator policy, trusted collector admission,
  reward rules, Merkle inclusion, and onchain claimed state.

## Current Trust Assumption

The first public version relies on protocol validator policy for `client_signed` receipts. Reviewers should treat this as an explicit trust assumption, not as a solved decentralization claim.

Before broader public farming, the project should move owner and validator authority to multisig, publish validator rules, and document how trusted collector fingerprints are admitted or removed.

This means AIPOU should be presented as an experimental receipt layer today, not as a trustless oracle for task value. Stronger versions should add provider-signed evidence, public validator policy, auditable collector admission, and multisig governance.

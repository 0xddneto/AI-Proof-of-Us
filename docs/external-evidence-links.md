# Scheme-Neutral External Evidence Links

`external-evidence-link-v1` is an experimental, scheme-neutral way to bind two independently verifiable artifacts without importing either artifact's trust model.

It was added after AIIR feedback identified an important boundary: putting an external receipt ID into informational extensions does not make that reference integrity-bound. A digest-bearing artifact relation or separate in-toto-style bundle can bind the relationship while keeping validation and reward semantics independent.

This prototype does not modify AIIR, SLSA, OCI, x402, OpenTelemetry, or any other protocol. The example scheme names are test-vector labels, not endorsements or claims of compatibility.

## Object Shape

```json
{
  "scheme": "external-evidence-link-v1",
  "relation": "input_to | output_of | supports | derived_from",
  "source": {
    "kind": "receipt",
    "scheme": "aipou-receipt-v1",
    "id": "0x...",
    "digest": "sha256:..."
  },
  "target": {
    "kind": "bundle",
    "scheme": "independent-bundle-v1",
    "id": "bundle:...",
    "digest": "sha256:..."
  },
  "privacy": "digest_only",
  "issuedAt": "2026-07-14T15:30:00.000Z",
  "linkDigest": "sha256:..."
}
```

The source and target remain independently verifiable. The link says only that its issuer asserts a typed relationship between their exact digests.

## Hash Semantics

Each artifact reference requires a lowercase SHA-256 digest over the referenced artifact bytes. `linkDigest` is SHA-256 over the canonical JSON form of:

```text
scheme + relation + source + target + privacy + issuedAt
```

Objects are serialized with lexicographically sorted keys, arrays preserve order, and undefined values are omitted. The implementation and fixed expected digests are published in:

- `examples/lifecycle-adapter/external-evidence-link.mjs`
- `examples/lifecycle-adapter/external-evidence-test-vectors.json`

Changing an artifact ID, digest, relation, privacy mode, or timestamp invalidates `linkDigest`.

## Signature Semantics

An unsigned link is a deterministic bundle artifact. A signed link adds:

```json
{
  "attestation": {
    "algorithm": "Ed25519",
    "publicKey": "-----BEGIN PUBLIC KEY-----...",
    "signature": "base64..."
  }
}
```

The Ed25519 signature covers the UTF-8 `linkDigest` string. Signature verification proves which link issuer signed the relationship. It does not prove that either artifact is true, useful, authorized, payable, or endorsed by the referenced protocols.

## Failure Behavior

The validator fails closed on:

- unknown link schemes or relations;
- missing artifact kind, scheme, ID, or digest;
- non-lowercase or non-SHA-256 digests;
- self-links to the same scheme and ID;
- a recomputed `linkDigest` mismatch;
- unsupported or invalid signatures;
- a missing signature when the receiving policy requires one;
- embedded raw content fields.

A receiver must still run each referenced protocol's own verifier. A valid external link cannot upgrade `issuer_asserted` evidence into chain-derived or provider-endorsed evidence.

## Privacy

Version 1 permits only `privacy: "digest_only"`. Artifact references must not contain raw prompts, outputs, private files, keys, or personal data. SHA-256 digests can still leak information when the input space is small or guessable, so private artifacts should use high-entropy salts or remain unlinked when correlation risk is unacceptable.

## Scheme-Neutral Vectors

The canonical fixtures cover three independent combinations:

1. AIPOU receipt to an AIIR-labeled bundle.
2. SLSA-labeled provenance to an OCI-labeled manifest.
3. x402-labeled payment receipt to an OpenTelemetry-labeled trace.

The last two do not contain AIPOU receipts. They demonstrate that the link format does not special-case AIPOU fields, rewards, wallets, validators, or Base.

## AIPOU Boundary

AIPOU claims remain separate downstream state. Reward amounts, claim status, Merkle roots, and settlement transactions do not belong in an external evidence link and cannot establish authority.

The existing `aipou-authority-work-link-v1` remains the stricter AIPOU-specific link for joining pre-action authority to a post-work receipt. `external-evidence-link-v1` is for cross-protocol artifact relationships where neither side should absorb the other's semantics.

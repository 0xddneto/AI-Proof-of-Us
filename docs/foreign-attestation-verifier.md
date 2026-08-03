# Foreign Attestation Verifier

AIPOU now includes a small, framework-neutral verifier slice for foreign
attestations. It is designed for interoperability with audit and provenance
systems that want to carry a typed reference to an AIPOU work receipt without
turning that reference into local chain evidence.

This is an AIPOU-side compatibility implementation. It does not claim that
AIPOU is integrated with Bernstein, does not import Bernstein code, and does
not replace the host system's own chain verifier.

## Envelope

The envelope is intentionally narrow:

```json
{
  "scheme": "foreign-attestation-v1",
  "issuanceScope": "foreign",
  "evidenceClass": "issuer_asserted",
  "issuer": {
    "kind": "bernstein-issuer",
    "id": "bernstein:fixture-issuer"
  },
  "claimedSubject": {
    "kind": "artifact",
    "id": "artifact:report:42"
  },
  "contentHash": "sha256:...",
  "trustClass": "third_party",
  "signature": {
    "algorithm": "Ed25519",
    "signature": "base64..."
  }
}
```

The verifier accepts the issuer key as an explicit call argument. This slice
does not introduce an issuer registry, network fetch, or implicit key trust.
Raw prompts, outputs, wallets, reward fields, claim fields, and unknown
extensions fail closed.

## Field Contract

The envelope is a foreign assertion, not AIPOU-native chain material. Each
field has a narrow role so a host can keep its own verifier authoritative.

| Field | Required | Rule |
| --- | --- | --- |
| `scheme` | Yes | Must be the supported versioned foreign-envelope scheme. |
| `issuanceScope` | Yes | Must be `foreign`; a local assertion is rejected. |
| `evidenceClass` | Yes | Must be `issuer_asserted`; it cannot claim chain-derived authority. |
| `issuer.kind`, `issuer.id` | Yes | Identifies the foreign issuer without fetching a key or creating a trust registry. |
| `claimedSubject.kind`, `claimedSubject.id` | Yes | Names the artifact or subject that the issuer says it attests. |
| `contentHash` | Yes | Lowercase `sha256:` digest of the claimed foreign material. |
| `trustClass` | Yes | Preserved as the foreign claim for display; never upgrades the local result. |
| `signature.algorithm`, `signature.signature` | Required for `verified_foreign` | Only Ed25519 with an explicit issuer key can produce a verified foreign result. |

The canonical payload is the typed envelope without the signature value. The
caller supplies the issuer public key explicitly. A host may use a different
wire format, but it should preserve the same separation between foreign issuer
identity, claimed subject, digest, signature, and host verdict.

## Failure Matrix

| Case | Foreign verdict | Local host-chain effect |
| --- | --- | --- |
| Valid typed envelope and matching explicit Ed25519 key | `verified_foreign` | None; the host chain remains independently verified. |
| Missing key, missing signature, bad signature, malformed fields, unknown scheme, or unsupported evidence class | `unverifiable` | None; no local pass is created. |
| Envelope asserts local issuance | `rejected` | None; the host must fail the foreign slot closed. |

In every row, the effective trust remains `third_party`; a foreign result is
reported beside the host verdict and never becomes HMAC-chain evidence,
provider evidence, claim approval, or a reward decision.

## Three Outcomes

`verifyForeignAttestation` returns one of three verdicts:

| Verdict | Meaning |
| --- | --- |
| `verified_foreign` | The typed envelope is internally consistent and the supplied issuer key verifies the signature. |
| `unverifiable` | The envelope is absent, malformed, unsigned, uses an unknown shape, lacks key material, or has a signature that does not verify. |
| `rejected` | The envelope contradicts the foreign boundary by asserting local issuance. |

A verified foreign envelope remains foreign. The result exposes the
`claimedTrustClass` for display and sets `effectiveTrustClass` to
`third_party`. No foreign field can upgrade an AIPOU receipt to local,
operator, provider-signed, or chain-derived evidence.

## Isolation

Foreign metadata is not part of the host chain verification input. The
`hostMaterialDigest` helper is a small executable isolation check: adding or
mutating the foreign slot leaves the host material digest unchanged. A real
host must still run its own local chain verifier and report that verdict
separately.

The intended host-facing report shape is:

```text
own material: verified by host
foreign claim: verified_foreign | unverifiable | rejected
trust effect: no upgrade; foreign evidence remains third_party
```

## Usage

```js
import {
  signForeignAttestation,
  verifyForeignAttestation
} from "./foreign-attestation.mjs";

const signed = signForeignAttestation(envelope, issuerPrivateKey);
const result = verifyForeignAttestation(signed, {
  issuerPublicKey
});
```

Executable fixtures and tests:

- `examples/lifecycle-adapter/foreign-attestation.mjs`
- `examples/lifecycle-adapter/foreign-attestation-fixtures.json`
- `examples/lifecycle-adapter/foreign-attestation.test.mjs`

The implementation is deliberately smaller than a full provenance or audit
system. It establishes the trust boundary and failure semantics first.

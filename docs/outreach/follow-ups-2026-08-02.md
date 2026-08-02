# Follow-Ups - August 2, 2026

## Bernstein foreign-attestation verifier slice

Source thread:
<https://github.com/sipyourdrink-ltd/bernstein/issues/3133>

The maintainer clarified the contract for the next slice:

- a foreign issuer can verify only to `verified_foreign`;
- absent, malformed, unknown, or unsigned material is `unverifiable`;
- an envelope claiming local issuance is `rejected`;
- the host's own chain verdict must be byte-identical with or without the
  foreign slot;
- issuer key material must be supplied explicitly rather than discovered
  through a new registry in this slice.

AIPOU implemented the compatible framework-neutral slice:

- `examples/lifecycle-adapter/foreign-attestation.mjs`;
- `examples/lifecycle-adapter/foreign-attestation-fixtures.json`;
- `examples/lifecycle-adapter/foreign-attestation.test.mjs`;
- `docs/foreign-attestation-verifier.md`;
- links from the lineage-attestation documentation and lifecycle README.

The implementation keeps `issuer_asserted` as the evidence class, preserves
the claimed trust class for display, and reports `effectiveTrustClass:
third_party` after a valid foreign signature. It does not claim Bernstein
integration and does not change AIPOU claims, tokenomics, contracts, wallets,
or settlement behavior.

Verification result:

- focused lifecycle adapter suite: pending in this work session;
- public response: drafted, not posted automatically.

Suggested Bernstein reply after the focused suite passes:

> Implemented the narrow AIPOU-side verifier slice and kept the boundary strict:
> `verified_foreign` only follows a valid signature over the typed envelope
> supplied with an explicit issuer key; missing/malformed/forged material is
> `unverifiable`; an envelope asserting local issuance is `rejected`. The host
> material digest is unchanged when the foreign slot is populated or mutated.
> The implementation is framework-neutral and does not claim Bernstein
> integration. We would be glad to compare the envelope fields and failure
> vectors with your verifier once the public contract is settled.

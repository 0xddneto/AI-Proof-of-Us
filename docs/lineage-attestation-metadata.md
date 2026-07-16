# External Attestations In Artifact Lineage

Some systems maintain their own deterministic chain of custody for artifacts. An external AIPOU `workReceiptId` must not become a native entry in that audit chain merely because the host stores a reference to it.

The lifecycle example provides a provider-neutral metadata shape for this boundary:

```json
{
  "artifactId": "artifact:report:42",
  "metadata": {
    "externalAttestations": [
      {
        "scheme": "aipou-receipt-v1",
        "ref": "0x...",
        "issuer": {
          "kind": "collector",
          "id": "sha256:..."
        },
        "trustModel": "issuer_asserted"
      }
    ]
  }
}
```

The same normalized array can be mirrored into run-level audit-summary metadata. The host remains authoritative for its lineage and summary. The external issuer remains authoritative only for its own receipt.

## Deterministic Replay

The reference must exist when the artifact lineage record is created. The example never fetches a receipt ID during replay. It validates, normalizes, deduplicates, and sorts references so insertion order does not change the resulting metadata. Mirroring copies the exact normalized references and fails closed if the run summary diverges from the artifact lineage.

## Provider Neutrality

The wrapper understands only four fields: `scheme`, `ref`, `issuer`, and `trustModel`. It does not special-case AIPOU. The tests attach both an AIPOU-labeled receipt and a SLSA-labeled provenance reference.

`trustModel` is fixed to `issuer_asserted`. A host can display or preserve the opaque reference without adopting the external issuer's validation, reward, wallet, settlement, or usefulness claims.

## Privacy And Claims

Unknown fields fail closed. Raw content, prompts, outputs, wallet fields, reward amounts, and claim status cannot be embedded in the reference. The shape carries no Base, Merkle, token, or claim semantics.

This metadata alone is informational. When the relationship between two exact artifacts must be integrity-bound independently of the host record, use [`external-evidence-link-v1`](external-evidence-links.md), which binds artifact digests while keeping both verification authorities separate.

Implementation and executable tests:

- `examples/lifecycle-adapter/lineage-attestation.mjs`
- `examples/lifecycle-adapter/lineage-attestation.test.mjs`

This is a framework-neutral reference implementation. It does not modify or claim integration with Bernstein or any other external audit system.

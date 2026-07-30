# ElizaOS / Kuberna Conformance Fixture Bundle

This bundle is the concrete three-fixture exchange referenced in the ElizaOS
discussion:

- one positive Kuberna-pinned authority/work link;
- one fail-closed fact-link mismatch;
- one fail-closed `chain_derivable` authority carrying AIPOU issuer fields.

Files:

- `elizaos-conformance-fixtures.json`
- `receipt-reference.mjs`
- `receipt-reference.test.mjs`

Verification command:

```bash
cd examples/lifecycle-adapter
npm test
```

Relevant checks in `receipt-reference.test.mjs`:

- `accepts the pinned Kuberna ERC-8004 authority receipt as a positive vector`
- `fails closed when post-work evidence points to another authority fact`
- `rejects an authority relabeled chain-derivable while carrying AIPOU issuer fields`

This is interoperability evidence only. It does not claim execution quality,
reward approval, or ElizaOS/Kuberna adoption.

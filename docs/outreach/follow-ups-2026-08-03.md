# Follow-Ups - August 3, 2026

## Concrete external results

### Bernstein foreign-attestation contract merged

Bernstein merged the protocol-neutral foreign-attestation contract fixture in
[PR #3192](https://github.com/sipyourdrink-ltd/bernstein/pull/3192). The
maintainer independently reproduced the suite and confirmed that the strict
expected-failure turns red if a future verifier appears without the contract
being migrated. The merged contribution keeps foreign material outside the
Bernstein HMAC chain and fixes the negative semantics of `unverifiable` plus
`third_party` taint.

This is a merged upstream test contribution. It is not a Bernstein-AIPOU
product integration, token listing, or adoption claim.

### AgentGraph published reciprocal fixture

AgentGraph published a real public cross-fixture using its `run-123` canonical
envelope digest and AIPOU's frozen receipt digest:

<https://github.com/agentgraph-co/agentgraph/blob/838111b74ec6ee967d59a284e45d5c98265729bb/docs/conformance/agentgraph-aipou-crossfixture-v0/fixture.json>

AIPOU now pins the public link locally. The link validates as a canonical,
digest-only relation, but AIPOU intentionally does not resolve or verify the
remote AgentGraph envelope without an explicit AgentGraph resolver and
protocol verifier. The mismatch vector fails closed before resolution.

This is evidence-linkage collaboration, not runtime integration or confirmed
usage of AIPOU.

### ElizaOS / Kuberna reciprocal conformance bundle

Kuberna published a reciprocal three-vector bundle at pinned commit
[`fada367`](https://github.com/kawacukennedy/kuberna-labs/blob/fada367f122adf10dcd0b8c63dba98df7d06a2d6/sdk/src/verify/fixtures/elizaos-conformance-fixtures.json),
including a positive authority/work link and two fail-closed negatives. AIPOU
records the immutable pointer alongside its own matching vectors.

This is fixture collaboration only. It does not establish an ElizaOS or
Kuberna integration, task-quality proof, reward approval, or token utility.

### OpenLLMetry trace-boundary feedback

An OpenLLMetry participant recommended that a trace carry only an opaque
external evidence reference and content hash. Validation or claim outcomes
must remain in a separate verification record so telemetry cannot present a
dashboard-friendly value as a verification verdict. AIPOU adopted this: the
OpenTelemetry helper now projects only receipt ID, scheme, and evidence class.

### Open SWE usage-fixture correction

An Open SWE participant agreed that raw provider usage and normalized totals
should remain distinct, then initially offered a redacted retry/cache
provider-event fixture. The next reply narrowed that claim: no validated live
retry fixture is currently ready to contribute, and the described
provider-A/provider-B shape should be treated as synthetic design guidance
rather than measured evidence.

That means AIPOU should keep the lifecycle guidance, but must not log this as
an offered external fixture until a contributor returns with explicit license
terms and a redacted artifact that is actually ready to test.

## No change in adoption status

These are technical collaborations and useful review results. They do not by
themselves show a new production AIPOU user, a paid service transaction, an
approved bounty delivery, or a confirmed integration by the named projects.

## Responses posted

- [Bernstein #3133](https://github.com/sipyourdrink-ltd/bernstein/issues/3133):
  posted the AIPOU field table and verdict matrix as a comparison surface; the
  Bernstein schema remains theirs to freeze.
- [AutoGen / AgentGraph #7476](https://github.com/microsoft/autogen/discussions/7476):
  confirmed the swap to the public `run-123` digest and the intentional
  resolver/verifier boundary.
- [ElizaOS #9810](https://github.com/orgs/elizaOS/discussions/9810): mirrored
  the pinned Kuberna bundle and proposed a small shared manifest only when a
  real consumer needs it.
- [OpenLLMetry #3460](https://github.com/traceloop/openllmetry/issues/3460):
  confirmed that trace attributes no longer carry validation or claim state.
- [Open SWE #1106](https://github.com/langchain-ai/open-swe/discussions/1106):
  accepted the offered retry/cache fixture subject to redaction and explicit
  contribution terms.

Closed or already-answered threads did not receive duplicate follow-ups:
Agent402 closed without a requested action; the Agent Receipts discussion was
closed as outdated; the MCP placement thread had already received its direct
implementation response.

The AIPOU bounty pull requests that resurfaced in notifications also remain in
the same state: the submissions for #8 and #9 were patch/explanation text, not
the actual delivered PNG assets, so they are still not reviewable as bounty
deliveries and do not imply payout.

# Technical Follow-Ups - July 24, 2026

This log records direct external feedback reviewed on July 24 and the concrete
AIPOU response. Technical validation remains separate from adoption.

## A2A / Concordia

- Feedback:
  https://github.com/a2aproject/A2A/discussions/1341#discussioncomment-17772347
- Reply:
  https://github.com/a2aproject/A2A/discussions/1341#discussioncomment-17773289
- Finding: a resolvable reference must never be treated as a passed
  verification check. Correlation is not entailment.
- AIPOU impact: the claims path did not consume external evidence links as
  reward authorization, so this did not expose an existing mint path.
- Improvement: `verifyExternalEvidenceArtifacts` now fails closed unless both
  referenced artifacts resolve, match their digests, and pass a
  caller-supplied protocol verifier. Tests cover a resolvable-but-unverified
  target and mutated resolved bytes.
- Documentation: the external evidence and evidence-boundary guides now state
  explicitly that resolution, availability, and digest integrity do not
  establish protocol verification, authority, payment, reputation, or reward
  eligibility.
- External confirmation:
  https://github.com/a2aproject/A2A/discussions/1341#discussioncomment-17773654
- Result: Erik Newton confirmed that the fail-closed caller-supplied verifier
  and the resolvable-but-unverified negative test address the relevant
  integrator failure mode. No further reply was added because the confirmation
  contained no new question or requested change.
- Status: actionable external review implemented and independently confirmed;
  not A2A or Concordia adoption.

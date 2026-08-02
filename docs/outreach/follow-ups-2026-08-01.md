# Follow-Ups - August 1, 2026

## What was checked

I re-checked the active AIPOU outreach threads and GitHub notifications on
Saturday, August 1, 2026.

## Positive recommendations applied locally

### AgentGraph public cross-fixture freeze

- Source:
  <https://github.com/microsoft/autogen/discussions/7476#discussioncomment-17858768>
- Recommendation:
  freeze a public AIPOU-side canonical fixture so AgentGraph can swap its
  placeholder for a real artifact digest without changing the fail-closed
  ownership split.
- AIPOU change:
  added `examples/lifecycle-adapter/agentgraph-cross-fixtures.json` and
  `examples/lifecycle-adapter/agentgraph-cross-fixtures.test.mjs`.
- Result:
  AIPOU now publishes one valid authority/work link, one phase-inversion
  failure, one valid digest-bound external link, and one AIPOU-side artifact
  digest mismatch failure. The public `actionRef` is frozen as
  `autogen:canonical-envelope:run-123`.

### Bernstein verifier slice accepted as a real next step

- Source:
  <https://github.com/sipyourdrink-ltd/bernstein/issues/3133#issuecomment-5142714307>
- Recommendation:
  the merged fixture PR is only the first slice; a public foreign-attestation
  verifier remains the next substantive step.
- AIPOU decision:
  positive for the project. This is the right next milestone because it moves
  AIPOU from "compatible fixture shape" toward a public verifier boundary
  without pretending that the current fixture alone settles the full problem.

## External conversation state

### AgentGraph / AutoGen trust discussion

- Thread:
  <https://github.com/microsoft/autogen/discussions/7476>
- Latest external response:
  `kenneives` confirmed the split verifier ownership is the right boundary and
  asked for a ping when AIPOU's v0.4 canonical work-receipt plus `actionRef`
  fixtures are frozen.
- Status:
  now materially advanced on the AIPOU side via the new public fixture file and
  test.
- Follow-up needed:
  post the frozen fixture link and invite the placeholder-digest swap.

### Bernstein foreign attestation verifier issue

- Thread:
  <https://github.com/sipyourdrink-ltd/bernstein/issues/3133>
- Latest external response:
  `chernistry` said the fixture PR is merged, but the honest `xfail` remains
  until there is a public foreign-attestation verifier on `main`.
- Status:
  worthwhile next milestone, not a rejection.
- Follow-up needed:
  confirm that AIPOU does want the verifier slice and is happy to collaborate
  on the narrow foreign-attestation verifier boundary.

### OpenLLMetry legacy vendor-specific PR

- Thread:
  <https://github.com/traceloop/openllmetry/pull/4373>
- Latest external response:
  `Diyaaa-12` asked whether maintainers should first confirm appetite for a
  generic `gen_ai.external_evidence.*` surface before they spend time reworking
  the PR.
- Status:
  good recommendation. The best next move is maintainer-appetite confirmation
  first, not asking a contributor to do a speculative rewrite.
- Follow-up needed:
  reply that AIPOU agrees and would prefer maintainers to confirm generic
  semconv appetite before any rework.

### Agent402 optional settlement thread

- Thread:
  <https://github.com/MikeyPetrillo/Agent402/issues/626>
- Latest external response:
  `MikeyPetrillo` validated the payment-receipt versus work-receipt split and
  explained that Agent402 settlement authority stays intentionally narrow around
  the existing signed credential path.
- Status:
  positive boundary guidance. AIPOU should keep presenting itself there as
  optional post-work evidence or optional settlement metadata, never as a
  second settlement authority.
- Follow-up needed:
  answer in those terms and keep the ask small.

## Threads without a required new reply in this pass

These were checked again and did not surface a fresh substantive external
question after AIPOU's latest answer:

- <https://github.com/a2aproject/A2A/discussions/1341>
- <https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2404>
- <https://github.com/microsoft/autogen/discussions/7752>

## Net result

This pass turned the AgentGraph validation into a reproducible public fixture,
confirmed the Bernstein verifier issue as a real next technical milestone, and
isolated three external follow-ups that are worth posting once browser-side
message submission is approved for this turn.

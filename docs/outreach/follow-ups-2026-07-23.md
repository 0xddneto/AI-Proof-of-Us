# Technical Follow-Ups - July 23, 2026

This log separates direct AIPOU feedback from unrelated activity in previously
visited technical threads.

## ElizaOS

- Thread: https://github.com/orgs/elizaOS/discussions/9810
- New activity: `kawacukennedy` confirmed that a hard-coded Discord webhook was
  moved to a GitHub Actions secret and that the old URL was revoked in
  `kuberna-labs` commit `4b365df`.
- Attribution: the public commit credits another reporter, not AIPOU.
- Decision: no promotional or self-attributing reply was added. The security
  correction is positive for that project but is not AIPOU adoption or new
  protocol feedback.

## AutoGen

- Thread: https://github.com/microsoft/autogen/discussions/7476
- New technical response:
  https://github.com/microsoft/autogen/discussions/7476#discussioncomment-17757035
- Result: the AgentGraph author described signed, offline-verifiable receipts
  as the evidence substrate and reputation scores as separate products that
  must remain recomputable from those receipts.
- AIPOU-specific placement: attach the external receipt to the exact action
  through `action_ref`, keep it content-addressed and independently
  verifiable, and allow it to inform a score without hiding it inside that
  score.
- Applied: the interoperability guide now maps host `action_ref` to AIPOU
  `actionRef` and keeps `workReceiptId`, issuer, digest, scheme, and evidence
  class separate from score output. A score cannot replace a receipt or imply
  claim approval.
- Status: meaningful external technical validation and a concrete fixture
  exchange opportunity, not an AgentGraph integration or active AIPOU usage.
- Unrelated streaming-application advertising in the same thread remains
  unanswered.

## awesome-mcp-servers

- Pull request: https://github.com/punkpeye/awesome-mcp-servers/pull/10577
- Current state: open, mergeable, and clean. The submission checks pass.
- AIPOU has already supplied the verified Glama ownership, release, and quality
  evaluation links.
- Maintainer response:
  https://github.com/punkpeye/awesome-mcp-servers/pull/10577#issuecomment-5060784043
- Result: the repository owner confirmed that the claimed-server and evaluated
  Glama quality requirements are satisfied, said everything looks good under
  the directory rules, and announced that the pull request will be merged.
- AIPOU thanked the maintainer and committed to keeping the listing,
  installation instructions, and quality evidence current.
- Later triage regression:
  https://github.com/punkpeye/awesome-mcp-servers/pull/10577#issuecomment-5063398685
- Live diagnosis: Glama still shows release `0.1.0` and its prior successful
  test in the authenticated admin, but the quality score reverted to not
  tested. Repository sync remains stuck on commit `a48aa17`, the public API
  returns an empty tools array, and no new test was created after a manual
  Build & Release attempt.
- Current AIPOU head `0e89763` contains the improved tool descriptions and
  parameter documentation. A manual Glama sync was started but remained in
  progress after several minutes.
- Diagnostic reply:
  https://github.com/punkpeye/awesome-mcp-servers/pull/10577#issuecomment-5063625912
- Status: independently approved directory contribution whose merge is now
  blocked by a reproduced Glama indexing/sync inconsistency. This remains a
  distribution milestone, but not a completed merge or evidence of an external
  install, receipt, claim, or active user.

## OpenLLMetry

- Pull request: https://github.com/traceloop/openllmetry/pull/4373
- Current state: open and awaiting maintainer approval. The contributor applied
  all AIPOU-side review corrections.
- Status: concrete external integration attempt, but not merged adoption.

## Glama Quality Feedback

- Quality page: https://glama.ai/mcp/servers/0xddneto/AI-Proof-of-Us/score
- Action taken: expanded MCP tool descriptions to state when each tool should
  be used, what it returns, whether it changes local state, and whether it can
  contact Base or submit a transaction.
- Added descriptions for every `complete_ai_task` input, including nested
  provider evidence, and added MCP annotations for read-only, destructive,
  idempotent, and open-world behavior.
- Added an integration test that inspects the live MCP `tools/list` response so
  these safety and usage details cannot silently regress.
- Verification: 39 MCP tests pass, the npm package dry-run succeeds, production
  dependencies report zero vulnerabilities, and the publishable tree contains
  no populated credentials.
- Boundary: these changes improve agent usability and directory quality only.
  They do not alter reward calculation, receipt validation, farming, claims, or
  token contracts.

## UCP / Facet

- Thread:
  https://github.com/Universal-Commerce-Protocol/ucp/discussions/240
- New response:
  https://github.com/Universal-Commerce-Protocol/ucp/discussions/240#discussioncomment-17754214
- Result: Facet confirmed the four-sibling boundary used by the AIPOU pilot.
  Identity, payment authorization, response provenance, and the work receipt
  remain independently signed and verified artifacts. An issuer-and-digest
  reference does not become proof of useful work or a claim-approval decision.
- AIPOU reply:
  https://github.com/Universal-Commerce-Protocol/ucp/discussions/240#discussioncomment-17755574
- Decision: keep the existing scheme-neutral digest links and fail-closed
  tests. Do not invent a competing multi-artifact envelope before the host
  envelope is agreed. AIPOU offered a neutral four-artifact fixture after the
  referenced Facet envelope fields stabilize, with expected results proving
  that no sibling upgrades another and that no envelope outcome implies AIPOU
  claim approval.
- Status: meaningful external technical validation and a concrete
  interoperability path, not a UCP or Facet integration commitment and not
  evidence of active AIPOU usage.

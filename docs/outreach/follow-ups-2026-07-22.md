# Technical Follow-Ups - July 22, 2026

This log records actionable external feedback reviewed after the AIPOU
agentic-finance submission. Public replies were limited to direct technical
feedback or a concrete collaboration offer.

## OpenLLMetry

- Feedback: https://github.com/traceloop/openllmetry/issues/4340#issuecomment-5037827874
- Reply: https://github.com/traceloop/openllmetry/issues/4340#issuecomment-5046092129
- Result: accepted the offer from `Diyaaa-12` to open a draft PR for optional
  AIPOU span attributes.
- Agreed boundary: meaningful work units only; no raw prompts, outputs, wallet,
  reward, private receipt payload, or claim authority in spans. OpenLLMetry
  would correlate external status, not derive or validate it.
- Initial status: concrete collaboration offer accepted; integration was not
  yet implemented at that point.

### External implementation update

- Pull request: https://github.com/traceloop/openllmetry/pull/4373
- A contributor opened a real OpenLLMetry PR adding the four opt-in AIPOU span
  reference constants and shared semantic-convention tests.
- Review reply: https://github.com/traceloop/openllmetry/pull/4373#issuecomment-5046620955
- Requested corrections: move the constants out of the existing `Deprecated`
  section and add the trailing newline identified by automated review.
- AIPOU-side implementation: https://github.com/0xddneto/AI-Proof-of-Us/commit/90551cf
- Follow-up reply: https://github.com/traceloop/openllmetry/pull/4373#issuecomment-5046697215
- Added a tested `buildReceiptSpanAttributes` reference projection that emits
  exactly the four proposed fields and excludes wallet, reward, prompt, output,
  and claim authority. Verification passed 38 MCP tests, package dry-run, and a
  production dependency audit with zero vulnerabilities.
- The contributor fixed the trailing newline and moved the constants out of
  the `Deprecated` section in commit `301044a`.
- Latest review: https://github.com/traceloop/openllmetry/pull/4373#issuecomment-5050681023
- The names and trust boundary now match AIPOU. The contributor completed the
  final source-organization cleanup in commit `708791a`, moving the complete
  AIPOU section after the Watson attribute group.
- Current status: external code contribution open and under review. This is a
  concrete integration attempt and is ready from the AIPOU side, but it still
  needs at least one approving OpenLLMetry maintainer review before merge.

## A2A

- Confirmation: https://github.com/a2aproject/A2A/discussions/1341#discussioncomment-17738267
- Reply: https://github.com/a2aproject/A2A/discussions/1341#discussioncomment-17739506
- Result: Erik Newton confirmed that adopting the reference-by-digest shape in
  an independent receipt system is the practical interoperability test. AIPOU
  applies it while keeping work, payment, identity, and optional claim as
  sibling artifacts that cannot upgrade one another's trust.
- Status: external architectural validation; not an A2A integration or
  endorsement.

## awesome-mcp-servers

- Maintainer direction: https://github.com/punkpeye/awesome-mcp-servers/issues/9036#issuecomment-5048308687
- Existing submission: https://github.com/punkpeye/awesome-mcp-servers/pull/10577
- Reply: https://github.com/punkpeye/awesome-mcp-servers/issues/9036#issuecomment-5050680680
- Result: the owner directed AIPOU to the official PR or Glama route. The PR
  already existed and its submission check had passed, so its description was
  refreshed from `0.3.x` to the live npm `0.5.0` verification. The redundant
  routing issue was closed while the listing PR remains open for review.
- Verification: the public `npx -y aipou-mcp-server@0.5.0 --demo` command
  completed successfully without funds, RPC, persistent state, a claim, or
  private-key output.
- Status: valid external directory submission under review; not listed until
  the pull request is merged.
- Maintainer follow-up: https://github.com/punkpeye/awesome-mcp-servers/pull/10577#issuecomment-5051399149
- Merge requirements: claim the AIPOU server listing on Glama and complete a
  Glama quality evaluation. The repository already contains a valid root
  `glama.json` declaring `0xddneto`, but the public score page still reports
  `Author not verified` and `No Glama release`.
- Next external action: authenticate the Glama claim with GitHub, configure and
  deploy the Glama build, then publish a Glama release so server coherence,
  tool-definition quality, and security checks can be evaluated.

## Model Context Protocol

- Feedback: https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2996#discussioncomment-17697254
- Reply: https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2996#discussioncomment-17735106
- Result: implemented the suggested separation in commit
  https://github.com/0xddneto/AI-Proof-of-Us/commit/3f7be58.
- The signed receipt remains authoritative in the local receipt store.
  `complete_ai_task` now returns a compact reverse-DNS `_meta` projection;
  client run metadata may aggregate it; traces are correlation-only; MCP
  `taskId` and AIPOU `receiptId` remain separate; claim state is not projected
  as execution authority.
- Verification: 37 MCP tests, 11 contract tests, clean tarball execution, and
  zero production vulnerabilities.
- Status: external architecture recommendation implemented; not MCP project
  endorsement or adoption.

## UCP / Facet

- Confirmation: https://github.com/Universal-Commerce-Protocol/ucp/discussions/240#discussioncomment-17709704
- Reply: https://github.com/Universal-Commerce-Protocol/ucp/discussions/240#discussioncomment-17735107
- Result: confirmed that AIPOU will use the sibling-artifact rule in its
  agentic-finance pilot. Identity, payment authorization, settlement, response
  provenance, work receipt, and optional AIPOU claim remain separate trust
  domains linked by issuer and digest where useful.
- Status: technical compatibility confirmation; not a Facet or UCP integration.

## Reviewed Without A Reply

- General comments in GitHub Community threads were not direct AIPOU feedback
  and already had their own project focus, so no promotional reply was added.
- The completed ElizaOS/Kuberna fixture exchange already has a closing response
  from AIPOU. No duplicate follow-up was posted.

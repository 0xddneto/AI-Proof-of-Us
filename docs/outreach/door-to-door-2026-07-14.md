# Door-to-Door Outreach - 2026-07-14

This round shared AIPOU's verified distribution and security milestones without repeating the same promotional message across inactive threads.

## Verified Milestones Shared

- `aipou-mcp-server@0.2.2` is live on npm with two public attestations, including SLSA provenance.
- `io.github.0xddneto/ai-proof-of-us@0.2.2` is the latest active version in the official MCP Registry.
- Forge verifies publisher `@0xddneto`, the Ed25519 package signature, and control of `0xddneto.github.io`.
- Forge's cached scan is clean: 30 files, zero known CVEs, no suspicious scripts or content, and nine non-privileged MCP tools.
- `aipou-farming@1.0.1` passes ClawHub `skill verify` with a generated safety card and clean security evidence.

The remaining registry limitations were not hidden: Forge has not ingested npm's public provenance attestations, while ClawHub reports the existing skill as unsigned and without server-resolved repository provenance.

## Existing Conversations Revisited

### AutoGen

Thread: https://github.com/microsoft/autogen/discussions/7752

Update: https://github.com/microsoft/autogen/discussions/7752#discussioncomment-17636912

The update linked the now-verifiable npm, MCP Registry, Forge, and ClawHub state directly to the pending fixture exchange. It repeated that pre-action authority and post-work evidence remain separate, then invited a comparison against `admission_invariant` and `anchoring_invariant`.

Status: published; no new external reply or adoption confirmation at the time of this log.

### awesome-mcp-servers

Thread: https://github.com/punkpeye/awesome-mcp-servers/issues/9036

Update: https://github.com/punkpeye/awesome-mcp-servers/issues/9036#issuecomment-4970348827

The final readiness update asked for the correct listing category or PR path now that npm provenance, the latest MCP Registry entry, publisher/domain/signature verification, clean scans, and the ClawHub safety card are public. It also said no further status comments would be added if the project is not a fit.

Status: published; no maintainer reply at the time of this log.

### Threads Intentionally Not Reposted

- ElizaOS already received the nonce, duplicate-store, and cross-artifact implementation response on July 12. Its promised conformance draft is still pending.
- mcp-agent has only AIPOU-authored comments and no maintainer response. A third unilateral update would be spam.
- CoSAI, Traceloop, agent-services-mcp, and AgentPay have no new external reply that changes the technical question.
- The OpenClaw/ClawHub review issue is closed and locked. The live ClawHub verification result is the current evidence instead.

These conversations remain monitored. AIPOU should reply when a maintainer answers or when a new artifact directly resolves the thread's question.

## New Door-to-Door Conversations

### AIIR

Discussion: https://github.com/invariant-systems-ai/aiir/discussions/208

Question: where should an AIPOU `workReceiptId` reference attach without merging AIIR's declared-AI receipt trust model with AIPOU's post-work receipt and optional human reward path?

The message proposed a typed `aipou.work_receipt` external reference and explicitly kept rewards separate from authorship, useful-work proof, and hidden-AI detection.

### AIR Blackbox

Discussion: https://github.com/airblackbox/airblackbox/discussions/39

Question: should AIR's pre-action Gate receipt be referenced from the AIPOU post-work receipt, or should the sealed Gate artifact expose an optional typed external-receipt link?

The message kept Gate policy authority, Gate sealing, AIPOU work evidence, and optional validator-approved human rewards as four distinct layers.

### Bernstein

Discussion: https://github.com/sipyourdrink-ltd/bernstein/discussions/2494

Question: should an external `workReceiptId` attach at task completion, agent handoff, artifact-lineage metadata, or the run-level audit summary?

The message proposed a thin lifecycle adapter and explicitly left Bernstein's chained audit log authoritative. It invited a small adapter test, technical feedback, or a repository star.

## Adoption Status

This round produced three new public technical conversations and two relevant follow-ups. It did not yet produce a confirmed third-party installation, independently generated AIPOU receipt, merged integration, or production user. Stars, comments, and installations must be verified before being counted as adoption.

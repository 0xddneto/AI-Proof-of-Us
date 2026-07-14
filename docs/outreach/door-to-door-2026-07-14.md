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

External response: https://github.com/microsoft/autogen/discussions/7752#discussioncomment-17637351

Liuyanfeng1234 called npm SLSA provenance and MCP Registry verification a concrete milestone. They said independent distribution makes the two-receipt fixture exchange testable across implementations and described the split as compact digest-bound transport references plus independently verifiable governance artifacts.

AIPOU response: https://github.com/microsoft/autogen/discussions/7752#discussioncomment-17637859

The response proposed the next executable exchange: one AutoGen `canonical_envelope` plus expected `actionRef`, mapped to one valid authority/work link and two fail-closed variants for phase inversion and mismatched action/artifact digest. This is strong technical validation, but it is not yet a submitted fixture, merged integration, or adoption.

New external response: https://github.com/microsoft/autogen/discussions/7752#discussioncomment-17640612

Tamish560 identified a separate enforcement boundary: a valid authority receipt proves that authorization evidence exists, but does not prevent an agent from bypassing the authorized path. They recommended adding a benchmark assertion that attempts the action without a pre-action receipt and verifies that the orchestrator, sandbox, protected branch, or policy gate actually denies it.

Implemented locally:

- added `aipou-enforcement-check-v1` as a separate `issuer_asserted` test artifact, not a receipt trust upgrade;
- required one observed denied attempt without authority and one observed allowed attempt with the matching authority receipt;
- bound the policy and both observations to lowercase SHA-256 evidence digests;
- failed closed on bypass success, missing observations, authority mismatch, malformed evidence, and unverifiable external status;
- limited reliance to the specific enforcement point and test time instead of claiming universal bypass prevention.

This is an important security improvement, not proof that every AIPOU deployment enforces pre-action authority.

### ElizaOS

Thread: https://github.com/orgs/elizaOS/discussions/9810

New external response: https://github.com/orgs/elizaOS/discussions/9810#discussioncomment-17639976

Kawacukennedy accepted the collector-generated nonce and current file-lock duplicate protection for the pre-1.0 topology. For the planned ElizaOS/ERC-8004 conformance exchange, they proposed a fact-linked chain: a `chain_derivable + delegation-scope-v1` authority fact, an `issuer_asserted + aipou-receipt-v1` post-work fact, and `execution.preActionFactId` pointing to `authority.factId`.

Implemented locally:

- preserved the existing `aipou-authority-work-link-v1` base shape;
- added a stricter conformance validator for the proposed authority/work fact chain;
- rejected trust-model downgrades, unsupported authority schemes, work-subject mismatches, and mismatched `preActionFactId` links;
- kept the AIPOU task payload issuer-asserted even when the authority artifact is chain-derived.

ElizaOS offered to run the future harness against ERC-8004 adapter fixtures. That is a concrete collaboration path, but no exchanged fixture, PR, merge, installation, or adoption is confirmed yet.

### awesome-mcp-servers

Thread: https://github.com/punkpeye/awesome-mcp-servers/issues/9036

Update: https://github.com/punkpeye/awesome-mcp-servers/issues/9036#issuecomment-4970348827

The final readiness update asked for the correct listing category or PR path now that npm provenance, the latest MCP Registry entry, publisher/domain/signature verification, clean scans, and the ClawHub safety card are public. It also said no further status comments would be added if the project is not a fit.

Status: published; no maintainer reply at the time of this log.

### Threads Intentionally Not Reposted

- mcp-agent has only AIPOU-authored comments and no maintainer response. A third unilateral update would be spam.
- CoSAI, Traceloop, agent-services-mcp, and AgentPay have no new external reply that changes the technical question.
- The OpenClaw/ClawHub review issue is closed and locked. The live ClawHub verification result is the current evidence instead.

These conversations remain monitored. AIPOU should reply when a maintainer answers or when a new artifact directly resolves the thread's question.

## New Door-to-Door Conversations

### AIIR

Discussion: https://github.com/invariant-systems-ai/aiir/discussions/208

Question: where should an AIPOU `workReceiptId` reference attach without merging AIIR's declared-AI receipt trust model with AIPOU's post-work receipt and optional human reward path?

The message proposed a typed `aipou.work_receipt` external reference and explicitly kept rewards separate from authorship, useful-work proof, and hidden-AI detection.

External response: https://github.com/invariant-systems-ai/aiir/discussions/208#discussioncomment-17637166

InvariantSystems agreed that AIIR and AIPOU trust models should remain separate. They identified that an informational extension outside AIIR `record_core` would not integrity-bind the reference and recommended a digest-bearing external artifact or separate in-toto-style linkage. A future generic relation should be scheme-neutral, include canonical vectors, define hash/signature and failure semantics, discuss privacy, and demonstrate at least two non-AIPOU examples.

Implemented in `39b55b9`:

- added experimental `external-evidence-link-v1` without changing AIIR or claiming integration;
- bound source and target artifacts by lowercase SHA-256 digests;
- defined a canonical `linkDigest` and optional Ed25519 attestation;
- failed closed on mutation, unknown relations, malformed digests, self-links, unsupported signatures, and raw content;
- required `digest_only` privacy and documented digest-guessing risk;
- published canonical AIPOU/AIIR, SLSA/OCI, and x402/OpenTelemetry vectors;
- expanded the lifecycle and interoperability fixture set to 12 passing tests.

AIPOU response: https://github.com/invariant-systems-ai/aiir/discussions/208#discussioncomment-17637850

The response asked whether the relation vocabulary and canonicalization should remain in a separate in-toto-style bundle or are ready for a focused profile proposal. AIIR explicitly did not commit to testing, integration, or endorsement.

### AIR Blackbox

Discussion: https://github.com/airblackbox/airblackbox/discussions/39

Question: should AIR's pre-action Gate receipt be referenced from the AIPOU post-work receipt, or should the sealed Gate artifact expose an optional typed external-receipt link?

The message kept Gate policy authority, Gate sealing, AIPOU work evidence, and optional validator-approved human rewards as four distinct layers.

### Bernstein

Discussion: https://github.com/sipyourdrink-ltd/bernstein/discussions/2494

Question: should an external `workReceiptId` attach at task completion, agent handoff, artifact-lineage metadata, or the run-level audit summary?

The message proposed a thin lifecycle adapter and explicitly left Bernstein's chained audit log authoritative. It invited a small adapter test, technical feedback, or a repository star.

### a2a-x402 Follow-up

External response: https://github.com/google-agentic-commerce/a2a-x402/discussions/143#discussioncomment-17619619

AmitabhainArunachala said their live receipt verifier already uses the dual-receipt pattern and independently grades work evidence and payment evidence. The useful rule was that external settlement, receivables, buyer intent, distribution, and self-pay/test evidence must not collapse into one revenue or adoption claim.

Implemented in `2926cb2`:

- documented independent grades for AIPOU work receipts, payment-rail receipts, marketplace/job records, and AIPOU claim transactions;
- prohibited presenting self-payments, same-wallet transfers, testnet activity, or protocol demonstrations as independent revenue or adoption;
- linked cross-protocol evidence to the scheme-neutral digest-bearing relation from `39b55b9`.

The offered endpoint was first tested only with a synthetic public fixture. It returned `payment_required` for `0.05` USDC on Base even though the earlier comment described the test as free. After explicit user authorization, AIPOU repeated the test with a payment policy locked to the exact network, USDC contract, recipient, and `0.05` USDC amount. No private receipt was sent.

Public payment evidence:

- ETH-to-USDC preparation transaction: https://basescan.org/tx/0x09be0117adffbfaf7c66c0d59b369bcefd87cfdacebb76337543ebe5dfc69d1c
- x402 settlement transaction: https://basescan.org/tx/0xde69d892947a149928a1ca48f246e160972111a54d6aa5455dabb867d894aa19
- settled amount: exactly `0.05` USDC on Base;
- fixture: synthetic `aipou-receipt-v1`, `issuer_asserted`, and `local_fixture` evidence with placeholder hashes;
- verifier result: `R0_CLAIM_ONLY`, score `0`;
- detected evidence: no transport acknowledgement, handler acknowledgement, semantic reply, domain receipt, verifier receipt, or human approval;
- missing for done: `semantic_reply`, `domain_receipt`, and `verifier_receipt`.

This is a useful fail-closed result. The verifier correctly treated a local synthetic receipt reference as a claim rather than proof that work, payment revenue, adoption, or completion occurred. It is an external verifier result, not an AIPOU integration or user adoption event.

AIPOU response: https://github.com/google-agentic-commerce/a2a-x402/discussions/143#discussioncomment-17637908

Paid verification follow-up: https://github.com/google-agentic-commerce/a2a-x402/discussions/143#discussioncomment-17638326

The initial response asked for the free test route or invited the verifier operator to run the public canonical fixture. The later user-authorized paid run returned the tier and missing-proof output above. No first-class AIPOU evidence integration is confirmed yet.

## Adoption Status

This round produced three new public technical conversations, three relevant follow-ups, one detailed AIIR design review, one AutoGen architecture validation, one production-verifier offer from a2a-x402, and one externally returned fail-closed verifier result for a paid synthetic fixture. The feedback produced executable code, canonical vectors, and independent evidence-grade documentation. It did not yet produce a confirmed third-party installation, independently generated AIPOU receipt, merged integration, or production user. Stars, comments, and installations must be verified before being counted as adoption.

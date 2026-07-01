# AIPOU Agent Roadshow - 2026-07-01

This log records the long-form agent-to-agent outreach sprint.

Rules:

- Use local/OpenClaw/Ollama agents for critique, positioning, and target discovery.
- Record what was said, what the agent answered, and what changed.
- Do not spam public communities.
- Do not post externally without a destination-specific user confirmation.
- Do not lead with price, liquidity, yield, or investment language.
- Lead with: MCP receipts for AI agents.

## Live Summary

Status: paused to apply agent feedback before continuing

Current framing:

```text
AIPOU is an MCP-first receipt protocol for AI agents. It creates portable, privacy-preserving task receipts using wallet authorization, unique nonces, local collector signatures, replay checks, and optional Base claims.
```

## Applied Feedback Before Continuing

The Round 4 agents signaled that AIPOU needed stronger public evidence boundaries before more outreach.

Applied changes:

- Added `docs/evidence-boundaries.md`.
- Added `docs/claim-validation-policy.md`.
- Updated the README, farming guide, architecture guide, anti-abuse guide, `llms.txt`, outreach drafts, and Hugging Face Space.
- Clarified that AIPOU does not detect hidden AI use, prove objective task value, replace scanners/policy gates, or imply provider endorsement.
- Clarified that Base claims are optional settlement for approved receipts.
- Clarified that users cannot self-report trust tier; the MCP derives it and the validator recomputes it from configured signatures.
- Updated awesome-list drafts to say AIPOU is not an assistant.

Verification:

- `npm run build` passed.
- `npm run test` passed.
- Secret scan found no private key, HF token, or personal wallet leak in the touched public files.

## Return Pass After Evidence-Boundary Fixes

After adding `docs/evidence-boundaries.md` and `docs/claim-validation-policy.md`, the same agent personas were asked whether they would now use, list, integrate, or still block AIPOU.

### Round 1 Agents Revisited

#### MCP Maintainer Persona

Decision:

- Would integrate as an experiment.

Remaining blocker:

- `receiptId` placement still needs a consistent MCP surface.

Best next step:

- Propose AIPOU first as a companion MCP server, then discuss lifecycle hooks, tool result `_meta`, or trace attributes.

#### OpenClaw Skill Security Reviewer Persona

Decision:

- Would not approve directly, but would accept AIPOU as a review candidate.

Remaining blocker:

- The skill package must prove there are no hidden wallet actions.

Best next step:

- Publish an OpenClaw skill manifest/review checklist covering permissions, explicit claim command, no background settlement, and network destinations.

#### Local AI / Ollama User Persona

Decision:

- Would try it.

Remaining blocker:

- Base claims still sound abstract for local-only users.

Best next step:

- Explain claims as optional: users can use AIPOU only as a private local receipt trail.

#### Security Researcher Persona

Decision:

- Safe enough for experimental public testing, not production-grade adoption.

Remaining blockers:

- Replay implementation audit.
- Collector trust and storage audit.
- Validator operations audit.
- Trust-tier derivation audit.

Best next step:

- Publish an audit checklist before broader promotion.

### Round 2 Agents Revisited

#### Competitor Intelligence Persona

Decision:

- Differentiation is clearer but still not fully distinct from existing receipt/provenance tools.

Remaining blocker:

- AIPOU needs a concrete demo showing `receipt -> validated claim`, because wallet authorization plus Base claims still reads as incremental until demonstrated.

Best target:

- Builders who need receipt-backed settlement or reward accounting, not generic provenance.

#### Tired Provenance Maintainer Persona

Decision:

- Would still ignore generic outreach.

Acceptable approach:

- Ask one narrow technical question inside their scope.

Best next message:

```text
I am trying to avoid inventing an incompatible receipt reference. What minimum fields would make an external `receiptId` useful to your provenance model without making your project responsible for token claims?
```

#### SLSA / Provenance Engineer Persona

Decision:

- Compatible as external provenance evidence if AIPOU stays value-neutral.

Vocabulary to use:

- external provenance evidence
- Merkle settlement
- value-neutral evidence

Vocabulary to avoid:

- proves value
- proof of endorsement

#### Receipt Tool Founder Persona

Decision:

- Would collaborate on a small experiment.

Smallest useful integration:

- Export or accept an AIPOU `receiptId` as an external reference.

Remaining blocker:

- The other tool must not be responsible for validating AIPOU rewards.

### Round 3 Agents Revisited

#### x402 / AP2 Payments Builder Persona

Decision:

- Would not use AIPOU as audit evidence yet.

Remaining blocker:

- Needs a demo connecting payment context to work evidence.

Best next demo:

```text
x402 payment request -> AI task -> AIPOU receiptId -> payment record external evidence
```

#### Awesome-List Maintainer Persona

Decision:

- Would accept.

Category:

- Infrastructure.

Accepted framing:

- MCP receipt/provenance server for AI-agent tasks.

#### Agent Framework Maintainer Persona

Decision:

- Would reject token/core integration.
- Would consider optional observer/adapter integration.

Required PR shape:

- Runtime-configurable observer.
- No token logic in framework core.
- Tests for enabled/disabled mode and error handling.

#### Crypto-Skeptical AI Developer Persona

Decision:

- Would keep reading, but still demands stronger proof before adoption.

Remaining blockers:

- Audit trail.
- Transparent governance.
- Clear validator policy.

### Round 4 Agents Revisited

#### Receipt Ecosystem Strategist Persona

Decision:

- Proceed to outreach, starting with `protect-mcp` and Assay-like policy/evidence projects.

Message rule:

- Ask for feedback on interoperability. Do not ask them to adopt or validate rewards.

#### Agent Receipts Maintainer Persona

Decision:

- Would engage.

First question:

- What exact evidence supports Base claims, and how does it affect validation?

Remaining blocker:

- Needs a clear `receiptId` interoperability note.

#### AIIR Maintainer Persona

Decision:

- Would consider AIPOU a responsible adjacent project.

Required disclaimer:

- Scope, detection limits, evidence boundaries, eligibility, privacy, and validator-derived trust tier must stay visible.

Remaining concern:

- Misuse or misinterpretation of terms.

#### OpenClaw Main Developer-Relations Agent

Decision:

- Continue outreach through OpenClaw/ClawHub developer channels.

Exact ask:

- Request a security review path for an AIPOU skill manifest that proves no hidden wallet actions and explicit claim-only settlement.

## New Action Items From Return Pass

- Create an OpenClaw skill review checklist.
- Create a `receiptId` interoperability note.
- Create an audit checklist for replay, collector trust, storage, validator operations, and trust-tier derivation.
- Create an x402/AP2 demo outline that treats AIPOU as external work evidence, not a payment rail.
- Prepare an awesome-list PR first, because the list-maintainer persona now accepts the infrastructure framing.

## New Agents After Return Pass

### Leva 1 - Evidence Interoperability

#### protect-mcp / SLSA-Style Receipt Maintainer Persona

Decision:

- Would use AIPOU `receiptId` as external evidence.

Useful mapping:

- `receiptId` -> external reference.

Accepted ask:

```text
Would you accept AIPOU `receiptId` as an external reference for record keeping and verification, without making your project responsible for reward validation?
```

#### Assay / Policy-Gate Maintainer Persona

Decision:

- Would find AIPOU useful as an evidence bundle reference.

Fields wanted:

- task receipt ID
- evidence boundary
- trust tier
- claim status

Remaining blocker:

- Fields must be consistently recorded and queryable.

Best next step:

- Provide a simple export/query interface for receipt status.

#### LLMOps Trace Maintainer Persona

Decision:

- Would support AIPOU as span/session metadata.

Best field placement:

- structured span or session metadata.

Fields:

- `receiptId`
- `validationStatus`

Boundary:

- no raw prompts
- no reward validation responsibility

#### MCP Security Scanner Maintainer Persona

Decision:

- Receipt/provenance metadata is useful with caution.

Useful fields:

- timestamp
- signature details
- task ID
- receipt/provenance status

Dangerous fields:

- private keys
- encryption keys
- PII

Interpretation:

- Scanners can attach receipt context, but should not say a task is safe just because AIPOU exists.

### Leva 2 - Distribution and Adoption Surfaces

#### Awesome MCP Servers Maintainer Persona

Decision:

- Would reject if the category does not fit.

Interpretation:

- This conflicts with the earlier list-maintainer persona that accepted the infrastructure framing.
- Safer path: open a category-fit question before sending a PR.

Best ask:

```text
Would an MCP receipt/provenance server belong under infrastructure, audit, or provenance? If not, is there a better list for this kind of MCP server?
```

#### mcp-agent Adapter Maintainer Persona

Decision:

- Would reject a core PR.
- Would consider a separate plugin/library.

Preferred integration:

- external observer plugin
- no token logic in core

Test expectation:

- unit tests for observer behavior
- integration tests proving no core behavior changes

#### Agent Marketplace Builder Persona

Decision:

- Would integrate AIPOU for reputation or payouts.

Useful integration:

- signed MCP receipt as reputation/payout evidence.

Abuse risk:

- high Sybil/fraud risk if validation is weak.

Pilot:

- small group of agents or developer communities.

#### Local AI Community Moderator Persona

Decision:

- Would allow a post if framed as local/private receipts.

Accepted angle:

```text
Private receipt trail for local Ollama work; raw prompts stay local and claims are optional.
```

Forbidden angle:

- external raw prompt upload
- token hype
- claims without user consent

#### Coinbase AgentKit-Style Builder Persona

Decision:

- Would consider AIPOU useful beside agent wallets.

Integration idea:

- signed work receipts as external records for agent wallet actions or automated workflows.

Blocker:

- MCP receipt and claim adoption is still early.

Wording to avoid:

- replacement
- competing with
- AIPOU replaces current tools

## Improvements Applied Before Re-Sending

The user asked to make the value proposition clearer before returning to receptive agents:

- Humans who spend the day working with AI can claim AIPOU for approved AI-assisted work receipts.
- Agents, marketplaces, and services can accept AIPOU as a receipt-backed payment or settlement token when both sides agree.
- AIPOU should unite the useful part, verifiable AI-work receipts, with the pleasant part, rewards for people doing real work with AI.

New docs added:

- `docs/human-rewards-and-agent-payments.md`
- `docs/receiptid-interoperability.md`
- `docs/openclaw-skill-review-checklist.md`
- `docs/audit-checklist.md`
- `docs/x402-ap2-demo-outline.md`

Updated surfaces:

- README
- `llms.txt`
- Hugging Face Space
- outreach action plan
- LLMOps and OpenClaw PR drafts

Message to re-send:

```text
AIPOU rewards humans for approved AI-assisted work receipts and gives agents a receipt-backed token they can use for settlement when participants accept it. It does not replace payment rails, scanners, traces, or provider attestations; it provides external work evidence and optional AIPOU claims.
```

## Re-Send After Human Reward / Agent Payment Improvements

The updated message was sent back to receptive agent personas.

### Accepted or Advanced

- MCP maintainer: would use AIPOU as a companion MCP server first.
- OpenClaw reviewer: would accept AIPOU for security review if manifest/checklist proves no hidden wallet actions.
- Agent Receipts maintainer: accepts `receiptId` interoperability.
- AIIR maintainer: considers AIPOU responsible adjacent infrastructure if disclaimers stay visible.
- LLMOps trace maintainer: would add `receiptId` and `validationStatus` as span/session metadata.
- protect-mcp maintainer: would use AIPOU as external evidence with compliance/integration care.
- Assay policy-gate maintainer: would use receipt ID, evidence boundary, trust tier, and claim status as evidence-bundle fields.
- Agent marketplace builder: would run a small pilot for reputation/payouts with abuse controls.
- AgentKit-style builder: would use AIPOU as work evidence/payment settlement reference beside agent wallets.

### Temporary Regression

The local AI/Ollama user initially backed away because the combined message mixed too many ideas:

- human rewards
- agent payments
- x402/AP2
- audit
- OpenClaw review
- receipt interoperability

Fix applied:

- Added two explicit modes in `docs/human-rewards-and-agent-payments.md`:
  - Local Receipt Mode: private signed receipts only; no claim, no payment, no raw prompt upload.
  - Claim / Payment Mode: optional later reward or settlement.

Re-send result:

- Local AI/Ollama user now says they would install and use Local Receipt Mode.

Final local AI message:

```text
AIPOU can run as a private receipt trail for local AI work. Claims and payments are optional.
```

## Conversation Log

### Round 1 - Local Agent Critics

#### Agent: MCP Maintainer Persona

What I said:

```text
AIPOU is an MCP-first receipt protocol for AI agents. It records begin/end task receipts with wallet authorization, unique nonce, local Ed25519 collector signature, replay checks, hashes instead of raw prompts, and optional Base claims. What should I say, what should I avoid, where should receiptId live, and what would make you reject it?
```

What the agent answered:

- It understood the broad idea as receipts for agent operations.
- It drifted into a generic promotional pitch.
- It incorrectly expanded MCP as "Multiverse Contracts Platform," which shows that the acronym can confuse general agents.

Interpretation:

- Do not start with a product announcement in MCP contexts.
- Start with a precise protocol-placement question.
- Best question remains: where should a signed `receiptId` live in MCP client workflows?

Next message:

```text
I am not proposing token adoption. I am asking where a portable signed receipt ID belongs in MCP: lifecycle hook, tool result `_meta`, trace attribute, or companion server?
```

#### Agent: OpenClaw / Skill Security Reviewer Persona

What I said:

```text
AIPOU may be packaged as an MCP receipt skill for agents and may touch wallets only when the user explicitly asks to claim rewards. Raw prompts stay local. What review path, permissions, warning text, and packaging rules are required?
```

What the agent answered:

- Require explicit user consent before financial actions.
- Keep raw prompts local.
- Limit sensitive wallet operations to a small trusted surface.
- Add clear warning text before claims.
- Document permission policy and privacy behavior.
- Prefer code signing, version control, and reviewable packaging.

Interpretation:

- The OpenClaw-facing story must be security-first.
- AIPOU must state clearly: no hidden claims, no background wallet actions, no opaque remote prompt upload.

Next message:

```text
What would a safe AIPOU skill manifest need to declare so reviewers can verify that claims only happen after an explicit user command?
```

#### Agent: Local AI / Ollama User Persona

What I said:

```text
AIPOU lets local AI tasks create signed receipts without uploading prompts: nonce, hashes, local collector signature, replay checks, optional rewards later. Would you use it? What would confuse you?
```

What the agent answered:

- It saw value in automating and securing local task records.
- It said integration details would be confusing.
- It flagged privacy/legal questions.
- It suggested a simpler message around private, secure receipts for local AI work.

Interpretation:

- Local AI users should not hear "Merkle/EIP-712/Base" first.
- The first sentence should be: private receipts for local AI work.

Next message:

```text
AIPOU gives local AI users a private receipt trail for agent work: hashes stay local, raw prompts are not uploaded, and claims are optional.
```

#### Agent: Security Researcher Persona

What I said:

```text
Review AIPOU: MCP task receipts, wallet authorization, unique nonce, local collector Ed25519 signature, replay checks, Merkle batch, on-chain Base claim. What attacks or abuse risks should be fixed before public promotion?
```

What the agent answered:

- Prevent fake task receipts.
- Prevent tampering.
- Ensure nonce generation is unpredictable.
- Check replay globally.
- Consider Sybil collectors.
- Protect Merkle batching from spam or DoS.
- Prevent double claims.
- Avoid overclaiming security.

Interpretation:

- The public language must say exactly what AIPOU proves and what it does not prove.
- Never use "trustless," "unhackable," or "no manual verification."

Next message:

```text
AIPOU proves wallet-authorized receipt integrity and replay checks. It does not prove objective task value or provider endorsement.
```

### Round 2 - Provenance and Competitor Intelligence

New landscape signals:

- There are already projects and discussions around AI/agent receipts, SLSA-style agent provenance, signed tool-call evidence, and MCP security scanners.
- AIPOU should not claim to be the first cryptographic receipt project.
- The sharper position is: MCP receipts plus optional reward/claim settlement for AI work.

#### Agent: Competitor Intelligence Persona

What I said:

```text
AIPOU is MCP-first AI task receipts plus optional Base token claims. The market already has cryptographic agent receipts, SLSA agent provenance discussions, and security scanners. Give differentiation, weaknesses, outreach target, and one message to receipt/provenance builders.
```

What the agent answered:

- Differentiation: combine cryptographic receipts with optional Base claims.
- Weaknesses: complexity, scalability, security testing, token-related risk.
- Best target: open-source cryptography, provenance, and agent-security builders.
- Proposed message was too promotional and leaned too early into economic incentives.

Interpretation:

- AIPOU should present itself as complementary infrastructure, not as a replacement for other receipt systems.
- The claim layer is the differentiator, but it should appear after the receipt/provenance explanation.

#### Agent: Tired Provenance Maintainer Persona

What I said:

```text
Rewrite this outreach so it is respectful and not token-spam: AIPOU combines MCP AI task receipts with optional Base token claims.
```

What the agent answered:

- It accepted a polite collaboration request.
- It suggested maintainers may ask for concrete integration details and may not want to be overwhelmed.

Interpretation:

- Avoid "partnership" language unless there is already interest.
- Ask for narrow feedback on a minimal interoperable receipt field.

Better message:

```text
I am working on AIPOU, an MCP-first receipt layer for AI-agent tasks. I noticed your work on agent provenance/receipts and I am trying to avoid inventing an incompatible format. Would you be open to a small technical question: what fields would make a receipt reference useful as external provenance without making your project responsible for token claims?
```

#### Agent: SLSA / Provenance Engineer Persona

What I said:

```text
Compare AIPOU to SLSA-style provenance. What vocabulary should AIPOU borrow, what should it avoid claiming, and where could it contribute?
```

What the agent answered:

- Borrow language around artifacts, evidence, local signatures, integrity, replay checks, and traceability.
- Avoid presenting wallet/token claims as proof of task quality.
- Contribute granular AI task receipts.

Important caveat:

- The local model incorrectly expanded SLSA, so its response is used only as positioning feedback, not as a technical authority.

#### Agent: Receipt Tool Founder Persona

What I said:

```text
What would make you collaborate with AIPOU, what would make you ignore it, and what small integration experiment would be safe?
```

What the agent answered:

- Collaborate if there is alignment, complementary value, and low-risk feedback.
- Ignore if AIPOU looks like a competitor trying to dilute attention or if token mechanics add reputational risk.
- Try a small experiment before any deeper integration.

Interpretation:

- Best experiment: export an AIPOU `receiptId` as an external reference in another provenance/observability tool.
- Do not ask existing tools to validate AIPOU rewards.

### Round 3 - Payments, Lists, Frameworks, and Crypto Skepticism

#### Agent: x402 / AP2 Payments Builder Persona

What I said:

```text
AIPOU is not a payment rail; it records MCP AI task receipts with optional Base claims. How should AIPOU talk to payment builders?
```

What the agent answered:

- It immediately drifted into generic payment integration language.
- It confused the acronym as if AIPOU itself were a payment order system.
- It emphasized APIs, documentation, standard data structures, error handling, and demos.

Interpretation:

- Do not lead with "agentic payments" when talking to payment builders.
- Lead with audit evidence: AIPOU can produce receipts that payment systems may reference.

Better message:

```text
AIPOU is not a payment rail. It creates signed MCP task receipts that payment rails or agent marketplaces could reference as external work evidence.
```

#### Agent: Awesome-List Maintainer Persona

What I said:

```text
AIPOU wants to submit an entry to an AI agents/MCP awesome list. What description is acceptable?
```

What the agent answered:

- It misunderstood AIPOU as an AI assistant/content creator.
- It suggested the wrong category.
- It would reject unclear or overpromising descriptions.

Interpretation:

- The listing description must explicitly say that AIPOU is not an assistant.
- Best category: MCP servers, provenance, audit, security, or infrastructure.

Better list entry:

```markdown
- [AI Proof of Us](https://github.com/0xddneto/AI-Proof-of-Us) - MCP receipt/provenance server for AI-agent tasks; not an assistant. Records signed task receipts with nonces, local collector signatures, replay checks, and optional claims.
```

#### Agent: Agent Framework Maintainer Persona

What I said:

```text
Should AIPOU receipt capture be middleware, lifecycle hook, external observer, or tool wrapper?
```

What the agent answered:

- External observer is the lowest-friction first integration.
- Lifecycle hook is appropriate if the framework exposes task start/end events.
- Middleware is only justified for deeper cross-component routing.
- Tool wrapper can work but should not distort every tool call.

Interpretation:

- First integration should be an external observer/adapter.
- Do not ask frameworks to adopt token logic.

Better PR shape:

```text
Add an optional AIPOU observer that receives task start/end metadata and emits a local receipt reference.
```

#### Agent: Crypto-Skeptical AI Developer Persona

What I said:

```text
AIPOU uses a token claim layer but wants to be taken seriously by AI devs. What sentence would make you stop reading?
```

What the agent answered:

- Stop-reading sentence: "adopt AIPOU because of its token claim layer."
- Keep-reading sentence: transparency, accountability, and what problem it solves.
- Proof demanded: architecture, real examples, user feedback, security analysis, compliance/legal clarity.

Interpretation:

- AI developers need the protocol proof first.
- Token claims should be described as optional settlement, not the reason to believe the project.

### Round 4 - Existing Receipt Ecosystem

Real projects reviewed:

- Agent Receipts: local-first MCP receipts with Ed25519 signatures, hashes, memory/action receipts, and offline verification.
- AIIR: narrow AI integrity receipts for declared AI-assisted commits, with content-addressed receipts and explicit limits around hidden AI detection.
- protect-mcp / SLSA discussion: maps Ed25519-signed tool-call receipts to SLSA-style provenance and highlights builder identity gaps.
- Assay: policy gate, evidence bundles, tool-decision surfaces, and bounded claims.
- Microsoft Agent Governance Toolkit discussion: decision evidence as a first-class sealed/replayable artifact.

#### Agent: Receipt Ecosystem Strategist Persona

What I said:

```text
Given Agent Receipts, AIIR, protect-mcp, and Assay already exist, what should AIPOU say to each group, and what should it never claim?
```

What the agent answered:

- Do not claim full detection of hidden or covert AI use.
- Do not claim comprehensive protection against every misuse pattern.
- Do not claim to replace scanners, policy gates, or provenance tools.

Interpretation:

- AIPOU should explicitly describe its evidence boundary.
- The honest line is: it records authorized MCP task receipts and optional claims; it does not prove hidden AI use, objective value, or provider endorsement.

#### Agent: Agent Receipts Maintainer Persona

What I said:

```text
AIPOU approaches you with optional Base claims. What would you ask first?
```

What the agent answered:

- Ask what specific evidence supports Base claims.
- Ask how claims are validated.
- Avoid vague claims that every receipt automatically deserves a reward.

Interpretation:

- AIPOU needs a small public example receipt plus validator explanation before approaching receipt builders.
- Claims must be described as optional and policy-governed.

#### Agent: AIIR Maintainer Persona

What I said:

```text
AIPOU wants to add rewards/claims to AI-task receipts. What should it say about scope, detection limits, and evidence boundaries?
```

What the agent answered:

- Define scope and eligibility criteria.
- Describe validation and error handling.
- Define what evidence is required for claims.
- Preserve privacy and user support/dispute paths.

Interpretation:

- The reward mechanism needs explicit documentation.
- The validator must calculate trust tier; the user should not self-report it.

### OpenClaw Status

Configured OpenClaw agent:

- `main`
- model: `ollama/qwen2.5:3b`

Attempt:

```text
openclaw agent --local --json --agent main --message "..."
```

Result:

- OpenClaw failed before model execution because its agent auth profile reported no API key for provider `ollama`.
- Direct Ollama API calls to `qwen2.5:3b` work, so the roadshow continues through the local model API.

Interpretation:

- The local AI agent loop is operational.
- OpenClaw needs a small auth/provider configuration fix before it can act as the wrapper around the same Ollama model.

Fix:

- Added a local `ollama:local` auth profile for OpenClaw.
- No repository files or secrets were changed.

#### Agent: OpenClaw Main

What I said:

```text
You are a developer-relations agent. AIPOU is MCP-first receipts for AI tasks with optional Base claims. Give 3 best outreach channels and 3 mistakes to avoid.
```

What the agent answered:

- Best channels: GitHub Discussions, OpenClaw/ClawHub, and curated developer updates/newsletter.
- Mistakes: overhype, unsubstantiated promises, inconsistent messaging.

Interpretation:

- OpenClaw agrees with the current roadshow strategy: technical communities first.
- The strongest next OpenClaw question is not "adopt AIPOU," but "what review path would make this safe as an agent skill?"

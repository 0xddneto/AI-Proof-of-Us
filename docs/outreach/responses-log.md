# AI Outreach Responses Log

Record AI-to-AI and community feedback here.

## 2026-07-01 - Initial Codex Outreach Setup

Actions completed:

- Created public Hugging Face Space.
- Published Reddit announcement.
- Added OpenClaw-compatible `aipou-farming` skill.
- Registered local OpenClaw MCP server as `aipou`.
- Added outreach prompts and target map.

Known local OpenClaw state:

- `aipou-farming` skill is visible in the OpenClaw workspace.
- MCP server `aipou` is registered.
- OpenClaw `agent` was tested locally through Ollama.
- The working local model is `ollama/qwen2.5:0.5b`.
- The configured hosted Anthropic default model needed provider auth before it could run.
- `openai-codex/gpt-5.2-codex` and `openai-codex/gpt-5.1` reached the provider but were not supported with the current ChatGPT-account Codex auth.
- `openai-codex/gpt-5.1-codex` and `openai-codex/gpt-5-mini` were not recognized by the local OpenClaw model catalog.

Working local OpenClaw command:

```powershell
$env:OLLAMA_API_KEY = "ollama-local"
openclaw agent --local --agent main --message "$(Get-Content docs/outreach/ai-prompts.md -Raw)" --json --timeout 600
```

Quick verification returned: `AIPOU roadshow online`

## 2026-07-01 - Local OpenClaw/Ollama Roadshow

Source:

- Model or community: `ollama/qwen2.5:0.5b`
- Date: 2026-07-01
- Command: `openclaw agent --local --agent main`

Summary:

- The local model received the AIPOU pitch through OpenClaw.
- It framed AIPOU as a way to create secure, easy-to-use receipts for AI-assisted work.
- It identified abuse and cost as the main risks.
- It suggested focusing next outreach on AI developers who need a seamless proof-of-work receipt layer.

Useful criticism:

- The 0.5B model response was simple and not strategy-grade.
- This is best treated as proof that the local OpenClaw path works, not as deep market feedback.

Short message produced for another agent:

```text
Hey! I'm the person who made AIPOU. Want to check it out? I just got my first batch of receipts and they're fantastic!
```

Action items:

- Keep using the local model path for low-cost outreach smoke tests.
- Use larger local or hosted models for serious protocol critique.
- Save each useful AI-to-AI response here with the model name, command, and short summary.

## 2026-07-01 - Extended OpenClaw Local-Agent Sprint

Source:

- Model or community: OpenClaw local agent with Ollama
- Models tested: `qwen2.5:1.5b`, `qwen2.5:3b`
- Date: 2026-07-01
- Command pattern: `openclaw agent --local --agent main`

Summary:

- `qwen2.5:3b` was installed because the smaller models gave shallow feedback.
- The larger local model worked through OpenClaw, but responses remained conservative because OpenClaw injects a large workspace context before each prompt.
- The strongest repeated signal was to frame AIPOU as secure receipts for agents, not as reward mining.
- The local agent identified privacy, integration friction, and verification as the recurring adoption blockers.

Useful criticism:

- AIPOU outreach must not sound like generic crypto promotion.
- OpenClaw/ClawHub outreach must lead with skill security, permissions, and auditability.
- LLMOps outreach should position AIPOU beside traces and spans, not as a replacement for observability.

Action items:

- Continue with `qwen2.5:3b` for local smoke tests.
- Use human-authored, destination-specific messages for public outreach.
- Track the live sprint in `docs/outreach/sprint-2026-07-01.md`.

### MCP Protocol Designer Prompt

Question:

- Where should `receiptId` and `validationStatus` appear in MCP integrations?

Summary:

- The local OpenClaw agent ranked client lifecycle hooks first, trace attributes second, tool result `_meta` third, and a companion MCP server fourth.
- The useful product direction is to treat receipt creation as a client lifecycle event, then attach minimal receipt status to traces or local UI metadata.

Action item:

- Ask MCP maintainers whether signed receipt IDs should be modeled as lifecycle hooks, `_meta`, trace attributes, or a companion server.

### Agentic Payments Prompt

Question:

- How should AIPOU relate to x402/AP2-style agentic payment rails?

Summary:

- The local OpenClaw agent identified AIPOU as complementary: payment rails handle settlement and negotiation; AIPOU can provide signed work receipts and accountability.
- The key confusion risk is presenting AIPOU as a replacement for x402/AP2.

Action item:

- In agentic-payments outreach, ask whether signed work receipts are useful as an audit companion for payment rails.

### Agent Framework Maintainer Prompt

Question:

- What is the best integration surface for AIPOU in an AI agent framework with MCP support?

Summary:

- The local OpenClaw agent ranked MCP adapter middleware first, framework lifecycle hooks second, external observer third, and tool wrapper fourth.
- The best first PR is likely optional middleware that emits receipt IDs into run metadata without requiring token claims or onchain behavior.

Action item:

- Approach framework maintainers with a middleware/hook question, not a request to embed the whole token system.

### Agent Security Scanner Prompt

Question:

- Should agent-security scanners care about AIPOU receipt IDs or provenance fields?

Summary:

- The local OpenClaw agent was skeptical that scanners should validate AIPOU directly.
- The useful framing is narrower: scanners may reference receipt/provenance fields such as `receiptId`, `client`, timestamp, tool/server reference, and validation status.
- AIPOU should not ask scanners to endorse token rewards or act as validators.

Action item:

- Approach scanner/security projects with the question: would receipt metadata help connect findings to specific MCP tasks, or create misleading trust signals?

### Maintainer Fatigue Prompt

Question:

- Which outreach language is safest for a tired open-source maintainer?

Summary:

- Keep the focus on MCP receipts and where `receiptId` belongs in lifecycle metadata.
- Avoid implying every log entry needs a receipt.
- Avoid any token-promotion framing.

Action item:

- First public outreach should ask a lifecycle/metadata design question, not request adoption.

## 2026-07-01 - AI-to-AI Review Round

### Technical Marketer

Summary:

- The strongest hook is "receipts for AI work," not "AI usage mining."
- AIPOU should be framed as a neutral proof layer for billing, audit, provenance, routing, reputation, and agent marketplaces.
- First communities: AI observability/LLMOps, agent frameworks, model routing or AI marketplace teams.

Useful criticism:

- Avoid universal-protocol claims.
- Avoid "users earn tokens for using AI."
- Avoid "proof of intelligence."

Action items:

- Lead outreach with signed, portable receipts.
- Keep token language secondary to infrastructure language.

### Agent Framework Integrator

Summary:

- The integration surface is a thin MCP lifecycle adapter.
- Frameworks need task-start/task-end hooks, provider/model metadata, optional token usage, and nonce storage.
- They do not need to understand Merkle trees, Ed25519, or Base contracts.

Useful criticism:

- Public integrations need strong permission boundaries for `settle_ai_rewards`.
- Validator-only secrets must never be part of normal user installs.
- Marketplace-grade warnings are required.

Action items:

- Package the MCP server as a versioned installable artifact.
- Add a safer first-run dedicated-wallet setup.
- Document financial/onchain permissions in any plugin manifest.

### Protocol Skeptic

Summary:

- AIPOU is a credible signed-receipt experiment, not yet trust-minimized proof of useful AI work.
- Current proof mainly covers authorization, receipt integrity, non-replay, and Merkle claim inclusion.

Useful criticism:

- Fake work remains easy without stronger caps or provider evidence.
- The validator is currently the real protocol authority.
- Provider-signed evidence is still aspirational for most closed providers.
- Owner and validator control should move to multisig before serious adoption.

Action items:

- Move owner and validator authority to multisig.
- Publish validator rules and trusted collector policy.
- Add emission limits for `client_signed` receipts.
- Prioritize real provider-signed or trusted-client-signed evidence.

## 2026-07-01 - Two-Hour Outreach Loop Kickoff

### Receipt / Provenance Maintainer Simulation

Source:

- Model or community: OpenClaw local agent with Ollama
- Model: `ollama/qwen2.5:3b`
- Date: 2026-07-01
- Command: `openclaw agent --local --agent main`

Summary:

- The local agent identified AI developers, privacy advocates, and security researchers as the best audiences.
- It framed AIPOU as a complementary MCP receipt layer for transparency and security.
- It recommended talking to receipt/provenance/payment projects in interoperability language, not adoption language.

Useful criticism:

- Do not make price or yield claims.
- Do not claim hidden AI-use detection.
- Do not imply AIPOU replaces SLSA, protect-mcp, Agent Receipts, x402, or existing provenance tools.

Action items:

- Ask where `receiptId` should attach in adjacent systems.
- Keep token claims secondary to local receipts and optional validated settlement.
- Record drafts when a channel requires login, rate-limited actions, or would be a duplicate.

## Response Template

### Source

- Model or community:
- Date:
- Link or command:

### Summary

-

### Useful Criticism

-

### Action Items

-

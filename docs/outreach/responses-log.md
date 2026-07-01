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

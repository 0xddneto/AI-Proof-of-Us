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
- OpenClaw `agent` was tested locally.
- The configured Anthropic default model needs provider auth before it can run.
- `openai-codex/gpt-5.2-codex` and `openai-codex/gpt-5.1` reached the provider but are not supported with the current ChatGPT-account Codex auth.
- `openai-codex/gpt-5.1-codex` and `openai-codex/gpt-5-mini` were not recognized by the local OpenClaw model catalog.
- The OpenClaw default model was restored to `anthropic/claude-opus-4-6`.

Suggested next OpenClaw command after adding a supported provider credential:

```bash
openclaw agent --local --agent main --message "$(cat docs/outreach/ai-prompts.md)" --json --timeout 600
```

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

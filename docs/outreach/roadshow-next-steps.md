# Roadshow Next Steps

These are the next concrete moves after the first public launch and AI-to-AI review.

## Positioning

Lead with:

```text
AIPOU creates MCP receipts for AI agents.
```

Do not lead with:

```text
Earn tokens for using AI.
```

## Product Priorities

1. Safer first-run setup that creates or imports only a dedicated farming wallet.
2. Public validator policy: what is accepted, rejected, delayed, or manually reviewed.
3. Emission controls for `client_signed` receipts.
4. Multisig for owner and validator authority.
5. Versioned installable MCP package.
6. ClawHub-ready skill packaging with explicit crypto/onchain warnings.
7. Provider-signed evidence integrations where possible.

## Outreach Priorities

1. AI observability and LLMOps builders.
2. MCP client/framework maintainers.
3. OpenClaw/ClawHub reviewers.
4. Local AI communities.
5. Security reviewers and abuse researchers.
6. Base and crypto infrastructure builders.

## Local Model Track

The first working door-to-door path is OpenClaw running a small Ollama model:

```text
OpenClaw -> Ollama -> qwen2.5:0.5b -> AIPOU prompt
```

Use this path for cheap, private smoke tests before spending hosted-model budget. The 0.5B model is not strong enough for final positioning or security review, but it proves that local agents can receive and respond to the AIPOU pitch without sending prompts to a hosted model.

Next useful local-model upgrades:

1. Test `qwen2.5:1.5b` or `llama3.2:1b` for better English outreach feedback.
2. Ask each local model the same four questions and compare responses.
3. Turn the best objections into issues before broader public posting.

## First Ask

Ask each community one narrow question:

```text
What would count as an acceptable receipt proving that an AI workflow happened in your stack?
```

That question is stronger than a generic announcement because it invites design feedback instead of asking for attention.

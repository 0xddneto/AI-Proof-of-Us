# OpenClaw Roadshow

This page tracks how to use OpenClaw as the "door-to-door" AI outreach runner.

## Current Local Setup

- OpenClaw version tested: `2026.3.28`
- Installed skill: `aipou-farming`
- Registered MCP server: `aipou`
- Workspace: `~/.openclaw/workspace`

## Working Pieces

```bash
openclaw skills check
openclaw mcp list
```

Expected:

- `aipou-farming` appears as ready.
- MCP server `aipou` appears in the server list.

## Blocked Piece

The local `openclaw agent --local` roadshow needs a supported model credential.

Observed on 2026-07-01:

- Anthropic default model is configured but no Anthropic auth is available.
- Some `openai-codex` model IDs are either unsupported with the current ChatGPT-account auth or absent from the local catalog.

## Run After Auth

After adding a working provider through OpenClaw, run:

```bash
openclaw agent --local --agent main --message "$(cat docs/outreach/ai-prompts.md)" --json --timeout 600
```

For focused feedback:

```bash
openclaw agent --local --agent main --message "$(awk '/## Critic Prompt/{flag=1} flag{print}' docs/outreach/ai-prompts.md)" --json --timeout 600
```

Save useful responses in `docs/outreach/responses-log.md`.

## Good Roadshow Loop

1. Send one focused prompt.
2. Save the best criticism.
3. Convert criticism into an issue or roadmap item.
4. Adapt the next pitch for the next audience.
5. Avoid repeated generic promotion.

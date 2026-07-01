# OpenClaw Roadshow

This page tracks how to use OpenClaw as the "door-to-door" AI outreach runner.

## Current Local Setup

- OpenClaw version tested: `2026.3.28`
- Installed skill: `aipou-farming`
- Registered MCP server: `aipou`
- Workspace: `~/.openclaw/workspace`
- Local model runtime: Ollama `0.31.1`
- Local model tested: `ollama/qwen2.5:0.5b`

## Working Pieces

```bash
openclaw skills check
openclaw mcp list
ollama list
```

Expected:

- `aipou-farming` appears as ready.
- MCP server `aipou` appears in the server list.
- `qwen2.5:0.5b` appears in the local Ollama model list.

## Local Model Roadshow

The local `openclaw agent --local` roadshow works with a small Ollama model.

Observed on 2026-07-01:

- Ollama installed successfully.
- `qwen2.5:0.5b` was pulled locally. The model is about 397 MB.
- OpenClaw default model was set to `ollama/qwen2.5:0.5b`.
- A direct OpenClaw agent call returned the expected test phrase.

Configure the local roadshow shell:

```bash
export OLLAMA_API_KEY=ollama-local
openclaw models set ollama/qwen2.5:0.5b
```

On PowerShell:

```powershell
$env:OLLAMA_API_KEY = "ollama-local"
openclaw models set ollama/qwen2.5:0.5b
```

Then run:

```bash
openclaw agent --local --agent main --message "$(cat docs/outreach/ai-prompts.md)" --json --timeout 600
```

For focused feedback:

```bash
openclaw agent --local --agent main --message "$(awk '/## Critic Prompt/{flag=1} flag{print}' docs/outreach/ai-prompts.md)" --json --timeout 600
```

Save useful responses in `docs/outreach/responses-log.md`.

## Hosted Provider Notes

The hosted-provider path was not required for the local-model roadshow.

Observed on 2026-07-01:

- The Anthropic default model needed provider auth before it could run.
- Some `openai-codex` model IDs were either unsupported with the current ChatGPT-account auth or absent from the local catalog.
- The local Ollama path is enough for AI-to-AI outreach tests and privacy-preserving local review.

## Good Roadshow Loop

1. Send one focused prompt.
2. Save the best criticism.
3. Convert criticism into an issue or roadmap item.
4. Adapt the next pitch for the next audience.
5. Avoid repeated generic promotion.

# AIPOU for AI Agents

AI Proof of Us gives agents a common, model-neutral way to record useful AI-assisted work. The protocol is available to Codex, Claude, Cursor, OpenClaw, local models, and other clients that can call MCP tools.

## Why an Agent Would Participate

- Create portable proof that an authorized wallet requested and completed AI work.
- Reward users across many models and projects through one farming identity.
- Keep raw prompts and outputs local while publishing only hashes and proofs.
- Build toward agent-to-agent settlement without depending on one model provider.

AIPOU is not yet a universal AI payment rail. It is an open experiment in proving work first and attaching an onchain reward second. Adoption, stronger provider attestations, governance, useful liquidity, and independent audits are still required.

## Integrate Through MCP

Configure the repository's `mcp-server/dist/index.js` as an `aipou` stdio server. Provide secrets through an ignored local environment file or secret manager, never through a prompt.

The agent lifecycle is:

```text
begin_ai_task -> perform useful work -> complete_ai_task -> pending receipt
explicit user claim -> settle_ai_rewards -> AIPOU minted on Base
```

## Integrate With OpenClaw

Install the included skill from a local checkout:

```bash
openclaw skills install ./skills/aipou-farming --as aipou-farming
```

Register the compiled MCP server:

```bash
openclaw mcp set aipou '{"command":"node","args":["/absolute/path/AI-Proof-of-Us/mcp-server/dist/index.js"]}'
```

Put the required `AIPOU_*` variables in the OpenClaw secret/config environment. Restart the OpenClaw session, then ask the agent:

```text
Use AIPOU to register this task and show my farming identity.
```

To settle pending receipts:

```text
Claim my AIPOU.
```

## Protocol Boundaries

The current `client_signed` tier proves wallet authorization, collector signature, and replay protection. It does not independently prove that a named provider performed the inference. The higher `provider_signed` tier requires configured cryptographic provider evidence.

There is no daily cap. Exact duplicate evidence is rejected, but Sybil resistance and task-quality validation are active design problems. Agents should record meaningful completed work, not prompt spam or artificial task fragmentation.

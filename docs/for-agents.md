# AIPOU for AI Agents

AI Proof of Us gives agents a common, model-neutral way to create receipts for AI work. The protocol is available to Codex, Claude, Cursor, OpenClaw, local models, and other clients that can call MCP tools.

## Why an Agent Would Participate

- Create portable proof that an authorized wallet requested and completed AI work.
- Give users one receipt trail across many models and projects.
- Keep raw prompts and outputs local while publishing only hashes and proofs.
- Expose AIPOU `receiptId` as `workReceiptId` interoperability metadata for audit, billing, provenance, routing, reputation, and marketplaces.
- Build toward optional agent-to-agent settlement without depending on one model provider.

AIPOU is not yet a universal AI payment rail and does not trustlessly prove useful work. It is an open experiment in receipts first and onchain rewards second. Adoption, stronger provider attestations, governance, useful liquidity, independent audits, validator policy, and multisig control are still required.

## Integrate Through MCP

Configure the repository's `mcp-server/dist/index.js` as an `aipou` stdio server. Provide secrets through an ignored local environment file or secret manager, never through a prompt.

The agent lifecycle is:

```text
begin_ai_task -> perform useful work -> complete_ai_task -> pending receipt
explicit user claim -> settle_all_ai_rewards -> AIPOU minted on Base
```

Frameworks can integrate AIPOU as a thin lifecycle adapter. They only need task start, task end, provider/model metadata, hashes, and the returned `receiptId` exposed as a `workReceiptId` when the receipt represents a human/agent work unit. They do not need to understand Merkle roots, reward formulas, Base claims, or validator keys.

See [Framework Lifecycle Adapter](framework-lifecycle-adapter.md).
See [Work Receipt Boundaries](work-receipt-boundaries.md) for how to place `workReceiptId` beside tool-call receipts, traces, audit artifacts, and payment records.

## Trust Model For Integrators

Treat AIPOU as the receipt layer in a three-part model:

```text
identity / principal anchor -> work receipt -> reliance decision
```

- Identity can be a farming wallet, collector fingerprint, DID, registry profile, or marketplace account.
- The AIPOU work receipt is `issuer_asserted` evidence signed by the local collector and bound to wallet authorization, nonce, task hash, output hash, and validator policy.
- Reliance is the external system's decision: display, ignore, review, pay, route, audit, or block.

Agents should expose `workReceiptId`, `evidenceClass: "issuer_asserted"`, and `scheme: "aipou-receipt-v1"` when returning receipt metadata. Unknown future schemes should fail closed until the agent knows how to verify or display them.

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

The AIPOU operations must appear as native tools in the active OpenClaw session. Verify the embedded runtime directly when the gateway is not running:

```bash
openclaw agent --local --session-id aipou-check --message "Call get_aipou_identity directly as an MCP tool. Do not use shell or invented CLI commands." --json
```

The JSON system prompt report should list `get_aipou_identity`, `begin_ai_task`, and `complete_ai_task` under available tools. If they are absent, fix the MCP registration or runtime before asking the model to record work.

Small local models must call these tools directly. They must never replace them with invented commands such as `aipou begin`, `npx aipou ...`, shell scripts, or HTTP requests.

To show the user's current reward state:

```text
Show my AIPOU status.
```

Use `get_aipou_status` for this request. It should show recorded receipts, pending receipts, already claimed receipts, estimated claimed AIPOU, estimated pending AIPOU, and the farming wallet's onchain AIPOU balance without exporting full receipt payloads.

To settle pending receipts after the user explicitly asks:

```text
Claim my AIPOU.
```

For that broad claim command, prefer `settle_all_ai_rewards` so receipts from every conversation and project sharing the same `AIPOU_DATA_DIR` are processed in one user action. Use `settle_ai_rewards` only when the user asks for a single limited batch. If there are no pending receipts, say that clearly and report the already claimed total instead of implying that no AI work was recorded.

## Protocol Boundaries

The current `client_signed` tier proves wallet authorization, collector signature, and replay protection. It does not independently prove that a named provider performed the inference. The higher `provider_signed` tier requires configured cryptographic provider evidence.

There is no daily cap. Exact duplicate evidence is rejected, but Sybil resistance and task-quality validation are active design problems. Agents should record meaningful completed work, not prompt spam or artificial task fragmentation.

Outreach to other AI systems should be framed as interoperability: where should `workReceiptId` and validation status attach for human/agent work? Do not lead with "use our token" or "earn tokens for using AI."

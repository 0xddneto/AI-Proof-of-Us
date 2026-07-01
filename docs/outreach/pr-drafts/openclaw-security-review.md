# OpenClaw Security Review Draft

Target:

- OpenClaw / ClawHub maintainers, especially discussions about skill permissions, lockfiles, package safety, and agent security.

Goal:

- Ask for the safest review path before promoting AIPOU as an OpenClaw skill or agent workflow.

Suggested title:

```text
Safe review path for an AIPOU MCP receipt skill
```

Suggested message:

```markdown
I am testing AIPOU as an MCP-first receipt protocol for OpenClaw agents.

It creates signed task receipts using hashes and local signatures, then validates nonce/replay before any optional claim. Raw prompts and outputs stay local.

The user-facing reason is human: people who spend all day working with AI agents can keep private receipts and claim AIPOU for approved work. Agents or marketplaces can also accept AIPOU as settlement when both sides agree, but the skill must never hide wallet actions.

Given current concerns around agent skill security, I would like feedback before promoting it widely:

- what permissions should be declared explicitly?
- should settlement/claim actions require a visible user command?
- should network destinations be listed in a manifest?
- should receipt storage stay local by default?
- is there a preferred security-review path for a ClawHub skill that touches wallets or claims?

The intent is provenance and accountable agent work, not hidden automation.
```

Non-negotiables:

- No hidden wallet transactions.
- No background claims.
- No opaque remote prompt/output upload.
- No price, yield, or investment language.

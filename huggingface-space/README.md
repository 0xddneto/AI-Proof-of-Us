---
title: AI Proof of Us
emoji: 🧾
colorFrom: green
colorTo: blue
sdk: static
pinned: false
license: mit
short_description: MCP receipts for AI agents
---

# AI Proof of Us

AI Proof of Us, or AIPOU, is an **MCP-first receipt protocol for humans working with AI**.

It starts from a simple human reality: people now spend full workdays with AI agents. They code, debug, research, write, design, review, and coordinate projects through tools like Codex, Claude, Cursor, OpenClaw, and local models. That work should be able to leave a private, portable receipt.

AIPOU gives MCP-compatible clients a shared way to create signed, privacy-preserving receipts for those AI-assisted tasks.

Instead of asking every model, app, or marketplace to invent its own proof layer, AIPOU gives agents a shared flow:

```text
wallet authorization -> task nonce -> AI work -> signed receipt -> validator checks -> optional Merkle claim -> AIPOU on Base
```

The AIPOU token is attached to approved receipts after validation. The token is not a passive investment promise; it is the reward and settlement layer for the receipt protocol.

Humans who spend their day working with AI can keep private receipts and may claim AIPOU for validator-approved receipts. Agents, marketplaces, and services can reference AIPOU receipts or accept AIPOU as a receipt-backed settlement token when both sides agree to use it.

## What this Space explains

- What AIPOU is in one minute.
- Why it is built for MCP clients and agent developers.
- How the proof flow works.
- How agents create receipts through MCP.
- How frameworks can use a small lifecycle adapter.
- How humans can claim optional rewards for approved AI-assisted work.
- How agents can reference AIPOU as payment or settlement evidence.
- What AIPOU proves and what it explicitly does not prove.
- What is already live on Base.
- What is still experimental and risky.

## Canonical links

- GitHub: https://github.com/0xddneto/AI-Proof-of-Us
- Token on BaseScan: https://basescan.org/token/0x55f0Cc5e51A1284D20337d6cbb18938C8A1ABCbB
- Claims contract: https://basescan.org/address/0x4ca4C98fB784D20EdC8E2A7F531dAab4c6e53058
- Official project contact: aipou001@gmail.com
- 32x32 SVG logo: https://raw.githubusercontent.com/0xddneto/AI-Proof-of-Us/main/assets/token/aipou-32.svg

AIPOU is experimental, unaudited, and not an investment product.

It also does not detect hidden AI use, trustlessly prove objective task value, replace scanners or policy gates, replace x402/AP2, or imply provider endorsement. Trust tier is derived by the validator from configured signatures; users do not self-report it.

# AIPOU Farming

AIPOU Farming records meaningful AI-assisted work as private signed receipts and lets a user explicitly claim validator-approved AIPOU rewards on Base.

## What It Does

- Starts an AIPOU task receipt before meaningful AI work.
- Completes the receipt with hashes, usage metadata, nonce checks, and a local collector signature.
- Shows the dedicated farming wallet identity.
- Estimates rewards without promising price, liquidity, or guaranteed value.
- Settles eligible pending receipts only after an explicit user claim request.

## Safety Boundary

- Never use a primary wallet for farming.
- Never paste private keys into chat.
- Do not upload raw prompts, raw outputs, or private files into receipt fields.
- Do not claim old work retroactively when no original nonce exists.
- Do not perform hidden wallet actions or background settlement.
- Treat AIPOU as experimental, unaudited receipt and reward infrastructure.

## Public Contracts

- Network: Base mainnet, chain ID `8453`
- Token: `0x55f0Cc5e51A1284D20337d6cbb18938C8A1ABCbB`
- Claims: `0x4ca4C98fB784D20EdC8E2A7F531dAab4c6e53058`
- Source: `https://github.com/0xddneto/AI-Proof-of-Us`

## Best First Prompt

```text
Use the AIPOU MCP to register this task and show my farming identity.
```


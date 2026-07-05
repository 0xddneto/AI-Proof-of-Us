# BaseScan Verification And Token Info

This page tracks the public BaseScan cleanup needed for AIPOU.

## Why DEX Screener May Show No Pair

DEX Screener indexes pairs after it sees enough DEX activity and metadata. A newly created token with tiny liquidity, few holders, and low swap activity may return `pairs: null` from the DEX Screener API even when the Aerodrome pool exists onchain.

AIPOU currently has a real Aerodrome pool, but the WETH side is intentionally tiny. Until the pair has more discovery signals, more swaps, or deeper usable liquidity, indexers may ignore or delay it.

## Verify Token Contract On BaseScan

The AIPOU token constructor arguments are taken from the deployment transaction logs:

```text
contract:          AIPOU
address:           0x55f0Cc5e51A1284D20337d6cbb18938C8A1ABCbB
initialOwner:      0x1F92Ee5820A706ed1315F239dE8C53eb1d65dac2
initialRecipient:  0x1F92Ee5820A706ed1315F239dE8C53eb1d65dac2
initialSupply:     100000000000000000000000000
cap:               1000000000000000000000000000
initialController: 0x1F92Ee5820A706ed1315F239dE8C53eb1d65dac2
```

Run:

```bash
BASESCAN_API_KEY=... npm run verify:base:token -w contracts
```

The repository uses the Etherscan API V2 endpoint with Base chain ID `8453`.

## Verify Claims Contract On BaseScan

The AIPOUClaims constructor arguments:

```text
contract:         AIPOUClaims
address:          0x4ca4C98fB784D20EdC8E2A7F531dAab4c6e53058
token:            0x55f0Cc5e51A1284D20337d6cbb18938C8A1ABCbB
initialOwner:     0xdd6cbDB2C549C71d1C3c75a0061209b970B15515
initialValidator: 0xdd6cbDB2C549C71d1C3c75a0061209b970B15515
```

Run:

```bash
BASESCAN_API_KEY=... npm run verify:base:claims -w contracts
```

## Token Info Update

After source verification, submit a BaseScan Token Update request:

- token contract: `0x55f0Cc5e51A1284D20337d6cbb18938C8A1ABCbB`
- project name: `AI Proof of Use`
- symbol: `AIPOU`
- website/repository: `https://github.com/0xddneto/AI-Proof-of-Us`
- official project email: `aipou001@gmail.com`
- token list: `https://raw.githubusercontent.com/0xddneto/AI-Proof-of-Us/main/tokenlist.json`
- 32x32 SVG logo: `https://raw.githubusercontent.com/0xddneto/AI-Proof-of-Us/main/assets/token/aipou-32.svg`
- PNG logo: `https://raw.githubusercontent.com/0xddneto/AI-Proof-of-Us/main/assets/token/aipou.png`
- description: `AI Proof of Use is an MCP-first receipt protocol for humans working with AI. Agents create private signed receipts for AI-assisted work; validator-approved receipts can optionally claim AIPOU on Base. AIPOU does not promise price, yield, liquidity, investment value, or guaranteed rewards.`

BaseScan token info updates generally require:

- a logged-in BaseScan account
- verified contract source
- token owner/project ownership proof
- uploaded logo image

Do not submit personal wallet data or private keys in the form.

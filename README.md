# AI Proof of Us

AI Proof of Us is an **MCP-first receipt protocol for humans working with AI**.

It starts from a simple belief: when people spend real hours building, debugging, researching, writing, and coordinating through AI agents, that work should be able to leave a private, portable receipt.

AIPOU gives Codex, Claude, Cursor, OpenClaw, local models, and other MCP-compatible clients a shared way to create signed, privacy-preserving receipts for AI-assisted tasks.

The human reward loop is the point: people can keep receipts for the work they do with AI all day, and validator-approved receipts can claim AIPOU on Base. The protocol exists to make that claimable work more honest, portable, and useful across agents.

The developer surface is intentionally small: receipts, hashes, lifecycle hooks, and `workReceiptId` interoperability. Agents, marketplaces, and services can also reference AIPOU receipts or voluntarily accept AIPOU as settlement when both sides agree to use it.

The first version ships as:

- an MCP server that records privacy-preserving AI task receipts
- an installable OpenClaw skill for agent workflows
- docs for MCP clients, agent builders, lifecycle adapters, anti-abuse, and future attestation design
- a reward model that converts valid receipts into claimable emissions
- an ERC-20 reward token on Base: `AI Proof of Use` (`AIPOU`)

The core idea is simple:

```txt
agent starts task -> MCP creates nonce -> AI work happens -> signed receipt -> validator checks -> optional AIPOU claim
```

Start here if you are building or testing an agent integration:

- [AIPOU for AI Agents](docs/for-agents.md)
- [Framework lifecycle adapter](docs/framework-lifecycle-adapter.md)
- [Work receipt boundaries](docs/work-receipt-boundaries.md)
- [MCP tools](docs/mcp-tools.md)
- [OpenClaw skill](skills/aipou-farming/SKILL.md)
- [Local Receipt Mode demo](examples/local-receipt-mode/README.md)
- [Lifecycle adapter example](examples/lifecycle-adapter/README.md)
- [npm publication checklist](docs/npm-publication.md)
- [BaseScan verification and token info](docs/basescan-verification.md)
- [llms.txt](llms.txt), a compact machine-readable project map

Read [From AI Work to Onchain Rewards](docs/farming-and-claims.md) for the complete journey, global farming workflow, reward calculation, and one-command claim experience.
Read [Human Rewards and Agent Payments](docs/human-rewards-and-agent-payments.md) for the human reward loop and experimental agent-payment framing.
Read [AIPOU Tokenomics and Launch Transparency](docs/tokenomics.md) for supply, pool, reward, and experimental launch details.
Read [Evidence Boundaries](docs/evidence-boundaries.md) and [Claim Validation Policy](docs/claim-validation-policy.md) before proposing integrations with receipt, provenance, security, or payment projects.

Official website: https://0xddneto.github.io/AI-Proof-of-Us/
Public explainer: https://huggingface.co/spaces/0xddneto/AI-Proof-of-Us

Official project contact: aipou001@gmail.com

This is not "AI usage mining" and it is not meant to reward raw prompt spam or attract passive token speculation. AIPOU is for humans doing real work with AI and for developers who want to test whether that work can produce portable receipts across agent clients.

In plain language:

```txt
Humans work with AI -> agents create receipts -> approved receipts claim AIPOU -> agents and marketplaces may accept AIPOU as settlement.
```

## Base mainnet deployment

```txt
Contract: 0x55f0Cc5e51A1284D20337d6cbb18938C8A1ABCbB
Chain:    Base Mainnet (8453)
Token:    AI Proof of Use (AIPOU)
Supply:   100,000,000 AIPOU
Cap:      1,000,000,000 AIPOU
Logo:     assets/token/aipou.png
```

- Contract: https://basescan.org/token/0x55f0Cc5e51A1284D20337d6cbb18938C8A1ABCbB
- Verified source: https://repo.sourcify.dev/contracts/full_match/8453/0x55f0Cc5e51A1284D20337d6cbb18938C8A1ABCbB/
- Token list: https://raw.githubusercontent.com/0xddneto/AI-Proof-of-Us/main/tokenlist.json
- BaseScan SVG logo: https://raw.githubusercontent.com/0xddneto/AI-Proof-of-Us/main/assets/token/aipou-32.svg

```txt
Claims:   0x4ca4C98fB784D20EdC8E2A7F531dAab4c6e53058
Proof:    EIP-712 + Ed25519 + Merkle
Replay:   blocked by nonce and receiptId
```

- Claims contract: https://basescan.org/address/0x4ca4C98fB784D20EdC8E2A7F531dAab4c6e53058
- Verified claims source: https://repo.sourcify.dev/contracts/full_match/8453/0x4ca4C98fB784D20EdC8E2A7F531dAab4c6e53058/

## Aerodrome liquidity pool

```txt
Pool:       0x3bEA7b68Af54Da779454f82148Ef848c76F78D02
Pair:       AIPOU/WETH
Type:       Volatile
Initial LP: 100,000,000 AIPOU + 0.000632035343416403 ETH
```

- Pool: https://basescan.org/address/0x3bEA7b68Af54Da779454f82148Ef848c76F78D02

This pool was initialized with intentionally minimal ETH liquidity. Its price is highly volatile and easy to move; it should not be treated as a reliable market price until deeper liquidity is added.

The initial experimental pool buy was later returned through Aerodrome so the large early purchase would not remain as a misleading concentrated holder balance. See [AIPOU Tokenomics and Launch Transparency](docs/tokenomics.md).

## Repository layout

```txt
contracts/     ERC-20 token, deploy scripts, Hardhat tests
mcp-server/    MCP server that records AI task receipts
docs/          architecture, anti-abuse model, Base launch notes
skills/        installable agent skills, including OpenClaw
huggingface-space/  static public protocol explainer
```

## Token

```txt
Name:   AI Proof of Use
Symbol: AIPOU
Chain:  Base
Cap:    1,000,000,000 AIPOU
```

The token emission controller is `AIPOUClaims`. It mints only receipts included in a validator-published Merkle root and rejects a `receiptId` after its first claim.

AIPOU claims are optional settlement for approved receipts. They do not prove hidden AI use, objective task value, provider endorsement, provider inference without cryptographic provider evidence, or security-policy compliance.

## MCP server

The MCP server exposes tools for creating task receipts:

- `get_aipou_contract`
- `get_aipou_identity`
- `estimate_ai_reward`
- `begin_ai_task`
- `complete_ai_task`
- `export_ai_receipts`
- `settle_ai_rewards` (one limited validator batch)
- `settle_all_ai_rewards` (one-command claim path for all pending eligible receipts)

Receipts store hashes and metadata, not raw prompts or model outputs.

The dedicated farming key signs EIP-712 authorizations locally. Never paste it into a chat or use a primary wallet. The collector has a separate Ed25519 key that cannot move funds.

Frameworks do not need to understand Merkle trees, Base, or token claims to integrate the receipt layer. The minimal adapter watches task start and task end, records provider/model metadata and hashes, and exposes the AIPOU `receiptId` as `workReceiptId` for workflow metadata, traces, UI, audit exports, payment/session records, or later optional settlement.

## Quick start

### Test The Receipt Adapter

This is the fastest path for maintainers and agent-framework builders. It creates a local receipt with an ephemeral wallet and prints the `workReceiptId` object that a framework can attach to run metadata, traces, audit exports, or payment/session metadata.

```bash
npm install
npm run build -w mcp-server
cd examples/lifecycle-adapter
npm install
npm run demo
```

No claim is made. No funds move. No raw prompt or output is uploaded.

### Run The MCP Server

Install dependencies:

```bash
npm install
```

Build all packages:

```bash
npm run build
```

Run contract tests:

```bash
npm run test -w contracts
```

Run the MCP server locally:

```bash
npm run dev -w mcp-server
```

MCP clients can launch the published server with:

```bash
npx -y aipou-mcp-server
```

Publication status: `aipou-mcp-server@0.2.0` is published on npm and `io.github.0xddneto/ai-proof-of-us@0.2.0` is published to the official MCP Registry. See [docs/npm-publication.md](docs/npm-publication.md).

## Local MCP config example

Keep the farming private key in a `.env` file next to the repo and point the server at it with `DOTENV_CONFIG_PATH`. Never paste the private key into the MCP client config itself: client configs are often synced, logged, or read by other tools.

```json
{
  "mcpServers": {
    "aipou": {
      "command": "node",
      "args": ["/path/to/AI-Proof-of-Us/mcp-server/dist/index.js"],
      "env": {
        "DOTENV_CONFIG_PATH": "/path/to/AI-Proof-of-Us/.env",
        "AIPOU_DATA_DIR": "/path/to/AI-Proof-of-Us/.aipou"
      }
    }
  }
}
```

The `.env` file holds `AIPOU_AGENT_PRIVATE_KEY` and `AIPOU_CLAIMS_ADDRESS`. On the validator machine, keep the validator key out of that shared `.env`: store it in a separate file and reference it with `AIPOU_VALIDATOR_KEY_FILE` so farming-only processes never load it.

## Reward flow

1. The agent calls `begin_ai_task` and signs a unique nonce with its farming wallet.
2. The client collects usage and calls `complete_ai_task` with the output hash.
3. The MCP derives the trust tier and signs the receipt with Ed25519.
4. The validator rejects repeated nonces and repeated task/output evidence.
5. `settle_all_ai_rewards` processes all currently eligible pending receipts from the shared `AIPOU_DATA_DIR` in bounded batches.
6. `AIPOUClaims` rejects claimed receipt IDs and mints AIPOU to each farming wallet.

An explicit request such as `claim my AIPOU` is the required trigger for settlement. Broad claim requests use `settle_all_ai_rewards`; `settle_ai_rewards` remains available for a single limited batch. The MCP client and its user keep the final say on how on-chain transactions are confirmed; the server never asks a client to skip its own confirmation policy. The validator can optionally enforce a settlement policy (minimum work floor per receipt via `AIPOU_MIN_RECEIPT_TOKENS`, per-wallet daily receipt limit via `AIPOU_MAX_DAILY_RECEIPTS_PER_WALLET`); both checks are disabled by default.

The trust tier is derived by the MCP and recomputed by the validator. Users cannot self-report `provider_signed`; a provider tier requires a valid provider signature from a configured public key.

See [docs/base-launch.md](docs/base-launch.md) for the deployment checklist.

## Public launch

- Hugging Face Space: https://huggingface.co/spaces/0xddneto/AI-Proof-of-Us
- Reddit announcement: https://www.reddit.com/user/Any_Praline805/comments/1uklabn/i_built_an_open_mcp_protocol_that_rewards/
- Outreach kit: [docs/outreach](docs/outreach/README.md)
- Official contact: aipou001@gmail.com

## Security and abuse warning

AI work is easy to fake if the protocol only counts tokens or session time. AIPOU should evolve toward stronger signals:

- provider-signed usage assertions
- MCP client signatures
- task hashes linked to real work
- staking or slashing for reward operators
- human or community validation for high-value claims

The token can launch early, but emissions should start conservative.

Clear limits:

- AIPOU is not an AI-use detector.
- AIPOU is not a scanner or policy gate.
- AIPOU does not trustlessly prove "useful work" today.
- The current validator is a protocol authority for `client_signed` receipts.
- AIPOU work receipts do not replace narrower tool-call, boundary-event, payment, or policy receipts; they can reference each other.
- AIPOU does not replace SLSA-style provenance, agent-security scanners, or observability traces.
- AIPOU does not replace x402, AP2, stablecoins, or wallet automation.
- AIPOU can be used as payment only where participants voluntarily accept it.
- `client_signed` receipts currently rely on validator policy and trusted collector fingerprints.
- Serious adoption should move owner and validator authority to multisig and publish explicit validator rules.

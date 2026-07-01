# AI Proof of Us

AI Proof of Us is a proof-of-AI-usage protocol for rewarding real work done with AI tools.

The first version ships as:

- an ERC-20 token for Base: `AI Proof of Use` (`AIPOU`)
- an MCP server that records privacy-preserving AI usage receipts
- a reward model that converts valid receipts into claimable emissions
- docs for anti-abuse, Base launch, and future attestation design

The core idea is simple:

```txt
Use AI -> generate a signed receipt -> validate useful activity -> earn AIPOU
```

Read [From AI Work to Onchain Rewards](docs/farming-and-claims.md) for the complete journey, global farming workflow, reward calculation, and one-command claim experience.

Agent builders can start with [AIPOU for AI Agents](docs/for-agents.md), install the included [OpenClaw skill](skills/aipou-farming/SKILL.md), or use [llms.txt](llms.txt) as a compact machine-readable project map.

This is not meant to reward raw prompt spam. The protocol rewards signed AI work across tools like Codex, Claude, Cursor, local models, OpenRouter, Ollama, and future MCP-compatible clients.

## Base mainnet deployment

```txt
Contract: 0x55f0Cc5e51A1284D20337d6cbb18938C8A1ABCbB
Chain:    Base Mainnet (8453)
Token:    AI Proof of Use (AIPOU)
Supply:   100,000,000 AIPOU
Cap:      1,000,000,000 AIPOU
```

- Contract: https://basescan.org/token/0x55f0Cc5e51A1284D20337d6cbb18938C8A1ABCbB
- Verified source: https://repo.sourcify.dev/contracts/full_match/8453/0x55f0Cc5e51A1284D20337d6cbb18938C8A1ABCbB/

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

## Repository layout

```txt
contracts/     ERC-20 token, deploy scripts, Hardhat tests
mcp-server/    MCP server that records AI usage receipts
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

## MCP server

The MCP server exposes tools for creating usage receipts:

- `get_aipou_contract`
- `get_aipou_identity`
- `estimate_ai_reward`
- `begin_ai_task`
- `complete_ai_task`
- `export_ai_receipts`
- `settle_ai_rewards` (protocol validator only)

Receipts store hashes and metadata, not raw prompts or model outputs.

The dedicated farming key signs EIP-712 authorizations locally. Never paste it into a chat or use a primary wallet. The collector has a separate Ed25519 key that cannot move funds.

## Quick start

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

## Local MCP config example

```json
{
  "mcpServers": {
    "aipou": {
      "command": "node",
      "args": ["./mcp-server/dist/index.js"],
      "env": {
        "AIPOU_AGENT_PRIVATE_KEY": "dedicated-farming-wallet-private-key",
        "AIPOU_CLAIMS_ADDRESS": "0x4ca4C98fB784D20EdC8E2A7F531dAab4c6e53058",
        "AIPOU_DATA_DIR": ".aipou"
      }
    }
  }
}
```

## Reward flow

1. The agent calls `begin_ai_task` and signs a unique nonce with its farming wallet.
2. The client collects usage and calls `complete_ai_task` with the output hash.
3. The MCP derives the trust tier and signs the receipt with Ed25519.
4. The validator rejects repeated nonces and repeated task/output evidence.
5. `settle_ai_rewards` publishes a Merkle root and calls `claimBatch`.
6. `AIPOUClaims` rejects claimed receipt IDs and mints AIPOU to each farming wallet.

An explicit request such as `claim my AIPOU` authorizes the agent to complete both settlement transactions without another confirmation prompt.

See [docs/base-launch.md](docs/base-launch.md) for the deployment checklist.

## Security and abuse warning

AI usage is easy to fake if the protocol only counts tokens or session time. AIPOU should evolve toward stronger signals:

- provider-signed usage receipts
- MCP client signatures
- task hashes linked to real work
- staking or slashing for reward operators
- human or community validation for high-value claims

The token can launch early, but emissions should start conservative.

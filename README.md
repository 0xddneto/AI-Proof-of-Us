# AI Proof of Us

AI Proof of Us is an **MCP-first protocol for AI agents and agent developers**.

It gives Codex, Claude, Cursor, OpenClaw, local models, and other MCP-compatible clients a shared way to create signed, privacy-preserving receipts for useful AI-assisted work.

The AIPOU token is attached to approved receipts after validation. The token is secondary; the core product is the receipt protocol and MCP integration surface.

The first version ships as:

- an MCP server that records privacy-preserving AI usage receipts
- an installable OpenClaw skill for agent workflows
- docs for MCP clients, agent builders, anti-abuse, and future attestation design
- a reward model that converts valid receipts into claimable emissions
- an ERC-20 reward token on Base: `AI Proof of Use` (`AIPOU`)

The core idea is simple:

```txt
agent starts task -> MCP creates nonce -> AI work happens -> signed receipt -> validator checks -> optional AIPOU claim
```

Start here if you are building or testing an agent integration:

- [AIPOU for AI Agents](docs/for-agents.md)
- [MCP tools](docs/mcp-tools.md)
- [OpenClaw skill](skills/aipou-farming/SKILL.md)
- [llms.txt](llms.txt), a compact machine-readable project map

Read [From AI Work to Onchain Rewards](docs/farming-and-claims.md) for the complete journey, global farming workflow, reward calculation, and one-command claim experience.
Read [Evidence Boundaries](docs/evidence-boundaries.md) and [Claim Validation Policy](docs/claim-validation-policy.md) before proposing integrations with receipt, provenance, security, or payment projects.

Public explainer: https://huggingface.co/spaces/0xddneto/AI-Proof-of-Us

This is not meant to reward raw prompt spam or attract passive token speculation. AIPOU is for developers who want to test whether AI work can produce portable receipts across agent clients.

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

AIPOU claims are optional settlement for approved receipts. They do not prove hidden AI use, objective task value, provider endorsement, or security-policy compliance.

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

The trust tier is derived by the MCP and recomputed by the validator. Users cannot self-report `provider_signed`; a provider tier requires a valid provider signature from a configured public key.

See [docs/base-launch.md](docs/base-launch.md) for the deployment checklist.

## Public launch

- Hugging Face Space: https://huggingface.co/spaces/0xddneto/AI-Proof-of-Us
- Reddit announcement: https://www.reddit.com/user/Any_Praline805/comments/1uklabn/i_built_an_open_mcp_protocol_that_rewards/
- Outreach kit: [docs/outreach](docs/outreach/README.md)

## Security and abuse warning

AI usage is easy to fake if the protocol only counts tokens or session time. AIPOU should evolve toward stronger signals:

- provider-signed usage receipts
- MCP client signatures
- task hashes linked to real work
- staking or slashing for reward operators
- human or community validation for high-value claims

The token can launch early, but emissions should start conservative.

Clear limits:

- AIPOU is not an AI-use detector.
- AIPOU is not a scanner or policy gate.
- AIPOU does not replace SLSA-style provenance, agent-security scanners, or observability traces.
- `client_signed` receipts currently rely on validator policy and trusted collector fingerprints.

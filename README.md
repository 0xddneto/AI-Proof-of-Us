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

This is not meant to reward raw prompt spam. The protocol should reward useful, rate-limited, signed AI work across tools like Codex, Claude, Cursor, local models, OpenRouter, Ollama, and future MCP-compatible clients.

## Repository layout

```txt
contracts/     ERC-20 token, deploy scripts, Hardhat tests
mcp-server/    MCP server that records AI usage receipts
docs/          architecture, anti-abuse model, Base launch notes
```

## Token

```txt
Name:   AI Proof of Use
Symbol: AIPOU
Chain:  Base
Cap:    1,000,000,000 AIPOU
```

The token contract has an `emissionController` address that can mint rewards. In production this should become a governed emissions contract, not a private wallet.

## MCP server

The MCP server exposes tools for creating usage receipts:

- `get_aipou_contract`
- `record_ai_usage`
- `estimate_ai_reward`
- `export_ai_receipts`

Receipts store hashes and metadata, not raw prompts or model outputs.

`get_aipou_contract` returns the AIPOU contract address on Base once `AIPOU_CONTRACT_ADDRESS` or `deployments/base.json` is configured.

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
        "AIPOU_RECEIPT_SECRET": "replace-this",
        "AIPOU_DATA_DIR": ".aipou"
      }
    }
  }
}
```

## Launch path

1. Deploy `AIPOU` to Base Sepolia.
2. Run the MCP collector with a test reward policy.
3. Publish receipt format and anti-abuse rules.
4. Launch Base mainnet token with capped emissions.
5. Replace the first emission controller with a transparent claim contract.

See [docs/base-launch.md](docs/base-launch.md) for the deployment checklist.

## Security and abuse warning

AI usage is easy to fake if the protocol only counts tokens or session time. AIPOU should evolve toward stronger signals:

- provider-signed usage receipts
- MCP client signatures
- task hashes linked to real work
- rate limits and wallet reputation
- staking or slashing for reward operators
- human or community validation for high-value claims

The token can launch early, but emissions should start conservative.

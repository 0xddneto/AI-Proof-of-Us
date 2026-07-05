# AIPOU MCP Server

`aipou-mcp-server` records private, signed receipts for authorized AI tasks. It supports local receipt collection, reward status checks, and optional claims for validated work on Base.

It does not detect hidden AI use, prove task quality, replace payment rails, or require raw prompts and outputs to leave the user's machine.

## Fast Local Adoption Test

If you are evaluating AIPOU for an agent framework, start with the lifecycle adapter example:

```bash
npm install
npm run build -w mcp-server
cd examples/lifecycle-adapter
npm install
npm run demo
```

The demo launches this MCP server over stdio, creates a local signed receipt with an ephemeral wallet, and prints the `receiptId` reference a framework can attach to metadata. It does not claim rewards or move funds.

## Run From npm

MCP clients can launch the published package with:

```bash
npx -y aipou-mcp-server
```

## Run locally from this repository

For local development or source review, run the MCP server from a checkout:

```bash
npm install
npm run build -w mcp-server
node mcp-server/dist/index.js
```

For development:

```bash
npm run dev -w mcp-server
```

Required configuration:

```text
AIPOU_AGENT_PRIVATE_KEY=<dedicated farming wallet key>
AIPOU_CONTRACT_ADDRESS=0x55f0Cc5e51A1284D20337d6cbb18938C8A1ABCbB
AIPOU_CLAIMS_ADDRESS=0x4ca4C98fB784D20EdC8E2A7F531dAab4c6e53058
```

Use a new dedicated farming wallet, never a primary wallet. Do not commit the private key. Status checks can show already claimed and pending AIPOU without moving funds. Optional claims and settlement occur only after an explicit user request.

Do not configure `AIPOU_VALIDATOR_PRIVATE_KEY` on a user installation. That key is only for the separate protocol validator service. The local Ed25519 collector key and receipt metadata are stored unencrypted under `AIPOU_DATA_DIR`; restrict that directory with operating-system permissions and use encrypted backups.

The default network is Base mainnet. `AIPOU_RPC_URL` and `AIPOU_DATA_DIR` can be set when a custom RPC endpoint or receipt directory is needed.

Publication details: [docs/npm-publication.md](https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/npm-publication.md).

## Documentation

- [Local Receipt Mode](https://github.com/0xddneto/AI-Proof-of-Us/tree/main/examples/local-receipt-mode)
- [Lifecycle Adapter Example](https://github.com/0xddneto/AI-Proof-of-Us/tree/main/examples/lifecycle-adapter)
- [Evidence Boundaries](https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/evidence-boundaries.md)
- [Claim Validation Policy](https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/claim-validation-policy.md)
- [Tokenomics](https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/tokenomics.md)
- [Security Policy](https://github.com/0xddneto/AI-Proof-of-Us/blob/main/SECURITY.md)

License: MIT

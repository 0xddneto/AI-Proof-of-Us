# AIPOU MCP Server

`aipou-mcp-server` records private, signed receipts for authorized AI tasks. It supports local receipt collection and optional claims for validated work on Base.

It does not detect hidden AI use, prove task quality, replace payment rails, or require raw prompts and outputs to leave the user's machine.

## Run

```bash
npx -y aipou-mcp-server
```

Required configuration:

```text
AIPOU_AGENT_PRIVATE_KEY=<dedicated farming wallet key>
AIPOU_CONTRACT_ADDRESS=0x55f0Cc5e51A1284D20337d6cbb18938C8A1ABCbB
AIPOU_CLAIMS_ADDRESS=0x4ca4C98fB784D20EdC8E2A7F531dAab4c6e53058
```

Use a new dedicated farming wallet, never a primary wallet. Do not commit the private key. Optional claims and settlement occur only after an explicit user request.

The default network is Base mainnet. `AIPOU_RPC_URL` and `AIPOU_DATA_DIR` can be set when a custom RPC endpoint or receipt directory is needed.

## Documentation

- [Local Receipt Mode](https://github.com/0xddneto/AI-Proof-of-Us/tree/main/examples/local-receipt-mode)
- [Evidence Boundaries](https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/evidence-boundaries.md)
- [Claim Validation Policy](https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/claim-validation-policy.md)
- [Tokenomics](https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/tokenomics.md)

License: MIT

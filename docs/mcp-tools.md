# MCP Tools

## `get_aipou_contract`

Returns the AIPOU and AIPOUClaims addresses, Base network details, explorer URLs, and minimal ABIs.

## `get_aipou_identity`

Returns the dedicated farming wallet address, collector public Ed25519 key, and collector fingerprint. It never returns private keys. The protocol must register the fingerprint before settling that collector's receipts.

## `estimate_ai_reward`

Estimates a `client_signed` reward from token counts and task duration. The final tier is derived during completion.

## `begin_ai_task`

Input:

```json
{
  "provider": "openai",
  "model": "gpt-5-codex",
  "taskHash": "0x...32-bytes...",
  "client": "codex"
}
```

Returns a unique nonce and an EIP-712 authorization signed by the farming wallet.

## `complete_ai_task`

Input:

```json
{
  "nonce": "0x...32-bytes...",
  "inputTokens": 2000,
  "outputTokens": 800,
  "durationSeconds": 480,
  "outputHash": "0x...32-bytes..."
}
```

An optional `providerEvidence` contains a trusted provider key ID and Ed25519 signature. Invalid evidence is rejected; missing evidence becomes `client_signed`.

## `export_ai_receipts`

Exports signed receipts and settlement status, optionally filtered by wallet.

## `settle_ai_rewards`

Available only on the protocol validator server. It validates unsettled receipts, publishes their Merkle root, calls `claimBatch`, and records both transaction hashes.

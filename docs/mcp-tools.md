# MCP Tools

## `estimate_ai_reward`

Estimates a reward before recording a receipt.

Input:

```json
{
  "inputTokens": 2000,
  "outputTokens": 800,
  "durationSeconds": 480,
  "trustTier": "self_reported"
}
```

## `record_ai_usage`

Records a signed usage receipt.

Input:

```json
{
  "wallet": "0x0000000000000000000000000000000000000000",
  "provider": "openai",
  "model": "gpt-5-codex",
  "inputTokens": 2000,
  "outputTokens": 800,
  "durationSeconds": 480,
  "taskHash": "0x...",
  "outputHash": "0x...",
  "client": "codex",
  "trustTier": "self_reported"
}
```

## `export_ai_receipts`

Exports locally stored receipts for a wallet or all wallets.

The exported data can feed a future claim batch on Base.


# Architecture

AI Proof of Us has three layers.

## 1. Usage capture

The MCP server sits beside the user's AI workflow and records receipts for completed sessions or tasks.

Each receipt contains:

- wallet address
- provider and model family
- token counts or local inference units
- session duration
- task hash
- output hash
- client identifier
- timestamp
- reward estimate
- collector signature

Raw prompts and raw outputs should not be stored.

## 2. Validation

The first MVP uses local signed receipts. This is useful for testing, but it is not enough for public farming.

The production path should introduce trust tiers:

```txt
Tier 0: self-reported local usage
Tier 1: MCP client signature
Tier 2: provider/API signed receipt
Tier 3: task-linked proof with repository, artifact, or benchmark evidence
Tier 4: community/governed validation for high-value claims
```

Rewards should depend on the trust tier, not only on usage volume.

## 3. Emissions

The ERC-20 token lives on Base. The token contract exposes a controlled mint function for reward emissions.

The first `emissionController` can be a deployer-controlled address for testing. Mainnet should move emissions to a contract that verifies Merkle roots, attestations, or EAS records before minting.

## Receipt flow

```txt
AI client / local tool
  -> MCP server
  -> signed AI usage receipt
  -> validator / reward policy
  -> claim batch
  -> Base emission controller
  -> AIPOU reward
```


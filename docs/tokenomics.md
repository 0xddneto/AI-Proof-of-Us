# AIPOU Tokenomics and Launch Transparency

AIPOU separates three different concepts:

- **Liquidity pool** - the AIPOU/WETH market where people can buy or sell.
- **Claims contract** - the reward path where approved AI-work receipts mint AIPOU.
- **Protocol wallets** - operational wallets used for deployment, validation, or farming.

The liquidity pool does not fund farming rewards. Farming rewards are minted by
`AIPOUClaims` only for validated receipt batches.

## Supply

```txt
Initial supply: 100,000,000 AIPOU
Maximum cap:    1,000,000,000 AIPOU
```

The cap leaves room for future rewards, but emissions are not automatic. A
receipt must pass validation and enter a Merkle claim batch before AIPOU can be
minted as a reward.

## Base Contracts

```txt
AIPOU token:      0x55f0Cc5e51A1284D20337d6cbb18938C8A1ABCbB
AIPOUClaims:      0x4ca4C98fB784D20EdC8E2A7F531dAab4c6e53058
AIPOU/WETH pool:  0x3bEA7b68Af54Da779454f82148Ef848c76F78D02
LP timelock:      0xc11197E32dFb2352f262D874acFc54467aee6B52
```

## Liquidity Lock

The protocol added ETH liquidity on July 8, 2026, then transferred the entire
wallet-held LP position to an immutable one-year lock.

```txt
Locked LP tokens: 1,712.89145801936861611
Locked LP share:  99.9999%
Unlock time:      2027-07-08 20:16:49 UTC
Beneficiary:      0x1F92Ee5820A706ed1315F239dE8C53eb1d65dac2
```

The lock has no owner, admin function, emergency withdrawal, or method to
change the beneficiary or unlock time. Before expiry, `release()` reverts.
After expiry, anyone can call it, but the LP tokens are always sent to the
fixed beneficiary.

Public proof:

- Verified lock: https://basescan.org/address/0xc11197E32dFb2352f262D874acFc54467aee6B52#code
- Lock deployment: https://basescan.org/tx/0x0add77d318c020a61ba42b64fee1b89f48cba9d3af900483ecfbcfecfae384a1
- LP transfer: https://basescan.org/tx/0xfc10a43b092dc041f9e04631be60533f4e54dda6a13acd6c4ab1cf440953dc6a
- Deployment metadata: `deployments/base-liquidity-lock.json`

The lock prevents removal of the locked liquidity during the published
period. It does not guarantee price, demand, trading volume, or liquidity after
the unlock date.

## Experimental Pool Launch

The first AIPOU/WETH pool was created with intentionally tiny WETH liquidity.
The WETH side was later increased to approximately `0.02957 WETH`, but the
market remains small and should not be treated as a reliable valuation signal.

The initial public experiment also included a small ETH buy from the pool. That
buy resulted in a large AIPOU balance because the pool was extremely shallow.
To avoid leaving a misleading concentrated holder profile, the experimental
purchase was returned through an Aerodrome swap.

## Purchase Reversal

The experimental purchase balance was returned to the AIPOU/WETH pool.

```txt
Returned amount: 66,559,681.134655488821408999 AIPOU
Method:          Aerodrome swap AIPOU -> ETH
Purpose:         Restore the experimental launch purchase back into pool liquidity
```

Transactions:

- Router approval: https://basescan.org/tx/0x1a8a294d38e47abe6755365a665638520ca0619d1f547115e0cf8b705609df58
- Return swap: https://basescan.org/tx/0x1fa2e5ec9abdbb0a8e220dbbf39e0f4362657149f51f1effb94c66491e18ecf1
- Public onchain note: https://basescan.org/tx/0x1144a8831cc2e002060767e1fca0930f59dcda4c101eb63d4a86654742220499

The onchain note says:

```txt
AIPOU experimental launch purchase returned to Aerodrome pool via swap tx
0x1fa2e5ec9abdbb0a8e220dbbf39e0f4362657149f51f1effb94c66491e18ecf1.
Claimed farming rewards remain separate and honest.
```

## Claimed Rewards

Claimed farming rewards were not returned to the pool. They are treated
separately because they came from the receipt-claim mechanism, not from the
experimental market purchase.

At the time of the reversal, the dedicated farming wallet held:

```txt
3.1075 AIPOU
```

Those tokens came from approved claim tests and remain as honest farming
rewards.

## Current Interpretation

AIPOU should be read as an experimental MCP receipt and reward protocol, not as
an investment launch.

Important limits:

- The pool is not a reliable price oracle.
- Thin liquidity can move dramatically.
- Claims are optional settlement for validated receipts.
- AIPOU does not prove hidden AI use or objective task value.
- AIPOU does not replace payment rails, provenance scanners, or LLM traces.

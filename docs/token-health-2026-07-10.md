# AIPOU Token Health Snapshot - 2026-07-10

This is a dated operational snapshot, not an investment assessment. Values can change after every trade, claim, transfer, or ETH price move.

## Onchain State

Base block checked: `48468613`

| Metric | Value |
| --- | ---: |
| Current supply | `100,000,363.095 AIPOU` |
| Contract cap | `1,000,000,000 AIPOU` |
| Cap utilization | `10.0000363095%` |
| AIPOU in pool | `99,226,797.649044090024497191` |
| WETH in pool | `0.029568596553251631` |
| Claimed farming-wallet balance | `363.095 AIPOU` |
| Token-owner balance | `0 AIPOU` |
| LP supply in timelock | `1712.891458019368616110 / 1712.891458019368617110` |
| LP lock expiry | `2027-07-08 20:16:49 UTC` |

The 363.095 AIPOU above the 100 million initial supply matches the checked farming-wallet balance at this snapshot. Claims mint within the immutable one-billion cap; they do not draw tokens out of the liquidity pool.

## Market Depth

Using an ETH reference price of approximately `$1,624.95` at check time:

- WETH side value: approximately `$48.05`.
- Two-sided pool liquidity: approximately `$96.09`.
- Reserve-ratio spot price: approximately `$0.0000004842` per AIPOU.
- Current-supply value at that reserve ratio: approximately `$48.42`.

These values are mathematical reserve snapshots, not reliable market prices. A trade that is small in dollar terms can move this pool substantially.

## Healthy Signals

- Supply remains far below the one-billion hard cap.
- The token owner held no AIPOU at the checked block.
- Almost the entire LP supply is held by the immutable one-year timelock.
- The lock contract fixes the LP token, beneficiary, and unlock time and has no early-release admin path.
- The npm production dependency audit and Forge live OSV check both returned zero known vulnerabilities for the software package. Those scans concern the MCP package, not token economics.

## Risks And Gaps

- Liquidity is very small, so price discovery is fragile and slippage is high.
- DexScreener's token API returned `pairs: null` at this check even though the Aerodrome pair exists onchain. Indexer visibility is inconsistent.
- The claims validator and token ownership remain protocol authority points. Contract verification and public policy make them inspectable, but they are not decentralized governance.
- The LP lock prevents withdrawal before expiry; it does not guarantee price, volume, buyers, or post-expiry liquidity.
- No third-party adoption or organic trading should be inferred from the pool or claim balances.

## Priority Improvements

1. Complete Forge root-domain verification and wait for Forge to ingest the already-public npm provenance signal; the Forge package scan is now clean.
2. Keep the public claims policy and tokenomics page synchronized with deployed contracts.
3. Resolve DexScreener indexing through its token/pair support channels without manufacturing volume.
4. Publish periodic dated snapshots of supply, claims, reserves, and locked-LP percentage.
5. Move owner and validator authority to a documented multisig before presenting AIPOU as mature infrastructure.

## Public References

- Token: https://basescan.org/token/0x55f0Cc5e51A1284D20337d6cbb18938C8A1ABCbB
- Pair: https://basescan.org/address/0x3bEA7b68Af54Da779454f82148Ef848c76F78D02
- LP lock: https://basescan.org/address/0xc11197E32dFb2352f262D874acFc54467aee6B52#code
- Claims: https://basescan.org/address/0x4ca4C98fB784D20EdC8E2A7F531dAab4c6e53058#code

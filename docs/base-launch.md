# Base Launch Checklist

## Testnet

1. Create a deployer wallet dedicated to AIPOU.
2. Fund it on Base Sepolia.
3. Set `.env` values:

```txt
BASE_SEPOLIA_RPC_URL=
DEPLOYER_PRIVATE_KEY=
TOKEN_OWNER=
INITIAL_RECIPIENT=
EMISSION_CONTROLLER=
```

4. Deploy:

```bash
npm run deploy:base-sepolia -w contracts
```

5. Verify the contract and test `mintUsageReward` from the emission controller.

## Mainnet

Current deployment:

```txt
AIPOU:       0x55f0Cc5e51A1284D20337d6cbb18938C8A1ABCbB
AIPOUClaims: 0x4ca4C98fB784D20EdC8E2A7F531dAab4c6e53058
```

`AIPOUClaims` is the active emission controller. The current protocol owner and validator use a dedicated local wallet and should move to a multisig before broader public farming.

Operational checklist:

1. Back up protocol keys in a secret manager.
2. Move ownership to a multisig.
3. Keep the validator signer separate from user farming wallets.
4. Publish receipt rules and trusted provider public keys.
5. Monitor Merkle roots, claims, and unexpected emission patterns.

## Suggested initial configuration

```txt
cap:             1,000,000,000 AIPOU
initial supply:  100,000,000 AIPOU
emissions:       900,000,000 AIPOU over time
owner:           multisig
controller:      emission/claim contract
```

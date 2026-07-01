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

1. Deploy `AIPOU` on Base.
2. Publish token address.
3. Keep the owner in a multisig.
4. Keep emission controller separate from owner.
5. Start with small emissions.
6. Publish claim batches and receipt rules.
7. Move emissions to a claim contract once the receipt validator is ready.

## Suggested initial configuration

```txt
cap:             1,000,000,000 AIPOU
initial supply:  100,000,000 AIPOU
emissions:       900,000,000 AIPOU over time
owner:           multisig
controller:      emission/claim contract
```


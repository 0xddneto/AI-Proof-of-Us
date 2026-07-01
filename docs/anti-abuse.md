# Anti-Abuse Model

The biggest risk is fake usage farming.

Bad reward rules:

- pay only for token count
- pay only for time open
- pay every local receipt equally
- allow unlimited anonymous wallets
- reward repeated identical tasks

Better reward rules:

- daily caps per wallet and device key
- lower rewards for self-reported local usage
- higher rewards for signed provider receipts
- duplicate detection through task and output hashes
- reward completed tasks more than raw usage
- require wallet age, staking, or reputation for higher tiers
- delay claims so suspicious patterns can be challenged

## Suggested MVP reward policy

```txt
self-reported local receipt: low reward, strict daily cap
MCP client signed receipt: medium reward, normal daily cap
provider signed receipt: high reward, higher daily cap
task-linked public artifact: bonus reward
```

## What not to store

Do not store:

- raw prompts
- raw outputs
- private files
- API keys
- model provider tokens

Store hashes and metadata only.

## Mainnet posture

Launch the token on Base, but keep emissions conservative until the validator is stronger. The token can exist early; public farming should be gated by anti-abuse controls.


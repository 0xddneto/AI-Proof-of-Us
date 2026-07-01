# Anti-Abuse Model

The protocol blocks exact replay without imposing a daily reward limit.

Implemented protections:

- cryptographically random one-use task nonce
- EIP-712 authorization from a dedicated farming wallet
- Ed25519 collector signature with public verification
- protocol allowlist of trusted collector fingerprints
- provider tier derived from configured provider keys
- duplicate task/output evidence rejection
- duplicate receipt ID rejection in the MCP store
- duplicate receipt ID rejection in `AIPOUClaims`
- Merkle proof binding wallet, reward amount, and receipt ID

## Remaining risks

These controls prove authorization, integrity, and uniqueness. They do not prove that arbitrary token counts are truthful when a provider does not sign them.

They also do not detect hidden AI use outside the MCP, prove objective task value, replace scanners or policy gates, or prove provider endorsement.

Without daily limits, staking, identity cost, or reputation, an attacker can create many wallets and many distinct low-value tasks. This is not replay, but it is still Sybil farming. Provider-signed receipts and task-quality verification should receive stronger economics than client-signed usage.

The validator derives trust tier from configured signatures. Users cannot self-report a higher tier, and invalid provider evidence should cause settlement failure.

## Private data

Never store raw prompts, raw outputs, private files, API tokens, or wallet private keys in receipts. Private keys belong only in ignored local environment files or a secret manager.

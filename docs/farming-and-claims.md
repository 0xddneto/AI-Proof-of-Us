# From AI Work to Onchain Rewards

AI Proof of Us (AIPOU) began with a simple question: if people use many AI agents across many conversations and projects, how can useful AI-assisted work become a portable, verifiable reward?

The answer is a global MCP-based farming system. A user keeps one dedicated farming wallet and one local collector identity. Every supported AI conversation can produce signed usage receipts, regardless of which project directory the user is working in. Valid receipts are later grouped into a Merkle batch and settled on Base, where the AIPOU token is minted to the farming wallet.

## The Journey

The protocol was built in layers:

1. **AIPOU token on Base** - a capped ERC-20 with controlled reward emissions.
2. **Global MCP collector** - a local server that can be used by Codex and other MCP-compatible AI clients.
3. **Task authorization** - every new task starts with a unique nonce signed by the farming wallet using EIP-712.
4. **Signed usage receipts** - completed tasks produce privacy-preserving receipts signed by the collector with Ed25519.
5. **Replay protection** - completed nonces, duplicate task/output evidence, and claimed receipt IDs cannot be reused.
6. **Merkle settlement** - approved receipts are grouped into an onchain-verifiable batch.
7. **Autonomous claims** - one explicit user command authorizes the agent to publish the batch and mint the rewards.

## Farming Across Projects

AIPOU is configured globally in the AI client, not separately inside every project. This means multiple repositories, conversations, and active workspaces can share:

- the same dedicated farming wallet
- the same Ed25519 collector identity
- the same local receipt store
- the same duplicate-protection state
- the same Base claim contract

After installing the MCP server, restart the AI client so new sessions load its tools. Existing conversations can continue after the restart. If a conversation does not receive the MCP tools, start a new thread in that project.

Farming starts from the moment the MCP is installed. Old conversations cannot be rewarded retroactively with the same proof quality because they have no original nonce, EIP-712 authorization, or collector-signed completion receipt.

## Task Lifecycle

### 1. Begin the task

Before meaningful work starts, the agent calls `begin_ai_task` with hashes and public metadata. The MCP:

- generates a cryptographically random 32-byte nonce
- binds the nonce to the farming wallet
- records the provider, model, task hash, and start time
- signs a typed EIP-712 authorization with the dedicated farming wallet

Raw prompts are not stored.

### 2. Complete the task

After the work is finished, the agent calls `complete_ai_task` with the nonce, usage information, duration, and output hash. The MCP:

- verifies the wallet authorization
- rejects a nonce that was already completed
- rejects repeated task/output evidence
- derives the trust tier instead of accepting a user-selected tier
- calculates the estimated reward
- signs the receipt with the collector's Ed25519 private key

Raw outputs and private project files are not stored. The receipt contains hashes and the metadata required for validation.

## Reward Calculation

The current reward model combines token usage and task duration:

```text
token_score    = min((input_tokens + output_tokens) / 1,000, 30)
duration_score = min(duration_seconds / 300, 12)
reward         = min((token_score + duration_score) * tier_multiplier, 50)
```

Current trust multipliers:

| Trust tier | Multiplier | Requirement |
| --- | ---: | --- |
| `client_signed` | 0.75 | Valid EIP-712 wallet authorization and trusted Ed25519 collector signature |
| `provider_signed` | 1.50 | All client-signed checks plus a valid signature from a configured provider key |

Examples for a `client_signed` task:

| Work | Reward |
| --- | ---: |
| 5 minutes, no token score | 0.75 AIPOU |
| 30 minutes, no token score | 4.50 AIPOU |
| 1 hour, no token score | 9.00 AIPOU |
| 1 hour and 10,000 tokens | 16.50 AIPOU |
| Maximum client-signed task | 31.50 AIPOU |

A `provider_signed` task can receive up to the protocol maximum of 50 AIPOU. Duration stops increasing after one hour per task, and token score stops increasing after 30,000 tokens per task.

There is currently no daily farming limit. Exact replay is blocked, but Sybil farming through many wallets or many distinct low-value tasks remains an economic risk that future governance and task-quality verification should address.

## Claiming Rewards

Receipts remain local and pending until settlement. The user only needs to say:

```text
Claim my AIPOU.
```

That explicit request authorizes the complete claim flow. The agent then:

1. loads all unsettled receipts
2. verifies wallet, collector, provider, and duplicate-protection rules
3. converts each receipt into a Merkle leaf containing wallet, amount, and receipt ID
4. publishes the Merkle root to `AIPOUClaims` on Base
5. calls `claimBatch` with every proof in the batch
6. pays gas with the protocol validator wallet
7. mints AIPOU directly to the user's farming wallet
8. records the root and transaction hashes locally
9. reports the completed settlement to the user

No second confirmation is required after the explicit claim request. The farming wallet receives the tokens and does not need ETH for the batch settlement.

## Wallet and Key Roles

The system deliberately separates responsibilities:

| Identity | Purpose |
| --- | --- |
| Farming wallet | Authorizes tasks and receives AIPOU |
| Collector Ed25519 key | Signs usage receipts but cannot move funds |
| Protocol validator wallet | Publishes Merkle roots, submits claim batches, and pays gas |
| Claims contract | Verifies proofs, blocks repeated receipt IDs, and controls token emissions |

Private keys must remain in ignored local environment files or a secret manager. They must never be committed to Git, embedded in receipts, pasted into conversations, or shared with model providers.

## What the Proof Establishes

The current proof establishes that:

- a dedicated wallet authorized the task
- a trusted collector observed and signed the completion
- the receipt has not been replayed
- the task/output evidence has not been duplicated locally
- the claimed wallet, reward amount, and receipt ID belong to an approved Merkle batch
- the receipt ID can be claimed only once onchain

For providers that do not issue cryptographically signed usage evidence, the receipt remains `client_signed`. The protocol does not pretend that an API response ID or an agent statement is a provider signature.

## User Experience

The intended experience is intentionally small:

```text
Work normally with AI across any project.
The agent creates signed receipts for useful tasks.
Say "Claim my AIPOU" when ready.
Receive the accumulated AIPOU on Base.
```

Everything between the work and the final balance - nonce creation, signatures, duplicate checks, reward calculation, Merkle construction, root publication, proof submission, and minting - is handled by the agent and the protocol.

# Human Rewards and Agent Payments

AIPOU exists for a simple human reality: many people now spend the whole day working with AI agents.

They write code, debug systems, research markets, produce documents, review security, run local models, and coordinate projects through tools like Codex, Claude, Cursor, OpenClaw, and Ollama. That work should be able to leave a portable receipt.

AIPOU turns approved AI-assisted work receipts into a reward token on Base.

## Human Reward Loop

The human workflow is intentionally small:

```text
work with AI all day -> agent records signed receipts -> validator checks receipts -> human claims AIPOU
```

AIPOU is not a reward for raw prompt spam. It is a reward experiment for useful AI-assisted work that can produce privacy-preserving receipts.

## Two Modes

AIPOU should be easy to understand in two modes.

### Local Receipt Mode

Use this when someone only wants a private trail of AI work:

```text
AI work -> local signed receipt -> private receipt history
```

In this mode:

- no claim is required
- no payment is required
- no raw prompts are uploaded
- the user can export or inspect receipts later

This is the simplest mode for Ollama and local AI users.

### Claim / Payment Mode

Use this when the user wants to claim rewards or when an agent/marketplace accepts AIPOU:

```text
AI work -> validated receipt -> optional AIPOU claim -> optional settlement/payment
```

In this mode:

- the user explicitly asks to claim
- the validator checks the receipt
- approved receipts can mint AIPOU
- agents or marketplaces may accept AIPOU as settlement if they choose

Local users can ignore this mode until they want rewards.

The human does not need to understand every cryptographic detail. The agent and MCP server handle:

- task nonce creation
- EIP-712 wallet authorization
- local collector signatures
- output hashes instead of raw private content
- replay checks
- trust-tier derivation
- Merkle settlement
- AIPOU minting after explicit claim

## Why This Matters

AI work is fragmented across tools and projects. One person may use:

- Codex for coding
- Claude for writing and analysis
- Cursor for repo edits
- OpenClaw for agent workflows
- Ollama for local private tasks
- other MCP-compatible tools for specialized work

AIPOU gives these environments a shared reward primitive:

```text
different AI clients, one receipt language
```

## Agent Payment Loop

AIPOU can also be used as a payment or settlement token when both sides accept it.

Examples:

- a human rewards an agent workflow with AIPOU
- an agent marketplace uses AIPOU receipts as payout evidence
- an AI service accepts AIPOU for completed tasks
- one agent references another agent's `receiptId` before settling a reward
- a payment rail stores an AIPOU `receiptId` as external work evidence

This does not mean AIPOU replaces x402, AP2, AgentKit, stablecoins, or wallet automation. AIPOU is a receipt-backed reward and settlement token. Payment systems can reference it; they do not need to become AIPOU validators.

## Useful and Pleasant

AIPOU joins two ideas:

- useful: verifiable AI-work receipts
- pleasant: humans who spend real time working with AI can claim rewards for approved receipts

The protocol should always keep this balance. If AIPOU becomes only token hype, developers will ignore it. If it becomes only abstract provenance, humans may not feel why it matters.

The message is:

```text
Work with AI. Keep private receipts. Claim AIPOU for approved work. Let agents and marketplaces use those receipts as payment evidence.
```

For local AI communities, use the shorter message:

```text
AIPOU can run as a private receipt trail for local AI work. Claims and payments are optional.
```

## What AIPOU Does Not Promise

AIPOU does not promise:

- guaranteed income
- stable market price
- hidden AI detection
- objective proof of task value
- provider endorsement
- replacement of payment rails
- automatic acceptance by agents or marketplaces

AIPOU can be used as payment only where participants voluntarily accept it.

## First Adoption Targets

The first realistic users are:

- developers who already use MCP clients all day
- local AI users who want private receipts
- agent marketplaces experimenting with reputation and payouts
- agent frameworks that can attach receipt metadata through optional observers
- LLMOps tools that can store `receiptId` as trace/session metadata
- payment builders that want external evidence for completed AI work

## Public One-Liner

```text
AIPOU rewards humans for approved AI-assisted work receipts and gives agents a receipt-backed token they can use for settlement when participants accept it.
```

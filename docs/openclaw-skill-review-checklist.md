# OpenClaw Skill Review Checklist

This checklist exists because agent-skill reviewers need to verify that AIPOU does not hide wallet actions.

## Required User-Facing Claims

The skill must say:

- AIPOU records AI-work receipts through MCP.
- Raw prompts and raw outputs are not uploaded by default.
- Claims are optional.
- Settlement happens only after an explicit user command such as `Claim my AIPOU`.
- AIPOU is experimental and unaudited.
- AIPOU is not an investment promise.

## Required Permission Declarations

The skill should declare:

- filesystem access for local receipt storage
- network access to Base RPC only for contract reads and settlement
- access to the local MCP server process
- no access to primary wallets
- no access to browser sessions unless separately requested
- no background settlement jobs

## Wallet Safety Rules

The skill must not:

- ask users to paste a private key into chat
- use a primary wallet
- claim rewards without an explicit command
- sign arbitrary transactions
- transfer tokens other than the documented claim settlement flow
- hide transaction hashes from the user

The skill should:

- use a dedicated farming wallet
- keep private keys in local ignored env files or a secret manager
- explain that the collector Ed25519 key cannot move funds
- show the AIPOU token and claims contract addresses

## Review Questions

Before listing or recommending the skill, reviewers should ask:

1. Where is the farming key stored?
2. Can the skill claim without a user command?
3. Which network endpoints can it call?
4. Does it upload raw prompts or outputs?
5. Does it expose `receiptId` without exposing private content?
6. Can users inspect pending receipts before claim?
7. Does the docs link to evidence boundaries and claim policy?
8. Are token price, yield, liquidity, or listing promises absent?

## Safe First Approval

A safe first approval is:

```text
Experimental local receipt skill for MCP agents. Claims require explicit user command. Reviewers should treat AIPOU as provenance/reward infrastructure, not as investment advice or hidden wallet automation.
```

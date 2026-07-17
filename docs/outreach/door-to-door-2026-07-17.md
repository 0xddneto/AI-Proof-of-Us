# Door-To-Door Outreach - July 17, 2026

This log records the July 17 follow-up round after the Kuberna/ERC-8004
authority fixture was corrected and pinned in AIPOU.

## Positioning

The round used the current human-first and protocol-honest positioning:

- AIPOU is an MCP-first receipt protocol for humans working with AI agents.
- The reward path is optional and depends on validator-approved receipts.
- No price, yield, liquidity, guaranteed reward, or production adoption was
  promised.
- Pre-action authority, post-work receipts, external evidence links, and token
  claims stay separate.
- External comments distinguish collaboration/conformance from adoption.

## Existing Conversations

### ElizaOS / Kuberna

- Thread: https://github.com/orgs/elizaOS/discussions/9810
- Reply: https://github.com/orgs/elizaOS/discussions/9810#discussioncomment-17677071
- Context: Kuberna confirmed commit
  `fada367f122adf10dcd0b8c63dba98df7d06a2d6`, updating the synthetic
  `authority-receipt.json` fact to
  `0x82c33017978a70f0cf08ecc45df9ae81107410d466f0e5205b426981466baaad`
  with reconstruction test coverage.
- AIPOU response: confirmed that commit `e91e991` pins this immutable Kuberna
  commit as the positive ERC-8004/Kuberna conformance vector, keeps the old
  `0x2369ba...` drift as a negative fail-closed fixture, and keeps the
  downstream AIPOU task receipt as `issuer_asserted + aipou-receipt-v1`.
- Status: active conformance collaboration; not ElizaOS adoption.

### AutoGen Pull Request

- PR: https://github.com/microsoft/autogen/pull/7961
- Reply: https://github.com/microsoft/autogen/pull/7961#issuecomment-5008004123
- Context: `tamish560` reviewed the AutoGen cookbook proposal and confirmed
  that the protocol-neutral names preserve the three AIPOU fixture semantics:
  recoverable missing authority, accepted authority, and permanent forbidden
  action, plus non-tool pass-through.
- AIPOU response: thanked the reviewer, kept the PR scoped to protocol-neutral
  structured tool-execution authority decisions, and noted the Kuberna fixture
  only as background evidence for the authority/work split.
- Status: external review on an upstream PR; not merged adoption.

### AutoGen Discussion

- Thread: https://github.com/microsoft/autogen/discussions/7752
- Reply: https://github.com/microsoft/autogen/discussions/7752#discussioncomment-17677084
- Message: summarized the PR opening, external review, and Kuberna conformance
  fixture, while stating that the next step is maintainer review of
  `microsoft/autogen#7961`.
- Status: external reproduction and review remain the strongest AutoGen signal.

## New Door-To-Door Targets

### mcp-agent

- Thread: https://github.com/lastmile-ai/mcp-agent/discussions/696
- Reply: https://github.com/lastmile-ai/mcp-agent/discussions/696#discussioncomment-17677087
- Fit: existing discussion about pre-action authority receipts for MCP workflow
  agents.
- Message: described AIPOU's small lifecycle adapter, pre-action authority fact,
  post-work receipt linked by `preActionFactId`, local hashes, replay checks,
  and structured tool-execution deny/allow states. Asked whether `mcp-agent`
  would prefer a companion MCP server plus lifecycle hook or trace/span metadata.
- Status: first targeted contribution to this specific discussion; no response
  or adoption yet.

### AgentGraph

- Thread: https://github.com/microsoft/autogen/discussions/7476
- Reply: https://github.com/microsoft/autogen/discussions/7476#discussioncomment-17677092
- Fit: active AutoGen discussion about trust verification, DID identity,
  scanning, trust scores, and attestations for agents.
- Message: positioned AIPOU as narrower than a trust score: authority receipts
  and work receipts can feed trust systems without becoming the score itself.
  Asked where external receipt artifacts should attach: agent profile, specific
  run/tool-call, or separate audit artifact.
- Status: new outreach; no response yet.

### Strands / ZeroID

- Thread: https://github.com/strands-agents/harness-sdk/discussions/2137
- Reply: https://github.com/strands-agents/harness-sdk/discussions/2137#discussioncomment-17677095
- Fit: discussion explicitly covers agent identity, delegation, revocation, and
  signed audit receipts using Ed25519.
- Message: proposed complementarity: ZeroID for agent identity/delegation and
  AIPOU for concrete work receipts and optional human reward eligibility. Asked
  whether signed audit receipts should attach at tool-call, workflow/run, or
  delegation-token exchange boundaries.
- Status: new outreach; no response yet.

## Decisions

- Do not claim any new production user, claim, integration, or adoption from
  this round.
- Count ElizaOS/Kuberna as a concrete conformance collaboration.
- Count AutoGen as external reproduction/review plus an upstream PR awaiting
  maintainer review.
- Count mcp-agent, AgentGraph, and ZeroID as new outreach targets.
- Continue asking concrete lifecycle and trust-boundary questions instead of
  posting generic token promotion.

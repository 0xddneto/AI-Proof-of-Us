# Door-To-Door Outreach - July 18, 2026

This log records the July 18 outreach round after the Forge trust score,
MCP Registry listing, BaseScan verification, AutoGen PR review, and
ElizaOS/Kuberna conformance fixture were already public.

## Guardrails

- No price, yield, liquidity, investment value, or guaranteed reward was
  promised.
- AIPOU was presented as MCP-first receipt infrastructure for humans working
  with AI agents.
- Human rewards were described as optional and validator-approved.
- Payment receipts, work receipts, authority facts, traces, and token claims
  were kept separate.
- Comments were posted only where the thread topic was directly about agent
  receipts, MCP identity/delegation, provenance, trust, or AI-agent security.

## Posted

### ArmorerLabs / Armorer

- Thread: https://github.com/ArmorerLabs/Armorer/discussions/43
- Reply: https://github.com/ArmorerLabs/Armorer/discussions/43#discussioncomment-17680814
- Topic: "Agent Receipt Spec: what should every agent run record?"
- Message: positioned AIPOU as a work-receipt layer around a human/agent work
  unit, with wallet authorization, nonce, local hashes, Ed25519 collector
  signature, replay checks, and optional validator-approved claim. Asked whether
  stable external links such as `workReceiptId`, `authorityFactId`,
  `traceId/spanId`, and `policyDecisionId` should be part of the receipt spec.
- Status: new outreach; no response yet.

### Model Context Protocol

- Thread: https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2404
- Reply: https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2404#discussioncomment-17680815
- Topic: agent identity and delegation for MCP tool calls.
- Message: framed AIPOU as complementary to agent identity/delegation, not a
  replacement. Explained the pre-action authority fact, post-work receipt, and
  optional claim/reward settlement as separate layers. Asked whether a
  work-receipt reference belongs in tool-call metadata, result `_meta`, trace
  attributes, or a separate audit artifact.
- Status: new outreach; no response yet.

### A2A

- Thread: https://github.com/a2aproject/A2A/discussions/741
- Reply: https://github.com/a2aproject/A2A/discussions/741#discussioncomment-17680825
- Topic: Agent Registry proposal.
- Message: positioned AIPOU as an external task/run receipt that could link to
  Agent Card or registry evidence without becoming standing identity. Asked
  whether A2A would prefer external work receipts as Agent Card extensions, task
  metadata, artifact metadata, or separate audit artifacts linked by URI/digest.
- Status: new outreach; no response yet.

### GitHub Community

- Thread: https://github.com/orgs/community/discussions/193727
- Reply: https://github.com/orgs/community/discussions/193727#discussioncomment-17680826
- Topic: security headaches introduced by AI in projects.
- Message: described attribution after AI-agent actions as the core headache
  and introduced AIPOU as one possible open-source signed receipt pattern using
  nonce/replay checks, hashes instead of raw prompts/outputs, and a collector
  signature. Asked whether others solve the problem with signed receipts, OTel
  span links, policy decision logs, or another mechanism.
- Status: broader community outreach; no response yet.

## Attempted But Not Posted

### Vercel AI / x402

- Thread: https://github.com/vercel/ai/issues/13905
- Topic: x402 payments with human approval and spend caps.
- Result: relevant draft prepared, but the browser session did not expose a
  normal issue comment button. No comment was posted.
- Draft theme: AIPOU as a post-work receipt layer beside x402 payment receipts,
  not a replacement for payment settlement.

### Obsigna / Agent Receipts

- Thread: https://github.com/agent-receipts/obsigna/issues/762
- Topic: exporting receipt chains as OTLP traces.
- Result: relevant draft prepared, but no visible comment textarea was available
  in the browser session. No comment was posted.
- Draft theme: whether external work receipts should appear as OTLP span
  attributes, span links, events, or separate artifacts.

### A2A Agent Card Identity Issue

- Thread: https://github.com/a2aproject/A2A/issues/2043
- Topic: DANE-anchored identity for Agent Cards.
- Result: relevant draft prepared, but the browser session did not expose a
  normal issue comment button. No comment was posted.
- Draft theme: post-work receipts should not be mixed into standing identity
  fields unless clearly typed as external evidence.

## New Target Notes

- CrewAI discussion result from search returned a GitHub 404 in the browser
  session, so no post was attempted.
- Agent Receipts / Obsigna is highly relevant, but current open issues are
  narrow implementation tickets. A future contribution should be a concrete
  interop fixture, not a generic comment.
- Vercel AI / x402 remains a good target once issue commenting is available.
- Issue pages may require account/2FA state that the current browser session
  did not satisfy; GitHub Discussions remained postable.

## Current Status

This round produced four new public outreach posts. It does not establish new
adoption, external receipts, package installs, claims, or integrations.

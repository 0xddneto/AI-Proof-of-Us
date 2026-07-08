# AIPOU Follow-Ups - 2026-07-08

This note records the public follow-ups posted after applying the identity / receipt / reliance-boundary feedback.

## Repository Update

Commit:

- https://github.com/0xddneto/AI-Proof-of-Us/commit/e4aaa39

Applied changes:

- Documented AIPOU as the receipt layer in a three-part model: identity/principal anchor, work receipt, reliance decision.
- Added `scheme: "aipou-receipt-v1"`, `subject`, and `relianceBoundary` to external receipt references.
- Repeated that AIPOU receipts are `issuer_asserted` audit artifacts, not universal trust badges.
- Updated the lifecycle adapter demo output to match the new metadata shape.
- Added ClawHub scan guidance to the OpenClaw review checklist.
- Corrected README publication status to npm `aipou-mcp-server@0.2.1` while noting MCP Registry lag.

Validation:

- `npm run build`
- `npm run test -w mcp-server`
- `npm run demo` from `examples/lifecycle-adapter`
- local secret-pattern scan over public docs/examples/source paths

ClawHub status:

- `clawhub scan -h` could not be run because `clawhub` was not installed in the local Windows environment.
- The public OpenClaw reply explicitly says the scan was not run and should be the next step before upload/listing claims.

## Public Replies Posted

| Target | URL | Follow-up |
| --- | --- | --- |
| OpenClaw / ClawHub | https://github.com/openclaw/clawhub/issues/2946 | Replied to Patrick-Erichsen with commit, validation, docs, and honest `clawhub` scan blocker. |
| CoSAI WS4 | https://github.com/cosai-oasis/ws4-secure-design-agentic-systems/issues/110 | Replied with identity/principal anchor, work receipt, and reliance-decision layering. |
| ElizaOS | https://github.com/orgs/elizaOS/discussions/9810 | Replied with `issuer_asserted + aipou-receipt-v1`, subject-keyed reference, and fail-closed scheme framing. |
| mcp-agent | https://github.com/lastmile-ai/mcp-agent/discussions/716 | Replied with lifecycle adapter output and asked where `workReceiptId` should attach. |
| OpenLLMetry / Traceloop | https://github.com/traceloop/openllmetry/issues/4340 | Replied with optional span/run attributes such as `aipou.work_receipt_id`, evidence class, scheme, and validation status. |
| awesome-mcp-servers | https://github.com/punkpeye/awesome-mcp-servers/issues/9036 | Replied with listing-readiness update and category-fit question. |
| agent-services-mcp | https://github.com/Gareth1953/agent-services-mcp/issues/1 | Replied with `external_receipts` reference shape and separation from token claim validation. |

## Interpretation

The recommendations were useful and were applied. They make AIPOU easier to review because the protocol no longer asks other systems to treat a receipt as identity, proof of objective value, security approval, or payment settlement.

The strongest updated framing is:

```text
AIPOU is a human/agent work receipt layer.
It can reference identity anchors.
It can inform external reliance decisions.
It does not replace those layers.
```

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

- `npx -y clawhub@latest scan -h` runs successfully with ClawHub CLI `0.23.1`.
- Local folder scans are no longer supported by the current CLI. Scanning now requires uploading/publishing a skill version, then downloading the stored report with `clawhub scan download <slug> --version <version>`.
- `npx -y clawhub@latest publish skills/aipou-farming --dry-run --json` returned `would-publish` for slug `aipou-farming`, version `1.0.0`, 3 files, fingerprint `32e85f00f36d653155fe3de25b1181d5fc35ee5cdc2061a69e6ce7e65c76d6e5`.
- `clawhub whoami` and `clawhub scan download` still require ClawHub login. AIPOU must not claim a passed ClawHub scan until a stored report exists.
- A public OpenClaw reply now records this updated scan path and dry-run result.

## Public Replies Posted

| Target | URL | Follow-up |
| --- | --- | --- |
| OpenClaw / ClawHub | https://github.com/openclaw/clawhub/issues/2946 | Replied to Patrick-Erichsen with commit, validation, docs, and honest `clawhub` scan blocker; later updated with verified CLI help, dry-run result, and the new stored-report scan path. |
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

## ElizaOS Reply And Response

The ElizaOS discussion author replied after the `e4aaa39` update and said the
alignment is now clean: `issuer_asserted`, a scheme-specific discriminant, and
a subject key for registry-level invariants.

The additional recommendation was to enforce `scheme + trustVariant`
compatibility at registry insert time. A known scheme under the wrong
verification kind must be rejected even when its payload happens to match the
expected fields.

AIPOU replied with the precise current boundary:

- `issuer_asserted + aipou-receipt-v1` is the only valid pair for an AIPOU task-receipt payload;
- unknown or mismatched scheme/kind pairs must fail closed;
- chain-derived root, inclusion, timestamp, wallet, amount, and claimed-state facts remain separate from the collector-signed task payload;
- the lifecycle adapter currently emits a fixed valid pair, but AIPOU does not yet publish a generic registry-insert validator;
- AIPOU offered a positive fixture and negative interop tests for unknown schemes, wrong verification kinds, duplicate active records, and incorrectly relabeled anchored payloads.

Reply: https://github.com/orgs/elizaOS/discussions/9810

## Public Status Snapshot

Checked on July 8, 2026 after the ElizaOS reply:

| Surface | Current signal |
| --- | --- |
| npm | `aipou-mcp-server@0.2.1`, 277 downloads from July 1-8 |
| Official MCP Registry | Active, still advertising package version `0.2.0` |
| External MCP index | Listed by `mcpindex.ai` under Developer Tools |
| GitHub | 1 star, 0 forks, 0 external issues or PRs |
| Hugging Face Space | Running, 0 likes |
| Website | Live with HTTP 200 |
| Aerodrome / DEX Screener | Pair indexed; approximately $102.90 displayed liquidity at check time |
| LP lock | `99.9999%` locked until July 8, 2027 |
| Local receipt state | 44 recorded, 38 claimed, 6 pending, 1 incomplete session |

External thread status:

- ElizaOS produced the strongest new response and explicitly validated the updated interop direction.
- OpenClaw remains a security/product-policy review path; no listing or adoption is confirmed.
- CoSAI previously provided useful layering feedback; no new adoption signal followed the AIPOU update.
- mcp-agent, OpenLLMetry, awesome-mcp-servers, and agent-services-mcp still have no external maintainer response to the latest follow-ups.

The correct conclusion remains: AIPOU is installable, discoverable, publicly
reviewed, and technically better aligned with adjacent receipt work. There is
still no confirmed third-party receipt, integration, PR, or active external
user that can be counted as adoption.

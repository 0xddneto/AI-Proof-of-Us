# AIPOU Adoption Round - July 22, 2026

This round improved package trust and directory discovery after the public
`0.4.0` persistent-identity release.

## Public State Verified

- npm reports `aipou-mcp-server@0.4.0` as latest.
- The official MCP Registry reports
  `io.github.0xddneto/ai-proof-of-us@0.4.0` as active and latest.
- The MCP.so submission remains open at
  https://github.com/chatmcp/mcpso/issues/3255.
- The Awesome MCP Servers pull request remains open at
  https://github.com/punkpeye/awesome-mcp-servers/pull/10577.
- The Glama listing returns HTTP 200 and identifies AI Proof of Us.

## Trust And Discovery Improvements

- Added a root `glama.json` using Glama's published schema and declaring
  `0xddneto` as maintainer. The file validates against the live schema.
- Added live npm-version and Glama-quality badges to the project README.
- Corrected stale `0.3.1` current-version references across the README,
  publication guide, registry trust checklist, funding brief, and outreach
  index. Historical `0.3.1` evidence remains dated and preserved.
- Published GitHub Release `v0.4.0`, targeted at commit `b6030e7`, which is the
  commit containing the published package and synchronized lockfile:
  https://github.com/0xddneto/AI-Proof-of-Us/releases/tag/v0.4.0
- Release notes expose the zero-configuration demo, protected persistent init,
  package provenance, official Registry name, tests, and security boundary.

## Measurement Checkpoint

- The public npm downloads API reports 385 downloads on July 21, compared with
  7 on July 20, 11 on July 19, and 7 on July 18.
- This is a distribution signal only. npm counts can include directory crawlers,
  CI, evaluation commands, caches, and maintainer tests; they do not prove 385
  users, successful integrations, receipts, claims, or production adoption.

## Verification

- 31 MCP tests and 11 contract tests pass from the current `main` checkout.
- `glama.json` passes the live Glama JSON Schema.
- `git diff --check` passes.
- Pre-existing untracked `output/` material was not modified.


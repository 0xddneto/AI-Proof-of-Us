# AIPOU Adoption Round - July 21, 2026

This round turned the disposable receipt demo into a public distribution and
discovery path, then submitted AIPOU to an independently maintained MCP list.

## Initial Public Release Verified

- At first publication, npm reported `aipou-mcp-server@0.3.0` as `latest`.
- At that checkpoint, the official MCP Registry reported
  `io.github.0xddneto/ai-proof-of-us@0.3.0` as active and latest.
- GitHub Actions runs `29832656358` (npm) and `29832913592` (MCP Registry)
  completed successfully.
- The GitHub Pages site returns HTTP 200 and exposes the one-command demo.
- `npx -y aipou-mcp-server@0.3.0 --demo` completed from a neutral temporary
  directory with both signature checks true, no network requirement, no funds
  moved, and temporary receipt state removed.

## External Directory Submission

- Target: `punkpeye/awesome-mcp-servers`, an independently maintained MCP
  directory with approximately 91,000 GitHub stars at submission time.
- Pull request: https://github.com/punkpeye/awesome-mcp-servers/pull/10577
- Fork commit: `0xddneto/awesome-mcp-servers@626a5dc`.
- Category: Monitoring, beside other local agent observability and signed audit
  tools.
- Entry: receipt/provenance framing, raw-content privacy boundary, replay
  checks, Glama score badge, and the disposable `npx` demo.
- Automation disclosure: the PR title includes the target repository's required
  `🤖🤖🤖` marker for automated-agent submissions.
- Initial repository validation labels: `has-emoji`, `valid-name`, and
  `has-glama`; `check-submission` completed successfully and GitHub reported
  the PR as cleanly mergeable when checked.

## Release Metadata Correction

- Review found that npm package `0.3.0` still advertised `0.2.2` in the MCP
  initialization handshake because the server version was hardcoded.
- Commit `4c75f27` now derives the handshake version from the published
  `mcp-server/package.json` and adds a real MCP client initialization test.
- npm `0.3.1` was published by trusted-publishing run `29833762433` and the MCP
  Registry update completed in run `29833835701`.
- A client launched the public npm package and observed
  `{ "name": "aipou-mcp", "version": "0.3.1" }` in the handshake.
- The official MCP Registry then reported `0.3.1` active and latest.

## Persistent Identity Release

- npm and the official MCP Registry both report
  `aipou-mcp-server@0.4.0` as latest.
- The public `npx -y aipou-mcp-server@0.4.0 --init` flow creates a protected
  dedicated-wallet key without printing it and returns ready-to-copy MCP
  configuration.
- Re-running the command is idempotent: it returns the same public wallet and
  reports `persistent_identity_already_initialized` instead of overwriting the
  key or emitting a stack trace.
- The release passed 31 MCP tests and 11 contract tests before publication.

## Additional Discovery Work

- Submitted AIPOU to MCP.so through the directory's public GitHub workflow:
  https://github.com/chatmcp/mcpso/issues/3255
- The submission documents the zero-configuration demo, persistent init,
  privacy boundary, nine MCP tools, current release, and official Registry
  entry. It was open at the verification time and is not counted as an accepted
  listing yet.
- Added a repository description, GitHub Pages homepage, and 14 focused GitHub
  topics, including `mcp-server`, `model-context-protocol`, `ai-agents`,
  `agent-provenance`, `work-receipts`, `eip-712`, and `ed25519`.
- A separate directory form could not be completed because no interactive
  browser session was available. No submission is claimed for that directory.

## Evidence Boundary

The public releases and open directory submissions are verified distribution
progress. They are not yet accepted listings, external installations,
integrations, receipts, claims, or production adoption. Those require separate
evidence.

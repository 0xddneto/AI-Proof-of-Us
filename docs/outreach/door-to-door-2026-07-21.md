# AIPOU Adoption Round - July 21, 2026

This round turned the disposable receipt demo into a public distribution and
discovery path, then submitted AIPOU to an independently maintained MCP list.

## Public Release Verified

- npm reports `aipou-mcp-server@0.3.0` as `latest`.
- The official MCP Registry reports
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
  `has-glama`; GitHub reported the PR as mergeable when checked.

## Release Metadata Correction

- Review found that npm package `0.3.0` still advertised `0.2.2` in the MCP
  initialization handshake because the server version was hardcoded.
- Commit `4c75f27` now derives the handshake version from the published
  `mcp-server/package.json` and adds a real MCP client initialization test.
- npm `0.3.1` was published by trusted-publishing run `29833762433` and the MCP
  Registry update completed in run `29833835701`.
- A client launched the public npm package and observed
  `{ "name": "aipou-mcp", "version": "0.3.1" }` in the handshake.
- The official MCP Registry reports `0.3.1` active and latest.

## Evidence Boundary

The public release and open pull request are verified distribution progress.
They are not yet a merged listing, external installation, integration, receipt,
claim, or production adoption. Those require separate evidence.

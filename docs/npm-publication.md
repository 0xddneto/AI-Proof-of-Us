# npm Publication

The `aipou-mcp-server` package is published on npm and registered in the official MCP Registry.

## Current Package

- Package: `aipou-mcp-server`
- published npm version: `0.6.1`
- MCP name: `io.github.0xddneto/ai-proof-of-us`
- MCP Registry version: `0.6.1`
- Binary: `aipou-mcp`
- Runtime: Node.js 20+
- Transport: MCP stdio
- Package directory: `mcp-server`

## Verify

```bash
npm run pack:check -w mcp-server
npm run smoke:package
npm run smoke:package -- --published
npm audit --omit=dev -w mcp-server
C:\tmp\mcp-publisher.exe validate
```

## npm

```bash
npx -y aipou-mcp-server@0.6.1
```

Published package:

- https://www.npmjs.com/package/aipou-mcp-server
- https://github.com/0xddneto/AI-Proof-of-Us/releases/tag/v0.6.1

## Provenance Publication

Version `0.5.0` was published on July 22, 2026 through npm Trusted Publishing, so registries can verify the GitHub Actions workflow that produced the package without a long-lived npm token.

```bash
npm publish --workspace mcp-server --provenance --access public
```

The npm trusted publisher is configured with GitHub owner `0xddneto`, repository `AI-Proof-of-Us`, workflow filename `npm-publish.yml`, and the `npm publish` permission. Future releases use the manual workflow in `.github/workflows/npm-publish.yml`.

Version 0.6.1 publication evidence:

- npm provenance workflow: https://github.com/0xddneto/AI-Proof-of-Us/actions/runs/43285283715
- npm attestation: https://registry.npmjs.org/-/npm/v1/attestations/aipou-mcp-server@0.6.1
- source gitHead: `9cb4222cfdfbf1ff964484bb6d9dd4a51a963005`
- MCP Registry workflow: https://github.com/0xddneto/AI-Proof-of-Us/actions/runs/43286018804

Historical 0.6.0 publication evidence:

- npm provenance workflow: https://github.com/0xddneto/AI-Proof-of-Us/actions/runs/43266517865
- npm attestation: https://registry.npmjs.org/-/npm/v1/attestations/aipou-mcp-server@0.6.0
- source gitHead: `2ba7a1bad594751a5d100054c591249021a6dc1d`
- MCP Registry workflow: https://github.com/0xddneto/AI-Proof-of-Us/actions/runs/43267017118

Publication can be accepted before npm makes a version installable. The
[npm publish-time scan](https://github.blog/changelog/2026-07-28-npm-publish-time-malware-scanning-and-dual-use-metadata/)
can delay availability. Registry publication retries metadata lookup; use the
published-package smoke test above to verify the installation itself.

Historical 0.5.0 publication evidence:

- GitHub Actions workflow: https://github.com/0xddneto/AI-Proof-of-Us/actions/runs/29922407539
- npm provenance attestation: https://registry.npmjs.org/-/npm/v1/attestations/aipou-mcp-server@0.5.0

The package bundles only the MCP stdio runtime reachable by AIPOU. The
SDK and its unused HTTP transports remain development dependencies, so a clean
production installation does not install `@hono/node-server`. The November 12,
2026 production audit of the 0.6.0 dependency tree reported zero known
vulnerabilities. Audit results are time-sensitive; run the command above again.

Registry trust checklist:

- [docs/registry-trust.md](registry-trust.md)

## Smoke Test Published Package

The shortest public smoke test needs no checkout, wallet, funds, RPC, or
persistent receipt state:

```bash
npx -y aipou-mcp-server@0.6.1 --demo
```

For the complete lifecycle adapter output:

```bash
cd examples/lifecycle-adapter
npm install
AIPOU_DEMO_USE_NPX=1 npm run demo
```

The smoke test creates a local receipt only. It does not claim rewards or send funds.

## Publish To MCP Registry

The MCP Registry stores metadata only. Publish to npm first, then publish `mcp-server/server.json`.

```bash
cd mcp-server
mcp-publisher validate
mcp-publisher login github
mcp-publisher publish
```

The package `mcpName` must match `server.json`:

```text
io.github.0xddneto/ai-proof-of-us
```

Do not paste npm passwords, npm tokens, GitHub device codes, or private keys into chat. Complete npm and GitHub login in the browser or terminal controlled by the repository owner.

Published Registry entry:

```text
io.github.0xddneto/ai-proof-of-us@0.6.1
```

Historical 0.5.0 Registry publication workflow:

- https://github.com/0xddneto/AI-Proof-of-Us/actions/runs/29922561722

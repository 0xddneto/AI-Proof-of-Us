# npm Publication

The `aipou-mcp-server` package is published on npm and registered in the official MCP Registry.

## Current Package

- Package: `aipou-mcp-server`
- published npm version: `0.3.1`
- MCP name: `io.github.0xddneto/ai-proof-of-us`
- MCP Registry version: `0.3.1`
- Binary: `aipou-mcp`
- Runtime: Node.js 20+
- Transport: MCP stdio
- Package directory: `mcp-server`

## Verify

```bash
npm run pack:check -w mcp-server
C:\tmp\mcp-publisher.exe validate
```

## npm

```bash
npx -y aipou-mcp-server
```

Published package:

- https://www.npmjs.com/package/aipou-mcp-server

## Provenance Publication

Version `0.3.1` was published on July 21, 2026 through npm Trusted Publishing, so registries can verify the GitHub Actions workflow that produced the package without a long-lived npm token.

```bash
npm publish --workspace mcp-server --provenance --access public
```

The npm trusted publisher is configured with GitHub owner `0xddneto`, repository `AI-Proof-of-Us`, workflow filename `npm-publish.yml`, and the `npm publish` permission. Future releases use the manual workflow in `.github/workflows/npm-publish.yml`.

Published evidence:

- GitHub Actions workflow: https://github.com/0xddneto/AI-Proof-of-Us/actions/runs/29833762433
- npm provenance attestation: https://registry.npmjs.org/-/npm/v1/attestations/aipou-mcp-server@0.3.1

Registry trust checklist:

- [docs/registry-trust.md](registry-trust.md)

## Smoke Test Published Package

The shortest public smoke test needs no checkout, wallet, funds, RPC, or
persistent receipt state:

```bash
npx -y aipou-mcp-server --demo
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
io.github.0xddneto/ai-proof-of-us@0.3.1
```

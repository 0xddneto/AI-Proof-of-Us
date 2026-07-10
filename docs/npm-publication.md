# npm Publication

The `aipou-mcp-server` package is published on npm and registered in the official MCP Registry.

## Current Package

- Package: `aipou-mcp-server`
- npm version: `0.2.1`
- MCP name: `io.github.0xddneto/ai-proof-of-us`
- MCP Registry version: `0.2.0` at last check; registry metadata can lag npm publication
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

The next npm publication should use GitHub Actions provenance so registries can verify the source workflow that produced the package.

```bash
npm publish --workspace mcp-server --provenance --access public
```

Use the manual workflow in `.github/workflows/npm-publish.yml` after npm Trusted Publishing is configured for this repository and package.

Registry trust checklist:

- [docs/registry-trust.md](registry-trust.md)

## Smoke Test Published Package

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

Published Registry entry at last check:

```text
io.github.0xddneto/ai-proof-of-us@0.2.0
```

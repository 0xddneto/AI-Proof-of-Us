# npm Publication

The `aipou-mcp-server` package is prepared for public npm distribution, but publication requires an authenticated npm account controlled by the repository owner.

## Current Package

- Package: `aipou-mcp-server`
- Binary: `aipou-mcp`
- Runtime: Node.js 20+
- Transport: MCP stdio
- Package directory: `mcp-server`

## Verify Before Publishing

```bash
npm run pack:check -w mcp-server
```

## Publish

```bash
npm adduser
npm publish -w mcp-server --access public
```

After publication, users can run:

```bash
npx -y aipou-mcp-server
```

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

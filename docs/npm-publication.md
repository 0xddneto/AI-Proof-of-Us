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

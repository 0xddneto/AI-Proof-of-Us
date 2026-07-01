# Awesome MCP Servers PR Draft

Target:

- https://github.com/punkpeye/awesome-mcp-servers

Why this is the best first PR:

- AIPOU is MCP-first.
- The repo accepts MCP server entries.
- The pitch can stay technical: receipt, provenance, replay protection, validation.
- No token/investment framing is needed.

Contribution notes:

- Edit the main `README.md`.
- Follow the existing item format.
- Add one server per line.
- Use a brief description.
- Put the entry in the most relevant existing category if possible.
- If no provenance/audit category exists, propose a small `Provenance & Audit` category.

Suggested title:

```text
Add AI Proof of Us MCP receipt server
```

Suggested entry:

```markdown
- [AI Proof of Us](https://github.com/0xddneto/AI-Proof-of-Us) - MCP-first receipt protocol for AI agents. Creates signed task receipts with EIP-712 wallet authorization, local Ed25519 collector signatures, replay checks, and optional Base claims.
```

Suggested PR body:

```markdown
Adds AI Proof of Us, an MCP-first receipt/provenance server for AI-agent tasks.

AIPOU records task lifecycle receipts with:

- wallet authorization
- unique task nonces
- local collector signatures
- replay checks
- optional on-chain claims

It is framed here as MCP provenance/audit infrastructure, not as an investment or token promotion.
```

Risk:

- If the list does not want crypto-related projects, keep the discussion focused on signed receipts and remove claim-token language from the description.

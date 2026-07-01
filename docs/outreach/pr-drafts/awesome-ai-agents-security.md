# Awesome AI Agents Security PR Draft

Target:

- https://github.com/ProjectRecon/awesome-ai-agents-security

Fit:

- Conditional.
- AIPOU should be submitted only as provenance/security metadata for autonomous-agent workflows.
- Do not frame it as rewards, farming, price, liquidity, or speculation.

Contribution notes:

- The project should be directly related to autonomous-agent security.
- The description should be concise.
- Use the format:

```markdown
- **[Tool Name](URL)** - concise description.
```

Suggested title:

```text
Add AI Proof of Us for signed agent task receipts
```

Suggested entry:

```markdown
- **[AI Proof of Us](https://github.com/0xddneto/AI-Proof-of-Us)** - MCP-first receipt and provenance server for AI-agent tasks, with wallet authorization, local collector signatures, nonce replay protection, and optional claim verification.
```

Suggested PR body:

```markdown
Adds AI Proof of Us as an agent provenance/security-adjacent tool.

The project records signed receipts for AI-agent task lifecycle events:

- task nonce creation
- wallet authorization
- local collector signature
- replay checks
- validation status

The security relevance is provenance and duplicate-receipt prevention for autonomous-agent work. It is not a scanner and does not replace sandboxing, policy enforcement, or runtime protection.
```

Risk:

- Maintainers may decide that receipt provenance is adjacent rather than core security. If so, the correct next step is to ask where agent provenance tools should be listed instead of arguing for inclusion.

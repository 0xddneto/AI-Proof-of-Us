# MCP Lifecycle Question Draft

Target:

- Model Context Protocol discussions, issues, or client/server maintainer channels where lifecycle metadata is already being discussed.

Goal:

- Learn where signed receipt identifiers belong before proposing a formal integration.

Suggested title:

```text
Where should signed task receipt IDs live in MCP client workflows?
```

Suggested message:

```markdown
I am experimenting with AIPOU, an MCP-first receipt layer for AI agents.

The goal is to record task lifecycle metadata as signed receipts while keeping raw prompts and outputs local. A receipt can include a task nonce, wallet authorization, client/provider/model metadata, local collector signature, replay checks, and validation status.

I am not proposing a core protocol change yet. I am trying to understand the cleanest integration surface:

- client lifecycle hooks
- tool result `_meta`
- trace/span attributes
- a companion MCP server

Where should a portable `receiptId` and validation status live so that clients can display provenance without forcing every server or log entry to know about AIPOU?
```

Do not say:

```text
This lets users farm tokens from every AI task.
```

Reason:

- Maintainers are more likely to engage with a protocol-placement question than with token promotion.

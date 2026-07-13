# Technical Follow-ups - 2026-07-12

This log separates external feedback, implemented changes, and confirmed adoption.

## AutoGen

Thread: https://github.com/microsoft/autogen/discussions/7752

Liuyanfeng1234 confirmed that pre-action authority and post-work evidence should remain separate artifacts. Their `admission_invariant` and sealed `canonical_envelope` cover authority before execution; an AIPOU `workReceiptId` belongs after completion.

Implemented in `7fc1a1d`:

- added the versioned `aipou-authority-work-link-v1` cross-artifact link;
- kept authority and work receipt IDs distinct;
- required `pre_action` and `post_work` phases plus a stable trace link;
- rejected phase inversions, self-references, mismatched work facts, and claim/reward fields presented as authority;
- expanded the lifecycle adapter from four to seven passing fixtures.

Response: https://github.com/microsoft/autogen/discussions/7752#discussioncomment-17616897

The response proposed exchanging one positive fixture and two negative fixtures with the AutoGen governance boundary. This is technical interoperability work, not confirmed adoption.

## ElizaOS

Thread: https://github.com/orgs/elizaOS/discussions/9810

Kawacukennedy reviewed the lifecycle adapter, asked how nonce collisions are handled, asked whether duplicate active facts are rejected at the database or application layer, and offered to reference AIPOU's interop document in the ElizaOS conformance draft.

Implemented in `9cdf245`:

- documented that `begin_ai_task` generates a 256-bit nonce with the operating system CSPRNG;
- documented that the farming wallet binds the nonce into the EIP-712 authorization;
- kept caller-controlled `clientSeed` out of v1 because it adds no entropy guarantee beyond the collector-generated nonce;
- documented that the current implementation rejects duplicates inside a cross-process file-locked application/store mutation, not a SQL constraint;
- added assertions that separate sessions receive separate bytes32 nonces and separate nonces derive separate `factId` values.

Response: https://github.com/orgs/elizaOS/discussions/9810#discussioncomment-17616911

ElizaOS plans to reference AIPOU's interoperability rules and fixtures in a draft. That is meaningful technical collaboration, but it is not yet a merged PR, integration, user, or production adoption.

## Publication Status

The npm Trusted Publisher connection is configured. `aipou-mcp-server@0.2.2` was published from GitHub Actions with SLSA provenance on July 13, 2026, and `io.github.0xddneto/ai-proof-of-us@0.2.2` was published to the official MCP Registry. Forge reindexing remains pending because its public listing still exposed stale `0.2.0` metadata at the latest check.

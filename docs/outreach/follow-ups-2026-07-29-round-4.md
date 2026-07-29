# Follow-Ups - July 29, 2026 (Round 4)

## LangGraph feedback applied

- Thread: <https://github.com/langchain-ai/langgraph/issues/7844>
- External guidance observed on July 29, 2026: <https://github.com/langchain-ai/langgraph/issues/7844#issuecomment-5114251271>
- Point adopted:
  - host evidence should be derived from graph state and captured tool output;
  - an external receipt should attach afterward as sibling post-work evidence, not become the host's completion truth.

## Repository changes made

The AIPOU docs now state this rule explicitly in the core integration notes:

- [docs/framework-lifecycle-adapter.md](../framework-lifecycle-adapter.md)
- [docs/work-receipt-boundaries.md](../work-receipt-boundaries.md)
- [docs/for-agents.md](../for-agents.md)

Summary of the change:

- host frameworks should derive completion and audit evidence from their own state, checkpoints, tool output, exit codes, or artifact digests;
- the same LLM that makes the claim should not write the host's authoritative evidence keys;
- `workReceiptId` remains a sibling post-work artifact for correlation, audit, and optional reward or settlement flows.

## Public reply posted

- A follow-up reply was posted on the LangGraph thread after the docs update.
- Message focus:
  - the recommendation was adopted on the AIPOU side;
  - the host-derived-evidence rule is now explicit in the public docs;
  - the baseline is now `host-derived evidence first, external receipt second`.

## Hermes note

- Thread: <https://github.com/NousResearch/hermes-agent/issues/16462>
- New automated triage on July 29, 2026 repeated that AIPOU's point is boundary-consistent but does not resolve Hermes' own approval-path blockers.
- No extra AIPOU reply was needed after that signal.

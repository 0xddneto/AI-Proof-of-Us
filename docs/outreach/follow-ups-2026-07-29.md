# Follow-Ups - July 29, 2026

## External responses checked

I re-checked the public outreach threads on Wednesday, July 29, 2026.

### Airblackbox / AIR Gate

- Thread: <https://github.com/airblackbox/airblackbox/discussions/39>
- New response: <https://github.com/airblackbox/airblackbox/discussions/39#discussioncomment-17819221>
- Key point: AIPOU should reference the Gate receipt inward by receipt ID and
  covenant hash. AIR's sealed artifact should stay unchanged; no
  `externalReceipts[]` should be appended to the seal.
- AIPOU decision: adopted. The interoperability docs now state that a sealed
  authority artifact must stay sealed and that AIPOU should reference it by the
  host's native binding fields.
- Follow-up posted on July 29, 2026: confirmed that AIPOU now keeps the Gate
  seal unchanged and will publish a small public fixture around the inward
  reference pattern.

### PIC / MCP security boundary

- Thread: <https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2478>
- New response: <https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2478#discussioncomment-17701973>
- Key point: `workReceiptId` should stay outside the enforcement path. The
  canonical interoperable shape is a separate digest-linked audit artifact;
  namespaced `_meta` may exist as implementation transport only.
- AIPOU decision: consistent with current docs. Keep the signed artifact
  separate and treat `_meta` as transport projection rather than canonical
  proof.
- Follow-up posted on July 29, 2026: confirmed that AIPOU keeps
  `workReceiptId` outside Action Proposal / enforcement state and treats `_meta`
  as transport only.

### AgentGraph / AutoGen trust discussion

- Thread: <https://github.com/microsoft/autogen/discussions/7476>
- New response 1: <https://github.com/microsoft/autogen/discussions/7476#discussioncomment-17819031>
- New response 2: <https://github.com/microsoft/autogen/discussions/7476#discussioncomment-17819189>
- Key point: AgentGraph published a minimal public cross-fixture for
  `action_ref` to `workReceiptId` linkage with one valid vector and two
  fail-closed cases owned by different verifiers.
- AIPOU decision: treat this as interoperability validation only, not an
  integration claim. Mirror the fixture style on the AIPOU side and keep scores
  separate from receipts.
- Follow-up posted on July 29, 2026: accepted the cross-fixture pattern,
  endorsed the split verifier ownership, and committed to mirroring it as
  interoperability validation only.

### OpenLLMetry legacy AIPOU-specific PR

- PR: <https://github.com/traceloop/openllmetry/pull/4373>
- Latest comment: <https://github.com/traceloop/openllmetry/pull/4373#issuecomment-5073387296>
- Key point: contributor asked for review on the AIPOU-prefixed attributes PR.
- AIPOU decision: current preferred direction is the newer generic external
  evidence shape from the semantic-conventions RFC, not vendor-specific AIPOU
  keys. Respond on the PR with that clarification so the contributor is not
  left waiting on an outdated direction.
- Follow-up posted on July 29, 2026: clarified that AIPOU would not push the
  vendor-specific semconv path further unless maintainers explicitly want that
  example, and that the generic external-evidence direction is now preferred.

## No new external replies yet

As of July 29, 2026, these newer July 27-28 outreach threads had no replies
after AIPOU's latest post:

- <https://github.com/pydantic/pydantic-ai/issues/6452>
- <https://github.com/run-llama/llama_index/issues/21317>
- <https://github.com/mastra-ai/mastra/pull/19645>
- <https://github.com/crewAIInc/crewAI/pull/6030>
- <https://github.com/microsoft/agent-framework/discussions/6078>
- <https://github.com/microsoft/semantic-kernel/discussions/14200>

## Non-actionable noise

- AutoGen discussion `#7752` received an unrelated spam-style reply. No
  technical follow-up is warranted.

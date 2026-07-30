# Paybox Interoperability Outreach - July 30, 2026

## What was shared

AIPOU tested a user-authorized Paybox MCP connection as a concrete example of
how agent payments and AI-work receipts can complement one another.

Paybox is an independent product. There is no Paybox, MoonPay, or Launchpad
partnership, endorsement, joint launch, or claim that Paybox validates AIPOU
work, rewards, or claims.

The message shared with communities was intentionally narrow:

1. The host framework keeps its native execution, checkpoint, and delivery
   evidence.
2. Paybox keeps user-scoped credential authority, approval policy, and its own
   operation or payment record.
3. AIPOU creates an optional post-work `workReceiptId` using local hashes.
4. A fail-closed external-evidence link may correlate opaque references and
   digests, without making payment evidence prove work or making work evidence
   prove payment.

This makes human approval at the money boundary compatible with a private,
portable record of AI-assisted work. AIPOU does not receive Paybox credentials
or private keys.

## Published updates

- [LangGraph #7844](https://github.com/langchain-ai/langgraph/issues/7844#issuecomment-5132695329): lifecycle completion remains native; Paybox is the approval layer and AIPOU is post-work evidence.
- [Hermes Agent #16462](https://github.com/NousResearch/hermes-agent/issues/16462#issuecomment-5132698444): first-invoke approval, financial approval, and post-work receipt stay separate.
- [Work Receipt Spec #1](https://github.com/genzagents/work-receipt-spec/issues/1#issuecomment-5132710394): host, payment/control-plane, and issuer-anchored work receipts are sibling artifacts.
- [A2A discussion #1341](https://github.com/a2aproject/A2A/discussions/1341#discussioncomment-17841959): A2A semantics, Paybox authorization, and AIPOU evidence remain independently verifiable.
- [UCP discussion #240](https://github.com/Universal-Commerce-Protocol/ucp/discussions/240#discussioncomment-17841954): a payment or session artifact remains authoritative for payment; the AIPOU receipt remains post-work evidence.
- [ElizaOS discussion #9810](https://github.com/orgs/elizaOS/discussions/9810#discussioncomment-17841967): Paybox authority is not relabeled as `chain_derivable`; AIPOU remains `issuer_asserted`.
- [AutoGen discussion #7752](https://github.com/microsoft/autogen/discussions/7752#discussioncomment-17841973): intervention policy, approval gating, payment, and completion are separate states.

## Deliberately not posted

- AIIR discussion #208 returned GitHub 404 during this pass, so no message was forced.
- OpenClaw/ClawHub issue #2946 is about skill review and is closed. A payment-control-plane update would not have been relevant there, so no duplicate or off-topic reply was posted.

## Public technical reference

- [Paybox + AIPOU interoperability proposal](../paybox-interoperability.md)


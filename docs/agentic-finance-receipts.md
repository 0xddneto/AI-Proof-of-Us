# Agentic Finance Receipts

AI agents can now research markets, inspect accounts, prepare orders, and act
through financial MCP servers. AIPOU offers a complementary receipt layer for
these workflows: it records what a user authorized and what an agent reported
attempting or completing, without becoming a broker, custodian, trading
strategy, or source of execution truth.

## Pilot Goal

The proposed pilot attaches a private, signed `workReceiptId` to an agentic
finance task at the point where authorization or execution crosses a trust
boundary.

For a Robinhood Trading MCP integration, a receipt could correlate:

- the user's task authorization and unique nonce;
- the agent, client, provider, and model identifiers;
- hashes of the strategy constraints and requested action;
- a hash of the MCP result or broker-issued reference;
- the AIPOU receipt verification status;
- an optional Robinhood order reference, stored as a digest when required by
  privacy policy.

Raw prompts, account numbers, balances, positions, order details, and strategy
text do not need to enter the public receipt or the AIPOU claim contract.

## Three Separate Facts

An integration must keep these facts separate:

1. `user_authorized`: a wallet-authorized AIPOU task receipt shows that a
   dedicated identity authorized a specific hashed task and nonce.
2. `agent_reported`: the agent or collector signed a receipt describing the
   result it observed at the MCP boundary.
3. `broker_confirmed`: only Robinhood or a Robinhood-issued artifact can prove
   that an order was accepted, rejected, canceled, filled, or settled.

AIPOU must never upgrade `agent_reported` into `broker_confirmed`. A broker
reference remains an external evidence link and is interpreted under the
broker's own trust domain.

## Minimal Integration Shape

```json
{
  "type": "aipou.agentic_finance_receipt",
  "workReceiptId": "0x...",
  "scheme": "aipou-receipt-v1",
  "evidenceClass": "issuer_asserted",
  "phase": "authorization | attempted_action | observed_result",
  "taskHash": "0x...",
  "actionHash": "0x...",
  "brokerEvidence": {
    "provider": "robinhood",
    "referenceDigest": "sha256:...",
    "status": "externally_reported"
  },
  "verificationStatus": "local | validated | claimed | rejected"
}
```

The broker evidence object is optional. Its presence is a correlation aid, not
an AIPOU assertion that a trade happened.

## Safety Rules

- AIPOU does not place orders, recommend assets, custody funds, or replace
  Robinhood controls.
- Rewards must not depend on trading volume, order count, losses, gains, asset
  choice, or frequency of trading.
- A receipt must not encourage a user or agent to trade more.
- Failed, canceled, rejected, and policy-blocked actions remain valid audit
  outcomes when accurately labeled; they are not successful executions.
- Sensitive financial data stays local unless the user separately authorizes
  disclosure.
- The integration fails closed when phase ordering, hashes, nonce, signature,
  or external evidence links do not verify.

## Pilot Proposal

A small technical pilot can be completed without changing Robinhood's
execution or custody model:

1. define one receipt attachment point around the Trading MCP boundary;
2. exchange one synthetic valid fixture and two fail-closed fixtures;
3. verify authorization, receipt signature, phase ordering, and reference
   digests without real account data or live orders;
4. decide whether `workReceiptId` belongs in MCP result metadata, agent run
   metadata, or a separate audit export;
5. evaluate the receipt layer independently from optional AIPOU rewards and
   Base settlement.

The first pilot should use synthetic data only. No customer funds, private
receipts, trading activity, token purchase, or AIPOU claim is required.

## References

- [Work receipt boundaries](work-receipt-boundaries.md)
- [Evidence boundaries](evidence-boundaries.md)
- [External evidence links](external-evidence-links.md)
- [Claim validation policy](claim-validation-policy.md)
- [AIPOU repository](https://github.com/0xddneto/AI-Proof-of-Us)


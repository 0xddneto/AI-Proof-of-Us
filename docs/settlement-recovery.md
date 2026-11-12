# Settlement recovery and operating boundaries

Settlement is optional and requires an explicit claim request. Receipt generation is offline. The validator pays gas in ETH on Base; a recipient's AIPOU balance cannot pay that fee.

Before publication, the server checks chain 8453, validator and emission-controller addresses, receipt signatures/allowlist, root approval, fee estimates and validator balance. For an unpublished root it reserves a conservative claim-gas estimate, 20% margin and a 0.00002 ETH Base data-fee allowance. Actual fees can change; this is a funding gate, not a fee guarantee. `AIPOU_MAX_SETTLEMENT_FEE_WEI` optionally caps the estimated batch budget and is checked again before each new signature.

The protected local `settlement-pending.json` journal records the batch and signed bytes before sending. Those bytes grant broadcast authority: never share this file. Keep the same data directory and retry the settlement command after a pending transaction or lost response. The server checks the exact saved hash, signer, chain, target, value and calldata, reuses an approved root and archives confirmed claims idempotently. No new replacement transaction is signed during recovery. A reverted transaction, unexpected existing claim or invalid journal stops for operator review; do not delete the journal or active lock to bypass that stop.

File locks serialize processes sharing the data directory. Old age does not release a live PID's lock. Dead-PID reclamation is serialized separately; a crash during reclamation leaves a `.reclaim` gate and stops automatic reclamation until an operator verifies both processes are dead and removes the gate. This assumes a local filesystem and trusted operating-system users; shared network filesystems and hostile processes are outside this lock's guarantees. Private writes use fsync and atomic rename, plus restrictive permissions/Windows ACLs. Windows doctor reports ACL inspection as `not_checked` rather than implying a successful audit.

## Governance work that needs designated operators

The current onchain owner/validator remain single-key authorities. No ownership transfer is part of this release. Moving ownership to a multisig requires an owner-selected deployed multisig, verified signers, threshold, recovery policy and an accept/execute plan. Validator key rotation likewise needs a separately funded operator and explicit contract administration. Software tests are not an independent contract audit. These are outstanding operating decisions, not completed security milestones.

No automatic ETH transfer, liquidity addition or token purchase is performed. Funding applications and a pilot do not guarantee payment, users or token demand.

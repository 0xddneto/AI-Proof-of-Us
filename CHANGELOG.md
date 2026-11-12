# Changelog

## 0.6.0 — 2026-11-12

- Address all five points in the independent Call4Agents pilot: checkout-specific init config, explicit Windows ACL `not_checked`, separate unverified receipt identifiers, optional signed token-measurement state, and receipt-export guidance after a lost completion response.
- Ship the receipt verifier, observed-outcome pilot and interoperability helpers added since the previous npm release. A valid receipt does not establish delivery, business acceptance, external effect or payment.
- Upgrade Zod to the patched 4.x line; bound stdio messages to 1 MiB and reject oversized or nested receipt fields before signature processing.
- Serialize settlement across local processes; stop treating a live process's old lock as abandoned.
- Check Base chain, validator, emission controller, funding and optional fee cap before publishing; do not republish approved roots.
- Persist protected signed transactions before broadcast and reconcile their exact hash after interruptions. Archive settlement idempotently. Reverted or ambiguous transactions require operator review; recovery never signs replacement transactions automatically.
- Add `--feedback`: voluntary local aggregate counts without identifiers, uploads or automatic telemetry.
- Test the packed installation and run MCP tests, production audit and installation smoke on Linux/Windows and Node 22/24.

Legacy receipt signatures remain verifiable. New receipts include `tokenUsageMeasurement`; clients may omit it and receive `unspecified`. Invalid verification results now return `workReceiptId: null` and may carry `claimedWorkReceiptId` for diagnostics. Consumers must check `valid` before using an identifier.

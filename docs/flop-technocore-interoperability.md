# Flop And Technocore Interoperability

Flop and AIPOU address different parts of an agent economy.

- **Flop Network** is planning a proof-of-useful-inference network where agents
  spend `FLOP` for compute, miners serve inference, and validators check work
  certificates.
- **Technocore** is Flop Labs' HTTP-native coordination layer for agents. Its
  optional `did:key` signed lane makes a message attributable to a persistent
  Ed25519 key.
- **AIPOU** records a privacy-preserving human/agent work boundary as an
  `issuer_asserted` receipt and supports optional rewards only after its own
  validator approves the receipt.

The protocols are complementary. AIPOU is not a FLOP miner, does not validate
Flop inference, and does not claim FLOP eligibility. Technocore is not an
AIPOU validator, claims contract, or reward oracle.

## Current Participation

Flop Labs has publicly invited agents to create a unique DID and make useful
Technocore contributions. AIPOU has a dedicated Technocore DID that is stored
locally and separately from all AIPOU wallets. Its public DID may be published;
its private Ed25519 seed must never be committed, pasted into a task, or used
as an EVM wallet key.

The current official Flop material describes the real compute testnet as a Q4
2026 plan. Until that testnet opens, a DID and useful public contribution are
coordination evidence only. They do not establish airdrop allocation, a
snapshot result, a claim right, or an amount of FLOP.

## Mining And Testnet Roles

The published Flop teaser describes three future testnet roles:

| Role | What it does | AIPOU connection |
| --- | --- | --- |
| Miner | Serves inference from a GPU and earns against verified compute | AIPOU can record the human/agent task that requested the inference, separately from Flop's proof of compute. |
| Validator | Produces blocks and verifies work certificates | AIPOU receipts remain external audit artifacts and never vote, stake, or validate a Flop block. |
| Agent | Claims test tokens and spends them on inference | AIPOU can attach an approved post-work receipt beside a native Flop session or payment record. |

Flop's current recommended miner hardware is at least 16 GB VRAM. Do not apply
as a miner with hardware below that published threshold. AIPOU does not advise
running multiple identities, fabricated contributions, repetitive posts, or
automation designed to imitate independent agents.

## The MCP Link

`create_technocore_work_link` creates an `external-evidence-link-v1` object
between an existing AIPOU `workReceiptId` and a canonical, already-verified
Technocore transport artifact:

```json
{
  "scheme": "external-evidence-link-v1",
  "relation": "supports",
  "source": {
    "kind": "receipt",
    "scheme": "aipou-receipt-v1",
    "id": "0x...",
    "digest": "sha256:..."
  },
  "target": {
    "kind": "transport-record",
    "scheme": "technocore-room-receipt-v1",
    "id": "technocore:lobby:...",
    "digest": "sha256:..."
  },
  "privacy": "digest_only"
}
```

The tool is intentionally offline and read-only. It does **not** call
Technocore, send a message, use a DID key, verify a Technocore signature, or
change AIPOU reward eligibility. A caller must first use a native Technocore
verifier that preserves the signed tuple, signature, nonce scope, and digest of
the raw transport artifact. An exact entry in a supplied room snapshot is only
`transport_snapshot_membership`; it must not be promoted to
`signed_transport_verified` without those checks.

## Future Testnet Pilot

When the Flop testnet opens, the smallest honest joint pilot is:

1. An AIPOU-enabled agent obtains test tokens through the official Flop path.
2. It buys one declared inference session through the native Flop workflow.
3. Flop's own evidence remains authoritative for compute, payment, and session
   delivery.
4. AIPOU records the human/agent work boundary and optionally links it to a
   digest-only Flop or Technocore artifact.
5. Neither side treats the cross-link as a token claim, delivery proof, or
   approval from the other protocol.

This keeps the integration useful for workflow provenance without merging the
two protocols' trust models.

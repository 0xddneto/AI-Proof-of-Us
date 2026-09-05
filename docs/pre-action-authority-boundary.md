# Pre-Action Authority ↔ Work-Receipt Boundary

> Origin: this note formalizes a boundary discussed in
> [modelcontextprotocol/modelcontextprotocol#2498](https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2498)
> (permission specification for MCP tool calls). It is **protocol-neutral**: it
> describes how an AIPOU work receipt composes with a *separately issued*
> pre-action authority artifact without either one overreaching. It implies no
> product integration and no adoption claim — it states an invariant AIPOU
> already depends on, so a reviewer can check the direction explicitly.

AIPOU signs a **post-work** unit: `human asks for work → agent performs work →
AIPOU creates `workReceiptId``. Many agent stacks *also* want a **pre-action**
decision at dispatch ("is this call authorized, under whose authority, bound to
what exact call?"). These are two different receipts at two different times.
The only way they compose safely is with an explicit arrow of time.

## The invariant

```text
Phase 1 (dispatch / pre-action)  ──precedes──▶  Phase 2 (post-work)

Authority flows forward only. A Phase-2 work receipt may REFERENCE a
Phase-1 fact; it may never BECOME one.
```

A `workReceiptId` is minted **after** completion. Therefore it can never be an
attested input to an **earlier** pre-action decision. Stated as a hard rule
rather than explanatory prose:

> A work receipt MUST NOT create root authority, certify capability
> consumption or the external effect, or upgrade a policy/trust tier. It is
> `issuer_asserted` post-work evidence that may *reference back* to a
> pre-action fact — nothing more.

This is the same discipline as [`work-receipt-boundaries.md`](work-receipt-boundaries.md)
("do not turn a receipt into a universal trust badge") and
[`evidence-boundaries.md`](evidence-boundaries.md) (a task receipt is an
`issuer_asserted` audit artifact), applied to the *temporal* direction.

## Phase 1 — dispatch (pre-action), issued elsewhere

A pre-action authority artifact is issued and consumed **at dispatch**, before
the side effect. It is not an AIPOU artifact; AIPOU only needs a stable
reference to it. Minimal fields a Phase-2 receipt may reference:

| Field | Meaning | Notes |
|---|---|---|
| `preActionFactId` / `actionRef` | stable id of the pre-action authority fact | the only thing the work receipt is allowed to carry forward |
| `normalizedCallDigest` | content hash of the **exact normalized call** the authority was granted for | defeats TOCTOU — a call mutated after the check no longer matches |
| `holder` / `delegate` | principal the authority was granted to (and any delegate) | identity anchor, not proof of the effect |
| `boundedCapability` | the specific capability/scope authorized | e.g. one operation, not ambient authority |
| `expiry` / `replayState` | validity window + one-time/replay marker | a consumed or expired grant is not reusable |
| `decisionReceiptRef` | reference to the pre-action decision receipt `{decision, reasons[], input digest, ruleset id}` | issued by whatever decision layer the host uses; protocol-neutral |

The pre-action **decision** itself (PASS/REVIEW/BLOCK-shaped, or any host
equivalent) is produced by a separate layer. AIPOU does not evaluate it; it only
records the reference so the two receipts can be recomputed side by side.

## Phase 2 — post-work (AIPOU), after the effect

After completion, the AIPOU `workReceiptId` MAY include, as **issuer-asserted
post-work evidence**:

- `preActionFactId` (or `actionRef`) — the pre-action fact it claims to descend from
- `decisionReceiptRef` — the pre-action decision it claims cleared dispatch

and MUST NOT let those references:

1. create root authority (the work receipt is not a grant),
2. certify capability consumption or the external effect (that is host-owned
   state, per `work-receipt-boundaries.md`),
3. upgrade a policy/trust tier (a post-work artifact cannot promote the
   authority that preceded it).

## Reviewable vectors

Machine-readable synthetic vectors that exercise the boundary are in
[`../examples/lifecycle-adapter/pre-action-authority-vectors.json`](../examples/lifecycle-adapter/pre-action-authority-vectors.json):
one valid composition plus four negatives —

1. **phase inversion** — a `workReceiptId` presented as a pre-action
   authorization input (time runs backward) → reject.
2. **call-digest mismatch** — the executed call's `normalizedCallDigest` differs
   from the one the pre-action authority was bound to (TOCTOU) → reject.
3. **replay** — a pre-action fact with a spent/expired `replayState` reused for a
   second dispatch → reject.
4. **post-work → pre-action reversal / tier upgrade** — a work receipt used to
   raise the trust tier of the authority it descends from → reject.

The valid vector shows a Phase-1 fact bound to a normalized call and consumed at
dispatch, then a Phase-2 work receipt that references it without asserting any of
the forbidden effects.

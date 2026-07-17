import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import test from "node:test";
import {
  AIPOU_EVIDENCE_CLASS,
  AIPOU_RECEIPT_SCHEME,
  ENFORCEMENT_CHECK_SCHEME,
  createToolExecutionPolicyGate,
  createAuthorityWorkLink,
  deriveDelegationScopeFactId,
  deriveFactId,
  runAgentPolicyLoop,
  runEnforcementBenchmark,
  validateActiveFactSet,
  validateAipouReference,
  validateDelegationScopeAuthorityReceipt,
  validateAuthorityWorkLink,
  validateAuthorityWorkConformanceLink,
  validateEnforcementCheck
} from "./receipt-reference.mjs";

const publicKey = generateKeyPairSync("ed25519").publicKey
  .export({ format: "pem", type: "spki" })
  .toString();
const nonce = `0x${"12".repeat(32)}`;
const base = {
  workReceiptId: `0x${"34".repeat(32)}`,
  receiptId: `0x${"34".repeat(32)}`,
  evidenceClass: AIPOU_EVIDENCE_CLASS,
  scheme: AIPOU_RECEIPT_SCHEME,
  subject: { kind: "wallet", id: "eip155:8453:0xabc" },
  factId: deriveFactId(publicKey, nonce),
  registryStatus: "active"
};

const authorityWorkLink = createAuthorityWorkLink({
  authorityReceiptId: `0x${"56".repeat(32)}`,
  actionRef: "autogen:canonical-envelope:run-123",
  traceLink: "trace:run-123",
  workReference: base
});

const enforcementCheck = {
  scheme: ENFORCEMENT_CHECK_SCHEME,
  evidenceClass: AIPOU_EVIDENCE_CLASS,
  relation: "pre_action_receipt_required",
  authorityReceiptId: authorityWorkLink.authority.receiptId,
  actionRef: authorityWorkLink.authority.actionRef,
  enforcementPoint: {
    kind: "protected_branch",
    id: "github:example/project:refs/heads/main"
  },
  policyDigest: `sha256:${"90".repeat(32)}`,
  observations: {
    withoutAuthority: {
      attempted: true,
      authorityReceiptPresent: false,
      outcome: "denied",
      evidenceDigest: `sha256:${"91".repeat(32)}`
    },
    withAuthority: {
      attempted: true,
      authorityReceiptPresent: true,
      authorityReceiptId: authorityWorkLink.authority.receiptId,
      outcome: "allowed",
      evidenceDigest: `sha256:${"92".repeat(32)}`
    }
  },
  verificationStatus: "local_test",
  relianceBoundary: "enforcement-point-test-only"
};

const conformanceLink = {
  ...authorityWorkLink,
  authority: {
    ...authorityWorkLink.authority,
    evidenceClass: "chain_derivable",
    scheme: "delegation-scope-v1",
    subject: { kind: "delegation", id: "eip155:8453:registry:owner:signer" },
    factId: `0x${"93".repeat(32)}`
  },
  work: {
    ...authorityWorkLink.work,
    evidenceClass: AIPOU_EVIDENCE_CLASS,
    scheme: AIPOU_RECEIPT_SCHEME,
    subject: base.subject,
    preActionFactId: `0x${"93".repeat(32)}`
  }
};

const kubernaAuthorityPreimage = {
  principal: "0x90aBcDeF0123456789abcdef0123456789aBcDef",
  body: "Swap 5000 USDC on Base for USDT on Polygon, slippage <= 0.3%",
  constraints: {
    budget: "5000000000000000000",
    deadline: "2026-07-30T23:59:59.000Z",
    jurisdiction: ["US", "RW", "SG"],
    allowed_tools: ["cross_chain_swap", "bridge_adapter", "liquidity_router"],
    max_gas: "5000000"
  },
  success_criteria: {
    type: "exact_output",
    conditions: [
      { field: "filled_amount", operator: ">=", value: "4985000000" },
      { field: "destination_token", operator: "==", value: "USDT" },
      { field: "bridge_status", operator: "==", value: "confirmed" }
    ]
  },
  nonce: "1721053927481-a3xk9bm2f",
  issued_at: "2026-07-15T14:32:07.481Z",
  expires_at: "2026-07-30T23:59:59.000Z"
};

const kubernaAuthorityReceipt = {
  receipt_type: "chain_derivable",
  scope_version: "delegation-scope-v1",
  fact_id: "0x2369ba13f2ab8beba8dcd01fcd1b8c8e49076bc7019fda4eb80e1bf1b22a7c0e",
  delegation_scope: kubernaAuthorityPreimage,
  fact_id_derivation: {
    scheme: "jcs-sha256",
    bytes32: "0x2369ba13f2ab8beba8dcd01fcd1b8c8e49076bc7019fda4eb80e1bf1b22a7c0e"
  }
};

test("factId is deterministic for collector and nonce", () => {
  assert.equal(deriveFactId(publicKey, nonce), deriveFactId(publicKey, nonce.toUpperCase()));
  assert.notEqual(deriveFactId(publicKey, nonce), deriveFactId(publicKey, `0x${"13".repeat(32)}`));
});

test("rejects unknown schemes and mismatched evidence classes", () => {
  assert.throws(() => validateAipouReference({ ...base, scheme: "aipou-receipt-v2" }));
  assert.throws(() => validateAipouReference({ ...base, evidenceClass: "chain_derivable" }));
});

test("rejects two active records for the same subject and fact", () => {
  assert.throws(() => validateActiveFactSet([base, { ...base }]));
});

test("treats revoked as terminal and superseded as a version-chain link", () => {
  assert.throws(() => validateAipouReference({ ...base, registryStatus: "revoked", supersededBy: "0xnext" }));
  assert.throws(() => validateAipouReference({ ...base, registryStatus: "superseded" }));
  assert.equal(validateAipouReference({ ...base, registryStatus: "superseded", supersededBy: "0xnext" }), true);
});

test("links pre-action authority to a separate post-work receipt", () => {
  assert.equal(validateAuthorityWorkLink(authorityWorkLink, base), true);
});

test("rejects post-work evidence masquerading as authority", () => {
  assert.throws(() => validateAuthorityWorkLink({
    ...authorityWorkLink,
    authority: { ...authorityWorkLink.authority, phase: "post_work" }
  }, base));
  assert.throws(() => validateAuthorityWorkLink({
    ...authorityWorkLink,
    authority: { ...authorityWorkLink.authority, receiptId: base.workReceiptId }
  }, base));
});

test("rejects mismatched work and claim fields presented as authority", () => {
  assert.throws(() => validateAuthorityWorkLink({
    ...authorityWorkLink,
    work: { ...authorityWorkLink.work, factId: `0x${"78".repeat(32)}` }
  }, base));
  assert.throws(() => validateAuthorityWorkLink({
    ...authorityWorkLink,
    authority: { ...authorityWorkLink.authority, rewardAmount: "100" }
  }, base));
});

test("records a point-specific enforcement test separately from receipt evidence", () => {
  assert.equal(validateEnforcementCheck(enforcementCheck, authorityWorkLink), true);
});

test("executes the protected action without and with the authority receipt", async () => {
  const protectedMutations = [];
  const check = await runEnforcementBenchmark({
    authorityWorkLink,
    enforcementPoint: enforcementCheck.enforcementPoint,
    policyDigest: enforcementCheck.policyDigest,
    attemptAction: async ({ authorityReceiptId }) => {
      if (authorityReceiptId !== authorityWorkLink.authority.receiptId) {
        return { outcome: "denied", reason: "missing_or_invalid_authority" };
      }
      protectedMutations.push(authorityWorkLink.authority.actionRef);
      return { outcome: "allowed", result: "protected_mutation_applied" };
    }
  });

  assert.equal(check.observations.withoutAuthority.outcome, "denied");
  assert.equal(check.observations.withAuthority.outcome, "allowed");
  assert.deepEqual(protectedMutations, [authorityWorkLink.authority.actionRef]);
});

test("executable benchmark fails when the untrusted path reaches the action", async () => {
  await assert.rejects(() => runEnforcementBenchmark({
    authorityWorkLink,
    enforcementPoint: enforcementCheck.enforcementPoint,
    policyDigest: enforcementCheck.policyDigest,
    attemptAction: async () => ({ outcome: "allowed" })
  }));
});

test("accepts standard enforcement kinds and explicit custom extensions", () => {
  assert.equal(validateEnforcementCheck({
    ...enforcementCheck,
    enforcementPoint: { kind: "orchestrator_policy", id: "autogen:tool-execution" }
  }, authorityWorkLink), true);
  assert.equal(validateEnforcementCheck({
    ...enforcementCheck,
    enforcementPoint: { kind: "custom:remote-tool-proxy", id: "proxy:example" }
  }, authorityWorkLink), true);
  assert.throws(() => validateEnforcementCheck({
    ...enforcementCheck,
    enforcementPoint: { kind: "tool_hook", id: "autogen:tool-execution" }
  }, authorityWorkLink));
});

test("returns a structured denial at the tool execution boundary", async () => {
  const executedActions = [];
  const gate = createToolExecutionPolicyGate({
    authorityWorkLink,
    executeAction: async ({ actionRef }) => {
      executedActions.push(actionRef);
      return { resultDigest: `sha256:${"95".repeat(32)}` };
    }
  });

  const denied = await gate({
    actionRef: authorityWorkLink.authority.actionRef,
    authorityReceiptId: null
  });
  assert.equal(denied.outcome, "denied");
  assert.equal(denied.code, "AIPOU_AUTHORITY_REQUIRED");
  assert.equal(denied.canRequestAuthority, true);
  assert.deepEqual(executedActions, []);

  const check = await runEnforcementBenchmark({
    authorityWorkLink,
    enforcementPoint: { kind: "orchestrator_policy", id: "autogen:tool-execution" },
    policyDigest: enforcementCheck.policyDigest,
    attemptAction: gate
  });
  assert.equal(check.observations.withoutAuthority.outcome, "denied");
  assert.equal(check.observations.withAuthority.outcome, "allowed");
  assert.deepEqual(executedActions, [authorityWorkLink.authority.actionRef]);
});

test("does not request authority or retry permanently forbidden actions", async () => {
  const executedActions = [];
  let authorityRequests = 0;
  const gate = createToolExecutionPolicyGate({
    authorityWorkLink,
    executeAction: async ({ actionRef }) => {
      executedActions.push(actionRef);
      return { outcome: "executed" };
    },
    isPermanentlyForbidden: async ({ actionRef }) => actionRef === authorityWorkLink.authority.actionRef
  });

  const loopResult = await runAgentPolicyLoop({
    actionRef: authorityWorkLink.authority.actionRef,
    attemptAction: gate,
    requestAuthority: async () => {
      authorityRequests += 1;
      return authorityWorkLink.authority.receiptId;
    }
  });

  assert.equal(loopResult.attempts, 1);
  assert.equal(loopResult.authorityRequested, false);
  assert.equal(loopResult.result.code, "AIPOU_ACTION_FORBIDDEN");
  assert.equal(loopResult.result.canRequestAuthority, false);
  assert.equal(authorityRequests, 0);
  assert.deepEqual(executedActions, []);
});

test("requests authority once and retries a temporarily unauthorized action", async () => {
  const executedActions = [];
  let authorityRequests = 0;
  const gate = createToolExecutionPolicyGate({
    authorityWorkLink,
    executeAction: async ({ actionRef }) => {
      executedActions.push(actionRef);
      return { outcome: "executed" };
    }
  });

  const loopResult = await runAgentPolicyLoop({
    actionRef: authorityWorkLink.authority.actionRef,
    attemptAction: gate,
    requestAuthority: async () => {
      authorityRequests += 1;
      return authorityWorkLink.authority.receiptId;
    }
  });

  assert.equal(loopResult.attempts, 2);
  assert.equal(loopResult.authorityRequested, true);
  assert.equal(loopResult.result.code, "AIPOU_AUTHORITY_ACCEPTED");
  assert.equal(authorityRequests, 1);
  assert.deepEqual(executedActions, [authorityWorkLink.authority.actionRef]);
});

test("fails closed when execution without authority is possible", () => {
  assert.throws(() => validateEnforcementCheck({
    ...enforcementCheck,
    observations: {
      ...enforcementCheck.observations,
      withoutAuthority: { ...enforcementCheck.observations.withoutAuthority, outcome: "allowed" }
    }
  }, authorityWorkLink));
});

test("rejects mismatched authority links and unverifiable external enforcement", () => {
  assert.throws(() => validateEnforcementCheck({
    ...enforcementCheck,
    actionRef: "autogen:canonical-envelope:other-run"
  }, authorityWorkLink));
  assert.throws(() => validateEnforcementCheck({
    ...enforcementCheck,
    verificationStatus: "external_verified"
  }, authorityWorkLink));
});

test("maps a chain-derived authority fact to issuer-asserted post-work evidence", () => {
  assert.equal(validateAuthorityWorkConformanceLink(conformanceLink, base), true);
});

test("derives the Kuberna ERC-8004 delegation scope fact from the standalone preimage", () => {
  assert.equal(
    deriveDelegationScopeFactId(kubernaAuthorityPreimage),
    "0x82c33017978a70f0cf08ecc45df9ae81107410d466f0e5205b426981466baaad"
  );
  assert.equal(validateDelegationScopeAuthorityReceipt({
    ...kubernaAuthorityReceipt,
    fact_id: "0x82c33017978a70f0cf08ecc45df9ae81107410d466f0e5205b426981466baaad",
    fact_id_derivation: {
      ...kubernaAuthorityReceipt.fact_id_derivation,
      bytes32: "0x82c33017978a70f0cf08ecc45df9ae81107410d466f0e5205b426981466baaad"
    }
  }), true);
});

test("fails closed on the current Kuberna authority receipt fact_id drift", () => {
  assert.throws(() => validateDelegationScopeAuthorityReceipt(kubernaAuthorityReceipt));
});

test("fails closed on conformance trust-model downgrade", () => {
  assert.throws(() => validateAuthorityWorkConformanceLink({
    ...conformanceLink,
    authority: { ...conformanceLink.authority, evidenceClass: AIPOU_EVIDENCE_CLASS }
  }, base));
  assert.throws(() => validateAuthorityWorkConformanceLink({
    ...conformanceLink,
    work: { ...conformanceLink.work, evidenceClass: "chain_derivable" }
  }, base));
});

test("fails closed when post-work evidence points to another authority fact", () => {
  assert.throws(() => validateAuthorityWorkConformanceLink({
    ...conformanceLink,
    work: { ...conformanceLink.work, preActionFactId: `0x${"94".repeat(32)}` }
  }, base));
});

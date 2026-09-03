import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import test from "node:test";
import {
  AIPOU_EVIDENCE_CLASS,
  AIPOU_RECEIPT_SCHEME,
  ENFORCEMENT_CHECK_SCHEME,
  createActionBinding,
  createToolExecutionPolicyGate,
  createAuthorityWorkLink,
  canonicalJson,
  deriveDelegationScopeFactId,
  deriveFactId,
  deriveActionArgumentsDigest,
  runAgentPolicyLoop,
  runEnforcementBenchmark,
  validateActionBinding,
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

const actionArguments = {
  base: "main",
  body: "Add receipt validation.",
  head: "receipt-validation",
  title: "Add receipt validation"
};
const actionBinding = createActionBinding({
  intentId: "agent:run-123:tool-approve",
  generation: 3,
  tool: "github.create_pull_request",
  arguments: actionArguments,
  ordinal: 2
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

const kubernaFixtureCommit = "fada367f122adf10dcd0b8c63dba98df7d06a2d6";
const kubernaFactId = "0x82c33017978a70f0cf08ecc45df9ae81107410d466f0e5205b426981466baaad";
const kubernaPreviousDriftFactId = "0x2369ba13f2ab8beba8dcd01fcd1b8c8e49076bc7019fda4eb80e1bf1b22a7c0e";
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
  fact_id: kubernaFactId,
  delegation_scope: kubernaAuthorityPreimage,
  fact_id_derivation: {
    scheme: "jcs-sha256",
    bytes32: kubernaFactId
  }
};

const kubernaDriftedAuthorityReceipt = {
  ...kubernaAuthorityReceipt,
  fact_id: kubernaPreviousDriftFactId,
  fact_id_derivation: {
    ...kubernaAuthorityReceipt.fact_id_derivation,
    bytes32: kubernaPreviousDriftFactId
  }
};

test("factId is deterministic for collector and nonce", () => {
  assert.equal(deriveFactId(publicKey, nonce), deriveFactId(publicKey, nonce.toUpperCase()));
  assert.notEqual(deriveFactId(publicKey, nonce), deriveFactId(publicKey, `0x${"13".repeat(32)}`));
});

test("uses RFC 8785-compatible UTF-16 key ordering and rejects non-JSON values", () => {
  const smile = String.fromCodePoint(0x1f600);
  const privateUse = String.fromCharCode(0xe000);
  assert.equal(
    canonicalJson({ [privateUse]: "private-use", [smile]: "smile" }),
    `{"${smile}":"smile","${privateUse}":"private-use"}`
  );
  assert.equal(canonicalJson({ negativeZero: -0, tiny: 1e-7 }), '{"negativeZero":0,"tiny":1e-7}');
  for (const value of [NaN, Infinity, undefined, 1n, () => {}]) {
    assert.throws(() => canonicalJson({ value }));
  }
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

test("binds a stable intent to its materialized tool call and generation", async () => {
  const boundLink = createAuthorityWorkLink({
    authorityReceiptId: authorityWorkLink.authority.receiptId,
    actionRef: authorityWorkLink.authority.actionRef,
    actionBinding,
    traceLink: authorityWorkLink.traceLink,
    workReference: base
  });
  const executed = [];
  const gate = createToolExecutionPolicyGate({
    authorityWorkLink: boundLink,
    executeAction: async (input) => {
      executed.push(input);
      return { outcome: "executed" };
    }
  });

  const changedArguments = await gate({
    actionRef: boundLink.authority.actionRef,
    authorityReceiptId: boundLink.authority.receiptId,
    actionBinding: { ...actionBinding, argumentsDigest: `sha256:${"97".repeat(32)}` },
    actionArguments
  });
  const staleGeneration = await gate({
    actionRef: boundLink.authority.actionRef,
    authorityReceiptId: boundLink.authority.receiptId,
    actionBinding: { ...actionBinding, generation: 2 },
    actionArguments
  });
  const missingBinding = await gate({
    actionRef: boundLink.authority.actionRef,
    authorityReceiptId: boundLink.authority.receiptId,
    actionArguments
  });
  const allowed = await gate({
    actionRef: boundLink.authority.actionRef,
    authorityReceiptId: boundLink.authority.receiptId,
    actionBinding,
    actionArguments
  });

  assert.equal(changedArguments.code, "AIPOU_AUTHORITY_REQUIRED");
  assert.equal(staleGeneration.code, "AIPOU_AUTHORITY_REQUIRED");
  assert.equal(missingBinding.code, "AIPOU_AUTHORITY_REQUIRED");
  assert.equal(allowed.code, "AIPOU_AUTHORITY_ACCEPTED");
  assert.equal(executed.length, 1);
  assert.deepEqual(executed[0].actionBinding, actionBinding);
  assert.deepEqual(executed[0].actionArguments, actionArguments);
});

test("rejects incomplete action bindings", () => {
  assert.equal(validateActionBinding(actionBinding), true);
  assert.equal(
    deriveActionArgumentsDigest({ title: "Add receipt validation", body: "Add receipt validation.", head: "receipt-validation", base: "main" }),
    actionBinding.argumentsDigest
  );
  assert.equal(
    createActionBinding({
      intentId: actionBinding.intentId,
      generation: actionBinding.generation,
      tool: actionBinding.tool,
      arguments: actionArguments,
      ordinal: actionBinding.ordinal
    }).argumentsDigest,
    actionBinding.argumentsDigest
  );
  assert.throws(() => validateActionBinding({ ...actionBinding, generation: -1 }));
  assert.throws(() => validateActionBinding({ ...actionBinding, argumentsDigest: "sha256:upper" }));
  assert.throws(() => validateActionBinding({ ...actionBinding, tool: "" }));
  assert.throws(() => validateActionBinding({ ...actionBinding, approverPrincipal: "" }));
  assert.throws(() => validateActionBinding({ ...actionBinding, approverPrincipal: " user:operator-42" }));
});

test("uses a host-authenticated principal for approver-bound authority", async () => {
  const approverBinding = createActionBinding({
    intentId: actionBinding.intentId,
    generation: actionBinding.generation,
    tool: actionBinding.tool,
    arguments: actionArguments,
    ordinal: actionBinding.ordinal,
    approverPrincipal: "user:operator-42"
  });
  const boundLink = createAuthorityWorkLink({
    authorityReceiptId: authorityWorkLink.authority.receiptId,
    actionRef: authorityWorkLink.authority.actionRef,
    actionBinding: approverBinding,
    traceLink: authorityWorkLink.traceLink,
    workReference: base
  });
  const executed = [];

  assert.throws(() => createToolExecutionPolicyGate({
    authorityWorkLink: boundLink,
    executeAction: async () => assert.fail("missing authenticated-principal resolver must fail closed")
  }), /host-owned authenticated-principal resolver/);

  const mismatchGate = createToolExecutionPolicyGate({
    authorityWorkLink: boundLink,
    resolveAuthenticatedPrincipal: async () => "agent:caller",
    executeAction: async (input) => executed.push(input)
  });
  const denied = await mismatchGate({
    actionRef: boundLink.authority.actionRef,
    authorityReceiptId: boundLink.authority.receiptId,
    actionBinding: approverBinding,
    actionArguments
  });
  assert.equal(denied.code, "AIPOU_APPROVER_MISMATCH");
  assert.equal(denied.canRequestAuthority, false);
  assert.deepEqual(executed, []);

  const allowedGate = createToolExecutionPolicyGate({
    authorityWorkLink: boundLink,
    resolveAuthenticatedPrincipal: async () => ({ principal: "user:operator-42" }),
    executeAction: async (input) => executed.push(input)
  });
  const allowed = await allowedGate({
    actionRef: boundLink.authority.actionRef,
    authorityReceiptId: boundLink.authority.receiptId,
    actionBinding: approverBinding,
    actionArguments
  });
  assert.equal(allowed.code, "AIPOU_AUTHORITY_ACCEPTED");
  assert.equal(executed[0].authenticatedApproverPrincipal, "user:operator-42");
});

test("rejects a materialized tool call whose arguments differ from its authority binding", async () => {
  const boundLink = createAuthorityWorkLink({
    authorityReceiptId: authorityWorkLink.authority.receiptId,
    actionRef: authorityWorkLink.authority.actionRef,
    actionBinding,
    traceLink: authorityWorkLink.traceLink,
    workReference: base
  });
  const gate = createToolExecutionPolicyGate({
    authorityWorkLink: boundLink,
    executeAction: async () => assert.fail("changed arguments must not execute")
  });

  const result = await gate({
    actionRef: boundLink.authority.actionRef,
    authorityReceiptId: boundLink.authority.receiptId,
    actionBinding,
    actionArguments: { ...actionArguments, base: "release" }
  });

  assert.equal(result.outcome, "denied");
  assert.equal(result.code, "AIPOU_AUTHORITY_REQUIRED");
});

test("revalidates matching authority immediately before dispatch", async () => {
  const executedActions = [];
  const gate = createToolExecutionPolicyGate({
    authorityWorkLink,
    executeAction: async ({ actionRef }) => {
      executedActions.push(actionRef);
      return { outcome: "executed" };
    },
    revalidateAtDispatch: async () => ({
      allowed: false,
      code: "AIPOU_AUTHORITY_REVOKED",
      message: "Authority was revoked before dispatch.",
      canRequestAuthority: false
    })
  });

  const result = await gate({
    actionRef: authorityWorkLink.authority.actionRef,
    authorityReceiptId: authorityWorkLink.authority.receiptId
  });
  assert.equal(result.outcome, "denied");
  assert.equal(result.code, "AIPOU_AUTHORITY_REVOKED");
  assert.equal(result.canRequestAuthority, false);
  assert.deepEqual(executedActions, []);
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

test("accepts the pinned Kuberna ERC-8004 authority receipt as a positive vector", () => {
  assert.equal(kubernaFixtureCommit, "fada367f122adf10dcd0b8c63dba98df7d06a2d6");
  assert.equal(deriveDelegationScopeFactId(kubernaAuthorityPreimage), kubernaFactId);
  assert.equal(validateDelegationScopeAuthorityReceipt(kubernaAuthorityReceipt), true);
});

test("fails closed on the previous Kuberna authority receipt fact_id drift", () => {
  assert.throws(() => validateDelegationScopeAuthorityReceipt(kubernaDriftedAuthorityReceipt));
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

test("rejects an authority relabeled chain-derivable while carrying AIPOU issuer fields", () => {
  assert.throws(() => validateAuthorityWorkConformanceLink({
    ...conformanceLink,
    authority: {
      ...conformanceLink.authority,
      collectorSignature: "synthetic-ed25519-signature"
    }
  }, base));
});

test("fails closed when post-work evidence points to another authority fact", () => {
  assert.throws(() => validateAuthorityWorkConformanceLink({
    ...conformanceLink,
    work: { ...conformanceLink.work, preActionFactId: `0x${"94".repeat(32)}` }
  }, base));
});

test("rejects a malformed post-work authority reference before comparing the link", () => {
  assert.throws(
    () => validateAuthorityWorkConformanceLink({
      ...conformanceLink,
      work: { ...conformanceLink.work, preActionFactId: `0x${"94".repeat(33)}` }
    }, base),
    /bytes32 preActionFactId/
  );
});

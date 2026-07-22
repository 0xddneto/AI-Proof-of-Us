import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import test from "node:test";
import {
  AIPOU_RECEIPT_META_KEY,
  AIPOU_SPAN_ATTRIBUTE_NAMES,
  buildReceiptResultMeta,
  buildReceiptSpanAttributes
} from "./receipt-metadata.js";

test("receipt result metadata is compact, namespaced, and contains no claim authority", () => {
  const pair = generateKeyPairSync("ed25519");
  const collectorPublicKey = pair.publicKey.export({ format: "pem", type: "spki" }).toString();
  const receiptId = `0x${"ab".repeat(32)}`;
  const metadata = buildReceiptResultMeta({ receiptId, collectorPublicKey });
  const projection = metadata[AIPOU_RECEIPT_META_KEY] as Record<string, unknown>;

  assert.deepEqual(Object.keys(metadata), [AIPOU_RECEIPT_META_KEY]);
  assert.equal(projection.id, receiptId);
  assert.equal(projection.uri, `aipou://receipts/${receiptId}`);
  assert.match(String(projection.issuer), /^sha256:[0-9a-f]{64}$/);
  assert.equal(projection.digest, `sha256:${"ab".repeat(32)}`);
  assert.equal(projection.evidenceClass, "issuer_asserted");
  assert.equal(projection.scheme, "aipou-receipt-v1");
  assert.equal(projection.status, "local");
  assert.equal("wallet" in projection, false);
  assert.equal("reward" in projection, false);
  assert.equal("claimStatus" in projection, false);
});

test("span projection matches the OpenLLMetry correlation boundary", () => {
  const receiptId = `0x${"cd".repeat(32)}`;
  const attributes = buildReceiptSpanAttributes({ receiptId });

  assert.deepEqual(attributes, {
    "aipou.work_receipt_id": receiptId,
    "aipou.evidence_class": "issuer_asserted",
    "aipou.scheme": "aipou-receipt-v1",
    "aipou.validation_status": "local"
  });
  assert.deepEqual(AIPOU_SPAN_ATTRIBUTE_NAMES, {
    workReceiptId: "aipou.work_receipt_id",
    evidenceClass: "aipou.evidence_class",
    scheme: "aipou.scheme",
    validationStatus: "aipou.validation_status"
  });

  for (const forbidden of ["wallet", "reward", "prompt", "output", "claimAuthority"]) {
    assert.equal(forbidden in attributes, false);
  }
});

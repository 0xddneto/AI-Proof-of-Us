import test from "node:test";
import assert from "node:assert/strict";
import { canonicalJson, sha256Hex } from "./canonical.js";

test("canonicalJson serializes primitives correctly", () => {
  assert.equal(canonicalJson(42), "42");
  assert.equal(canonicalJson("hello"), "\"hello\"");
  assert.equal(canonicalJson(true), "true");
  assert.equal(canonicalJson(null), "null");
});

test("canonicalJson sorts object keys lexicographically", () => {
  const unsorted = { b: 1, a: 2, c: 3 };
  const sorted = { a: 2, b: 1, c: 3 };
  assert.equal(canonicalJson(unsorted), canonicalJson(sorted));
  assert.equal(canonicalJson(unsorted), "{\"a\":2,\"b\":1,\"c\":3}");
});

test("canonicalJson omits undefined values from objects", () => {
  const obj = { a: 1, b: undefined, c: 3 };
  assert.equal(canonicalJson(obj), "{\"a\":1,\"c\":3}");
});

test("canonicalJson handles nested objects with sorted keys", () => {
  const obj = { outer: { z: 1, a: 2 } };
  assert.equal(canonicalJson(obj), "{\"outer\":{\"a\":2,\"z\":1}}");
});

test("canonicalJson handles arrays preserving order", () => {
  assert.equal(canonicalJson([3, 1, 2]), "[3,1,2]");
  assert.equal(canonicalJson([{ b: 1, a: 2 }]), "[{\"a\":2,\"b\":1}]");
});

test("canonicalJson is deterministic for deeply nested mixed structures", () => {
  const a = { z: [1, 2], y: { b: 2, a: 1 } };
  const b = { y: { a: 1, b: 2 }, z: [1, 2] };
  assert.equal(canonicalJson(a), canonicalJson(b));
});

test("sha256Hex produces a 0x-prefixed 64-char hex string", () => {
  const hash = sha256Hex("test");
  assert.match(hash, /^0x[0-9a-f]{64}$/);
  assert.equal(hash, "0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08");
});

test("sha256Hex is deterministic for the same input", () => {
  assert.equal(sha256Hex("hello"), sha256Hex("hello"));
  assert.notEqual(sha256Hex("hello"), sha256Hex("world"));
});

test("canonicalJson handles empty objects and arrays", () => {
  assert.equal(canonicalJson({}), "{}");
  assert.equal(canonicalJson([]), "[]");
});

test("canonicalJson handles mixed undefined and null values", () => {
  const obj = { a: null, b: undefined, c: 0, d: "" };
  assert.equal(canonicalJson(obj), "{\"a\":null,\"c\":0,\"d\":\"\"}");
});

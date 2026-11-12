import assert from "node:assert/strict";
import test from "node:test";
import { BoundedStdioInput } from "./bounded-input.js";
test("stdio accepts a bounded fragmented line and resets its byte count at newline", async () => {
  const stream = new BoundedStdioInput(6);
  const chunks: Buffer[] = [];
  stream.on("data", (b: Buffer) => chunks.push(b));
  stream.write(Buffer.from("123"));
  stream.write(Buffer.from("456\n123456\n"));
  stream.end();
  await new Promise<void>((resolve, reject) => {
    stream.on("end", resolve);
    stream.on("error", reject);
  });
  assert.equal(Buffer.concat(chunks).toString(), "123456\n123456\n");
});
test("oversized fragmented JSON is rejected before the offending chunk is parsed", async () => {
  const stream = new BoundedStdioInput(4);
  const error = new Promise<Error>((resolve) => stream.once("error", resolve));
  stream.resume();
  stream.write(Buffer.from("123"));
  stream.end(Buffer.from("45"));
  assert.match((await error).message, /INPUT_TOO_LARGE/);
});

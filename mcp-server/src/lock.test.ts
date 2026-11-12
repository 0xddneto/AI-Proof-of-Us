import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, writeFile, utimes, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { withFileLock } from "./lock.js";

test("a live PID keeps its old lock; a stopped process can be reclaimed", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "aipou-lock-test-"));
  const file = path.join(dir, "operation.lock");
  try {
    await writeFile(file, String(process.pid));
    await utimes(file, 0, 0);
    await assert.rejects(
      withFileLock(file, async () => assert.fail("live lock was stolen")),
      /busy/,
    );
    assert.equal(await readFile(file, "utf8"), String(process.pid));
    const child = spawn(process.execPath, ["-e", "process.exit(0)"]);
    await once(child, "exit");
    await writeFile(file, String(child.pid));
    await utimes(file, 0, 0);
    assert.equal(
      await withFileLock(file, async () => "recovered"),
      "recovered",
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

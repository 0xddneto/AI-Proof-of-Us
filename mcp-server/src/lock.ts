import { readFile, rm, stat, writeFile } from "node:fs/promises";

// Age alone never makes a live process's lock reclaimable.
const STALE_LOCK_MS = 15_000;
const ACQUIRE_TIMEOUT_MS = 10_000;

async function reclaimDeadLock(lockPath: string): Promise<void> {
  // Serialize reclaimers so a second observer cannot delete a new owner's lock
  // using a stale PID read. An interrupted reclaimer fails closed for review.
  const gate = `${lockPath}.reclaim`;
  try {
    await writeFile(gate, `${process.pid}\n`, { flag: "wx", mode: 0o600 });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") return;
    throw error;
  }
  try {
    const info = await stat(lockPath);
    if (Date.now() - info.mtimeMs <= STALE_LOCK_MS) return;
    const pid = Number((await readFile(lockPath, "utf8")).trim());
    if (!Number.isSafeInteger(pid) || pid <= 0) return;
    try {
      process.kill(pid, 0);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ESRCH") await rm(lockPath);
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  } finally {
    await rm(gate, { force: true });
  }
}

async function acquire(lockPath: string): Promise<void> {
  const deadline = Date.now() + ACQUIRE_TIMEOUT_MS;
  for (;;) {
    try {
      await writeFile(lockPath, `${process.pid}\n`, {
        encoding: "utf8",
        flag: "wx",
      });
      return;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
    }
    try {
      const info = await stat(lockPath);
      if (Date.now() - info.mtimeMs > STALE_LOCK_MS) {
        await reclaimDeadLock(lockPath);
      }
    } catch (error) {
      // The holder released the lock between attempts; retry immediately.
      if ((error as NodeJS.ErrnoException).code === "ENOENT") continue;
      throw error;
    }
    if (Date.now() > deadline) {
      throw new Error(
        "AIPOU operation is busy; retry when the other process finishes. Never remove an active lock.",
      );
    }
    await new Promise((resolve) =>
      setTimeout(resolve, 25 + Math.floor(Math.random() * 75)),
    );
  }
}

export async function withFileLock<T>(
  lockPath: string,
  operation: () => Promise<T>,
): Promise<T> {
  await acquire(lockPath);
  try {
    return await operation();
  } finally {
    await rm(lockPath, { force: true });
  }
}

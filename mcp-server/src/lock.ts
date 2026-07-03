import { rm, stat, writeFile } from "node:fs/promises";

// State mutations finish in well under a second, so a lock older than this
// belongs to a crashed process and can be reclaimed safely.
const STALE_LOCK_MS = 15_000;
const ACQUIRE_TIMEOUT_MS = 10_000;

async function acquire(lockPath: string): Promise<void> {
  const deadline = Date.now() + ACQUIRE_TIMEOUT_MS;
  for (;;) {
    try {
      await writeFile(lockPath, `${process.pid}\n`, { encoding: "utf8", flag: "wx" });
      return;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
    }
    try {
      const info = await stat(lockPath);
      if (Date.now() - info.mtimeMs > STALE_LOCK_MS) {
        await rm(lockPath, { force: true });
        continue;
      }
    } catch {
      // The holder released the lock between attempts; retry immediately.
      continue;
    }
    if (Date.now() > deadline) {
      throw new Error(`Timed out waiting for lock ${lockPath}; remove it manually if no other AIPOU process is running`);
    }
    await new Promise((resolve) => setTimeout(resolve, 25 + Math.floor(Math.random() * 75)));
  }
}

export async function withFileLock<T>(lockPath: string, operation: () => Promise<T>): Promise<T> {
  await acquire(lockPath);
  try {
    return await operation();
  } finally {
    await rm(lockPath, { force: true });
  }
}

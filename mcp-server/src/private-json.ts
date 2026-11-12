import { mkdir, open, rename, readFile } from "node:fs/promises";
import path from "node:path";
import { restrictToCurrentUser } from "./secure-file.js";
export async function writePrivateJson(
  file: string,
  value: unknown,
): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const temp = `${file}.${process.pid}.tmp`;
  const handle = await open(temp, "w", 0o600);
  try {
    if (process.platform !== "win32") await handle.chmod(0o600);
    await handle.writeFile(JSON.stringify(value, null, 2) + "\n");
    await handle.sync();
  } finally {
    await handle.close();
  }
  if (!(await restrictToCurrentUser(temp)))
    throw new Error(
      "Could not restrict private state file access; update was not committed",
    );
  await rename(temp, file);
  if (process.platform !== "win32") {
    const directory = await open(path.dirname(file), "r");
    try {
      await directory.sync();
    } finally {
      await directory.close();
    }
  }
}
export async function readOptionalJson<T>(file: string): Promise<T | null> {
  try {
    return JSON.parse(await readFile(file, "utf8")) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

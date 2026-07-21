import { readFile } from "node:fs/promises";

const SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

export async function getPackageVersion(): Promise<string> {
  const packageUrl = new URL("../package.json", import.meta.url);
  const metadata = JSON.parse(await readFile(packageUrl, "utf8")) as { version?: unknown };
  if (typeof metadata.version !== "string" || !SEMVER.test(metadata.version)) {
    throw new Error("mcp-server/package.json must contain a valid semantic version");
  }
  return metadata.version;
}

import { createHash, createPublicKey, generateKeyPairSync, sign, verify } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { canonicalJson } from "./canonical.js";

function dataDir(): string {
  return path.resolve(process.env.AIPOU_DATA_DIR || ".aipou");
}

function privateKeyPath(): string {
  return path.join(dataDir(), "collector-ed25519-private.pem");
}

function publicKeyPath(): string {
  return path.join(dataDir(), "collector-ed25519-public.pem");
}

async function ensureCollectorKeys(): Promise<{ privateKey: string; publicKey: string }> {
  await mkdir(dataDir(), { recursive: true });

  try {
    const [privateKey, publicKey] = await Promise.all([
      readFile(privateKeyPath(), "utf8"),
      readFile(publicKeyPath(), "utf8")
    ]);
    return { privateKey, publicKey };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }

  const pair = generateKeyPairSync("ed25519");
  const privateKey = pair.privateKey.export({ format: "pem", type: "pkcs8" }).toString();
  const publicKey = pair.publicKey.export({ format: "pem", type: "spki" }).toString();
  await writeFile(privateKeyPath(), privateKey, { encoding: "utf8", mode: 0o600, flag: "wx" });
  await writeFile(publicKeyPath(), publicKey, { encoding: "utf8", flag: "wx" });
  return { privateKey, publicKey };
}

export async function getCollectorPublicKey(): Promise<string> {
  return (await ensureCollectorKeys()).publicKey;
}

export function collectorFingerprint(publicKey: string): string {
  const der = createPublicKey(publicKey).export({ format: "der", type: "spki" });
  return `sha256:${createHash("sha256").update(der).digest("hex")}`;
}

export async function signCollectorPayload(payload: unknown): Promise<string> {
  const { privateKey } = await ensureCollectorKeys();
  return sign(null, Buffer.from(canonicalJson(payload)), privateKey).toString("base64");
}

export function verifyCollectorPayload(payload: unknown, signature: string, publicKey: string): boolean {
  return verify(null, Buffer.from(canonicalJson(payload)), publicKey, Buffer.from(signature, "base64"));
}

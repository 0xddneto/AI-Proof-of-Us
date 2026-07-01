import { verify } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { canonicalJson } from "./canonical.js";
import type { CompleteTaskInput, ProviderEvidence, TaskSession, TrustTier } from "./types.js";

type ProviderKeyFile = Record<string, Record<string, string>>;

async function configuredKeys(): Promise<ProviderKeyFile> {
  const file = process.env.AIPOU_PROVIDER_KEYS_FILE;
  if (!file) return {};
  return JSON.parse(await readFile(path.resolve(file), "utf8")) as ProviderKeyFile;
}

export function providerAssertion(session: TaskSession, input: CompleteTaskInput): Record<string, unknown> {
  return {
    nonce: session.nonce,
    provider: session.provider,
    model: session.model,
    inputTokens: input.inputTokens,
    outputTokens: input.outputTokens,
    durationSeconds: input.durationSeconds,
    outputHash: input.outputHash
  };
}

export async function deriveTrustTier(
  session: TaskSession,
  input: CompleteTaskInput,
  evidence?: ProviderEvidence
): Promise<TrustTier> {
  if (!evidence) return "client_signed";

  const publicKey = (await configuredKeys())[session.provider]?.[evidence.keyId];
  if (!publicKey) throw new Error(`No trusted provider key for ${session.provider}/${evidence.keyId}`);
  const valid = verify(
    null,
    Buffer.from(canonicalJson(providerAssertion(session, input))),
    publicKey,
    Buffer.from(evidence.signature, "base64")
  );
  if (!valid) throw new Error("Invalid provider signature");
  return "provider_signed";
}

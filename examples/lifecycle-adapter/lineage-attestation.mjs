export const EXTERNAL_ATTESTATION_TRUST_MODEL = "issuer_asserted";

const REFERENCE_FIELDS = new Set(["scheme", "ref", "issuer", "trustModel"]);
const ISSUER_FIELDS = new Set(["kind", "id"]);

function canonicalize(value) {
  if (Array.isArray(value)) {
    return `[${value.map(canonicalize).join(",")}]`;
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value).sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0);
    return `{${entries.map(([key, entryValue]) => `${JSON.stringify(key)}:${canonicalize(entryValue)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function requireIdentifier(value, label) {
  if (typeof value !== "string" || value.length === 0 || value.length > 512) {
    throw new Error(`${label} must be a non-empty string of at most 512 characters`);
  }
}

function rejectUnknownFields(value, allowedFields, label) {
  for (const field of Object.keys(value)) {
    if (!allowedFields.has(field)) {
      throw new Error(`${label} contains unsupported field: ${field}`);
    }
  }
}

export function validateExternalAttestationReference(reference) {
  if (!reference || typeof reference !== "object" || Array.isArray(reference)) {
    throw new Error("External attestation reference is required");
  }
  rejectUnknownFields(reference, REFERENCE_FIELDS, "External attestation reference");
  requireIdentifier(reference.scheme, "External attestation scheme");
  requireIdentifier(reference.ref, "External attestation ref");
  if (reference.trustModel !== EXTERNAL_ATTESTATION_TRUST_MODEL) {
    throw new Error("External attestation references must remain issuer_asserted");
  }
  if (!reference.issuer || typeof reference.issuer !== "object" || Array.isArray(reference.issuer)) {
    throw new Error("External attestation issuer is required");
  }
  rejectUnknownFields(reference.issuer, ISSUER_FIELDS, "External attestation issuer");
  requireIdentifier(reference.issuer.kind, "External attestation issuer kind");
  requireIdentifier(reference.issuer.id, "External attestation issuer id");
  return true;
}

export function createExternalAttestationReference({ scheme, ref, issuer }) {
  const reference = {
    scheme,
    ref,
    issuer: { kind: issuer?.kind, id: issuer?.id },
    trustModel: EXTERNAL_ATTESTATION_TRUST_MODEL
  };
  validateExternalAttestationReference(reference);
  return reference;
}

function normalizedReferences(references) {
  if (!Array.isArray(references)) {
    throw new Error("externalAttestations must be an array");
  }
  const unique = new Map();
  for (const reference of references) {
    validateExternalAttestationReference(reference);
    const normalized = createExternalAttestationReference(reference);
    unique.set(canonicalize(normalized), normalized);
  }
  return [...unique.entries()]
    .sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0)
    .map(([, reference]) => reference);
}

export function attachExternalAttestationToLineage(lineageRecord, reference) {
  if (!lineageRecord || typeof lineageRecord !== "object" || Array.isArray(lineageRecord)) {
    throw new Error("Lineage record is required");
  }
  requireIdentifier(lineageRecord.artifactId, "Lineage artifactId");
  const current = lineageRecord.metadata?.externalAttestations ?? [];
  const externalAttestations = normalizedReferences([...current, reference]);
  return {
    ...lineageRecord,
    metadata: {
      ...(lineageRecord.metadata ?? {}),
      externalAttestations
    }
  };
}

export function mirrorLineageAttestationsToRunSummary(lineageRecord, runSummary) {
  if (!runSummary || typeof runSummary !== "object" || Array.isArray(runSummary)) {
    throw new Error("Run summary is required");
  }
  requireIdentifier(runSummary.runId, "Run summary runId");
  const externalAttestations = normalizedReferences(
    lineageRecord?.metadata?.externalAttestations ?? []
  );
  return {
    ...runSummary,
    metadata: {
      ...(runSummary.metadata ?? {}),
      externalAttestations
    }
  };
}

export function validateLineageAttestationMirror(lineageRecord, runSummary) {
  const lineageReferences = normalizedReferences(lineageRecord?.metadata?.externalAttestations ?? []);
  const summaryReferences = normalizedReferences(runSummary?.metadata?.externalAttestations ?? []);
  if (canonicalize(lineageReferences) !== canonicalize(summaryReferences)) {
    throw new Error("Run summary external attestations do not match artifact lineage");
  }
  return true;
}

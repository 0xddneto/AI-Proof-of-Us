# Registry Trust Checklist

AIPOU is published as `aipou-mcp-server` on npm and can be indexed by MCP and agent registries. Some registries grade trust with supply-chain signals that are separate from protocol design: publisher identity, domain control, signed/provenance publication, package scans, and ownership claims.

This document tracks what is already reproducible and what still depends on external registry synchronization.

## Completed In This Repository

- The package homepage points to the official project site: `https://0xddneto.github.io/AI-Proof-of-Us/`.
- The MCP `server.json` website URL points to the same official site.
- The official site publishes `/.well-known/forge.json` with publisher `0xddneto`, repository, and package metadata.
- The account-root site publishes `https://0xddneto.github.io/.well-known/forge.json`, allowing registries to verify control of the package homepage origin.
- A manual GitHub Actions workflow exists at `.github/workflows/npm-publish.yml` to publish the npm package with provenance.
- npm Trusted Publishing is configured for the repository and `npm-publish.yml` workflow.
- `aipou-mcp-server@0.2.2` was published from GitHub Actions with an npm SLSA provenance attestation on July 13, 2026.
- `io.github.0xddneto/ai-proof-of-us@0.2.2` is published in the official MCP Registry.
- Forge has a verified GitHub publisher submission with an Ed25519 public key and signature for `aipou-mcp-server@0.2.2`.
- ClawHub `skill verify aipou-farming --version 1.0.1` passes with a generated skill card and clean security evidence.
- Production dependency audit can be reproduced with:

```bash
npm audit --workspace mcp-server --omit=dev
```

## Required External Actions

These remaining steps depend on external registry review or synchronization:

1. Wait for Forge to recognize the public npm provenance attestation row. Forge's overall score is already `A / 100/100`, and its publisher, domain, signature, CVE, and static-analysis checks are complete.
2. If ClawHub adds publisher signatures or server-resolved repository provenance for existing versions, republish or import the skill through that path. The current skill passes verification but remains unsigned and has no ClawHub provenance record.

Until those registry-side steps are complete, external trust grades may remain low even when the local package, docs, and protocol tests pass.

## Current Verification Notes

- `npm audit --workspace mcp-server --omit=dev` should report zero known production vulnerabilities before each publication.
- On July 13, 2026, npm `0.2.2` was published successfully by GitHub Actions run `29247746209` through Trusted Publishing, with a public SLSA v1 provenance attestation.
- On July 13, 2026, MCP Registry entry `io.github.0xddneto/ai-proof-of-us@0.2.2` was published successfully.
- On July 14, 2026, `npx -y @forge-registry/cli verify aipou-mcp-server --json` resolved npm version `0.2.2`, found zero known vulnerabilities at every severity, and found no suspicious lifecycle scripts.
- On July 10, 2026, the repository owner completed Forge's web OAuth flow. Forge returned `Verified` and stated that `@0xddneto` was auto-verified as the owner of `0xddneto/AI-Proof-of-Us`.
- On July 14, 2026, Forge CLI authentication succeeded as `@0xddneto`. The signed publish initially failed because CLI `0.2.0` defaults to the retired `https://forge.dev` API, which returns HTML instead of registry JSON. Retrying with `FORGE_REGISTRY_URL=https://forgeregistry.com` completed successfully.
- The public Forge API now records `verified: true` plus the publisher Ed25519 public key and signature for `@0xddneto`. Its cached scan is `clean`: 30 files scanned, zero known vulnerabilities, no suspicious scripts, no prompt/content findings, and nine MCP tools classified as non-privileged.
- On July 14, 2026, the account-root GitHub Pages repository published `/.well-known/forge.json`. A new signed Forge publish then reported `domainVerified: true` and `verifiedDomain: "0xddneto.github.io"`.
- On July 17, 2026, the public Forge listing reports grade `A`, `100/100 Trusted`, signed Ed25519 publication, verified domain `0xddneto.github.io`, clean CVE scan, clean static analysis, zero vulnerable dependencies, and nine non-privileged MCP tools. Its npm provenance row still reports `0/5` even though npm exposes the public SLSA attestation at `https://registry.npmjs.org/-/npm/v1/attestations/aipou-mcp-server@0.2.2`. Treat that remaining row-level gap as a Forge ingestion limitation, not as a missing npm publication artifact.
- No Forge credential, GitHub token, email address, device code, or private signing material is stored in this repository.
- On July 14, 2026, `clawhub login` succeeded as `@0xddneto`, and `aipou-farming@1.0.1` was published at `https://clawhub.ai/0xddneto/skills/aipou-farming`.
- The official ClawHub stored scan report for `aipou-farming@1.0.1` downloaded successfully. Its manifest reported `status: succeeded`; `static-analysis.json` reported `status: clean`, engine `v2.4.26`, no findings, and summary `No suspicious patterns detected.`
- On July 14, 2026, ClawHub's official Skill Card worker generated and attached `skill-card.md`. `clawhub skill verify aipou-farming --version 1.0.1` now returns `ok: true` and `decision: pass`, with security `clean`, verdict `benign`, confidence `high`, clean static analysis, and a clean SkillSpector result.
- ClawHub currently reports the skill signature as unsigned and provenance as unavailable because version `1.0.1` was not imported with server-resolved GitHub provenance. These are distribution metadata gaps, not scan failures.

## Why This Matters

AIPOU asks agents and humans to trust receipts, claims, and validator policy. Registry trust signals do not prove useful AI work, but they help adopters answer practical questions before installing:

- Is this the official package?
- Does the package point to an owned domain?
- Was it published from a verifiable source workflow?
- Did common dependency and registry scans pass?
- Can the maintainer reproduce the exact package that users install?

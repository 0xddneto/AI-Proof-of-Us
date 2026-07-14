# Registry Trust Checklist

AIPOU is published as `aipou-mcp-server` on npm and can be indexed by MCP and agent registries. Some registries grade trust with supply-chain signals that are separate from protocol design: publisher identity, domain control, signed/provenance publication, package scans, and ownership claims.

This document tracks what is already reproducible and what still requires the repository owner to complete in the external registry UI.

## Completed In This Repository

- The package homepage points to the official project site: `https://0xddneto.github.io/AI-Proof-of-Us/`.
- The MCP `server.json` website URL points to the same official site.
- The official site publishes `/.well-known/forge.json` with publisher `0xddneto`, repository, and package metadata.
- A manual GitHub Actions workflow exists at `.github/workflows/npm-publish.yml` to publish the npm package with provenance.
- npm Trusted Publishing is configured for the repository and `npm-publish.yml` workflow.
- `aipou-mcp-server@0.2.2` was published from GitHub Actions with an npm SLSA provenance attestation on July 13, 2026.
- `io.github.0xddneto/ai-proof-of-us@0.2.2` is published in the official MCP Registry.
- Production dependency audit can be reproduced with:

```bash
npm audit --workspace mcp-server --omit=dev
```

## Required External Actions

These remaining steps depend on external registry review or synchronization:

1. Complete Forge CLI `forge publish` once its GitHub device-code flow accepts generated codes, so the listing receives the Ed25519 publish signature.
2. Wait for Forge to run or refresh its CVE/static analysis and npm provenance checks for the now-indexed `0.2.2` package.
3. Resolve the ClawHub generated-card state; security now verifies clean, but `skill verify` still fails while `skill-card.md` is unavailable from the registry endpoint.

Until those registry-side steps are complete, external trust grades may remain low even when the local package, docs, and protocol tests pass.

## Current Verification Notes

- `npm audit --workspace mcp-server --omit=dev` should report zero known production vulnerabilities before each publication.
- On July 13, 2026, npm `0.2.2` was published successfully by GitHub Actions run `29247746209` through Trusted Publishing, with a public SLSA v1 provenance attestation.
- On July 13, 2026, MCP Registry entry `io.github.0xddneto/ai-proof-of-us@0.2.2` was published successfully.
- On July 14, 2026, `npx -y @forge-registry/cli verify aipou-mcp-server --json` resolved npm version `0.2.2`, found zero known vulnerabilities at every severity, and found no suspicious lifecycle scripts. The CLI still returned `forge: null`, so this is package verification rather than a submitted signed Forge publish.
- On July 10, 2026, the repository owner completed Forge's web OAuth flow. Forge returned `Verified` and stated that `@0xddneto` was auto-verified as the owner of `0xddneto/AI-Proof-of-Us`.
- On July 14, 2026, the public Forge listing had reindexed to `aipou-mcp-server@0.2.2`, showed publisher `@0xddneto` as identity verified, and reported trust `35/100 (D)`. Remaining missing Forge signals were Ed25519 publish signature, Forge domain verification, Forge CVE/static scan scoring, and Forge recognition of npm provenance.
- Forge CLI `0.2.0` still could not authenticate: fresh device-flow codes were rejected by GitHub as unknown while the CLI remained waiting. Consequently, `forge publish --dry-run` can generate the local Ed25519 signature, but the signed publish cannot be submitted until the Forge CLI login flow works.
- No Forge credential, GitHub token, email address, device code, or private signing material is stored in this repository.
- On July 14, 2026, `clawhub login` succeeded as `@0xddneto`, and `aipou-farming@1.0.1` was published at `https://clawhub.ai/0xddneto/skills/aipou-farming`.
- The official ClawHub stored scan report for `aipou-farming@1.0.1` downloaded successfully. Its manifest reported `status: succeeded`; `static-analysis.json` reported `status: clean`, engine `v2.4.26`, no findings, and summary `No suspicious patterns detected.`
- ClawHub `skill verify aipou-farming --version 1.0.1` still returned `fail` only because `card.missing` remained at verification time. Security passed with `status: clean`, verdict `benign`, confidence `high`, clean static scan, and clean SkillSpector signal. The published artifact lists `SKILL.md`, `references/protocol.md`, and `agents/openai.yaml`; the registry did not attach a generated `skill-card.md` even after the local card file was added. Do not claim full ClawHub verification until that registry-side card field resolves.

## Why This Matters

AIPOU asks agents and humans to trust receipts, claims, and validator policy. Registry trust signals do not prove useful AI work, but they help adopters answer practical questions before installing:

- Is this the official package?
- Does the package point to an owned domain?
- Was it published from a verifiable source workflow?
- Did common dependency and registry scans pass?
- Can the maintainer reproduce the exact package that users install?

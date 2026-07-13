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

1. Wait for or request Forge Registry to reindex the provenance-published npm `0.2.2` package and the verified owner state.
2. Re-run Forge Registry scans after the refreshed package is visible.
3. Publish the official ClawHub scan report after logging in and uploading the OpenClaw skill.

Until those registry-side steps are complete, external trust grades may remain low even when the local package, docs, and protocol tests pass.

## Current Verification Notes

- `npm audit --workspace mcp-server --omit=dev` should report zero known production vulnerabilities before each publication.
- On July 13, 2026, npm `0.2.2` was published successfully by GitHub Actions run `29247746209` through Trusted Publishing, with a public SLSA v1 provenance attestation.
- On July 13, 2026, MCP Registry entry `io.github.0xddneto/ai-proof-of-us@0.2.2` was published successfully.
- On July 10, 2026, `npx -y @forge-registry/cli verify aipou-mcp-server --json` resolved npm version `0.2.1`, found zero known vulnerabilities at every severity, and found no suspicious lifecycle scripts. The listing itself remained unclaimed, so this is package verification rather than publisher verification.
- On July 10, 2026, the repository owner completed Forge's web OAuth flow. Forge returned `Verified` and stated that `@0xddneto` was auto-verified as the owner of `0xddneto/AI-Proof-of-Us`.
- The public listing did not immediately synchronize that result and continued to show its stale community-indexed `0.2.0`, `10/100`, unverified state after reload.
- After the npm `0.2.2` release, the public Forge listing still exposed stale `0.2.0` metadata at the latest check. A Forge refresh is pending; no updated trust grade is claimed here.
- Forge CLI `0.2.0` still could not authenticate: four fresh device-flow codes were rejected by GitHub as unknown while the CLI remained waiting. Consequently, `forge publish` could generate and save the local Ed25519 publisher key and signature, but could not submit them to the registry.
- No Forge credential, GitHub token, email address, device code, or private signing material is stored in this repository.
- `npx -y clawhub@latest scan -h` verifies the current ClawHub scan command surface.
- Local folder scans are no longer the ClawHub review path. The current flow is to publish or upload a skill version, then download the official scan report for that version.
- Do not claim a passed Forge or ClawHub scan until the registry has produced a report for the published package or skill.

## Why This Matters

AIPOU asks agents and humans to trust receipts, claims, and validator policy. Registry trust signals do not prove useful AI work, but they help adopters answer practical questions before installing:

- Is this the official package?
- Does the package point to an owned domain?
- Was it published from a verifiable source workflow?
- Did common dependency and registry scans pass?
- Can the maintainer reproduce the exact package that users install?

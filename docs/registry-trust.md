# Registry Trust Checklist

AIPOU is published as `aipou-mcp-server` on npm and can be indexed by MCP and agent registries. Some registries grade trust with supply-chain signals that are separate from protocol design: publisher identity, domain control, signed/provenance publication, package scans, and ownership claims.

This document tracks what is already reproducible and what still requires the repository owner to complete in the external registry UI.

## Completed In This Repository

- The package homepage points to the official project site: `https://0xddneto.github.io/AI-Proof-of-Us/`.
- The MCP `server.json` website URL points to the same official site.
- The official site publishes `/.well-known/forge.json` with publisher `0xddneto`, repository, and package metadata.
- A manual GitHub Actions workflow exists at `.github/workflows/npm-publish.yml` to publish the npm package with provenance.
- Production dependency audit can be reproduced with:

```bash
npm audit --workspace mcp-server --omit=dev
```

## Required External Actions

These steps cannot be honestly marked complete from the repository alone:

1. Configure npm Trusted Publishing for `aipou-mcp-server`, or provide a properly scoped npm token to the GitHub Actions workflow.
2. Publish the next package version from GitHub Actions with `npm publish --provenance --access public`.
3. Claim or verify the Forge Registry publisher/listing from the official owner account.
4. Re-run Forge Registry scans after the claimed/provenance-published package is visible.
5. Publish the official ClawHub scan report after logging in and uploading the OpenClaw skill.

Until those registry-side steps are complete, external trust grades may remain low even when the local package, docs, and protocol tests pass.

## Current Verification Notes

- `npm audit --workspace mcp-server --omit=dev` should report zero known production vulnerabilities before each publication.
- On July 10, 2026, `npx -y @forge-registry/cli verify aipou-mcp-server --json` resolved npm version `0.2.1`, found zero known vulnerabilities at every severity, and found no suspicious lifecycle scripts. The listing itself remained unclaimed, so this is package verification rather than publisher verification.
- The Forge CLI device login produced codes that GitHub rejected while the CLI continued waiting. The web claim route reached Forge's GitHub OAuth authorization screen, which requests read-only profile and email access and remains an account-owner permission step.
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

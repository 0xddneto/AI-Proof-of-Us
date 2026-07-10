# AIPOU Follow-Ups - 2026-07-10

## Product Changes Prepared

- Added deterministic `factId` derivation for `aipou-receipt-v1` from the collector fingerprint and task nonce.
- Added fail-closed reference validation for the only valid AIPOU pairing: `issuer_asserted + aipou-receipt-v1`.
- Added registry-state semantics: `active | superseded | revoked`, with revoked terminal and superseded linked to a successor.
- Added executable fixtures for unknown schemes, wrong evidence class, duplicate active facts, and terminal revocation.
- Added the official-site `/.well-known/forge.json` publisher declaration.
- Added a GitHub Actions npm publication workflow with Sigstore provenance support.
- Pointed npm and MCP metadata to the official project website.

## Verification

- Lifecycle reference tests: 4 passed.
- MCP protocol tests: 4 passed.
- npm production audit: zero known vulnerabilities.
- Forge CLI live verification of `aipou-mcp-server@0.2.1`: zero critical, high, moderate, or low OSV findings and no suspicious lifecycle-script findings.

## External Signals

### ElizaOS

The discussion incorporated AIPOU into its draft as `issuer_asserted + aipou-receipt-v1`. The latest proposal uses deterministic `factId`, a tri-state registry status, runtime `(kind, scheme)` compatibility checks, and AIPOU's negative fixtures as part of the conformance surface.

Thread: https://github.com/orgs/elizaOS/discussions/9810

### Forge Registry

The public listing still showed the stale MCP Registry version `0.2.0` and a `10/100` untrusted score. Live CLI verification independently found npm `0.2.1`, zero known vulnerabilities, and no suspicious lifecycle scripts.

Repository-side gaps were fixed. Publisher claim remains external: the CLI device flow generated valid-looking codes but GitHub rejected three fresh codes while the CLI continued waiting. The web claim path reaches a GitHub OAuth screen requesting read-only profile and email access; that permission requires the account owner's explicit approval.

Listing: https://forgeregistry.com/registry/aipou-mcp-server

### OpenClaw / ClawHub

The current review path remains: publish a skill version after login, then download the registry-produced report. Local-folder scan claims are not valid under the current CLI. This is a review path, not confirmed adoption.

Issue: https://github.com/openclaw/clawhub/issues/2946

## Adoption Status

There is concrete technical collaboration with ElizaOS and public review activity. There is still no confirmed third-party production integration or independently generated AIPOU receipt that should be counted as adoption.

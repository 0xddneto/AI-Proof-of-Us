# Security Policy

AI Proof of Us is experimental and unaudited. Treat the MCP server, token contracts, validator flow, and claim tooling accordingly.

## Supported Versions

| Version | Supported |
| --- | --- |
| `0.5.x` | Yes |
| `0.4.x` | Security fixes only |
| Earlier versions | No |

## Published Runtime

The npm package exposes only the MCP `stdio` transport. Its build bundles the
reachable stdio runtime from the current Model Context Protocol TypeScript SDK,
while the SDK remains a development dependency for compilation and integration
tests. This prevents unused HTTP server dependencies from entering the
published production dependency tree.

Release verification requires `npm audit --omit=dev` to report zero known
production vulnerabilities, a clean tarball installation, and a working local
receipt demo. Development dependencies are reviewed separately because the MCP
SDK currently includes transports that AIPOU does not publish or execute.

## Reporting a Vulnerability

Use GitHub's private vulnerability reporting flow from the repository Security tab when it is available.

If private reporting is unavailable, open a minimal issue asking the maintainer for a private contact channel. Do not include exploit details, private keys, wallet seed phrases, API keys, raw receipts, personal data, or other secrets in a public issue.

Include only what is necessary to reproduce the problem safely:

- affected version or commit
- affected component
- impact and prerequisites
- minimal reproduction steps
- suggested mitigation, if known

## Operational Safety

- Use only a new dedicated farming wallet with limited funds.
- Never configure a primary wallet or commit a private key.
- Keep raw prompts, outputs, and local receipt state private by default.
- Protect `AIPOU_DATA_DIR` with operating-system access controls. The Ed25519 collector private key is stored there unencrypted; file mode `0600` is best-effort and Windows ACLs may inherit broader permissions.
- Back up collector state only to encrypted storage. Anyone who obtains the collector private key can forge local collector signatures until that collector fingerprint is revoked.
- Never set `AIPOU_VALIDATOR_PRIVATE_KEY` on an ordinary MCP client. It belongs only on the separately operated protocol validator service.
- Treat claims and settlement as explicit user actions.
- Verify contract addresses and chain ID before any transaction.
- Do not treat a receipt as proof of task quality, payment, provider endorsement, or hidden AI-use detection.

The current local store is not encrypted at rest. Receipts contain hashes, public addresses, signatures, usage counts, and model/provider labels. They should still be treated as private metadata.

## Disclosure

Please allow reasonable time for investigation and remediation before public disclosure. There is currently no bug bounty program or guarantee of payment for reports.

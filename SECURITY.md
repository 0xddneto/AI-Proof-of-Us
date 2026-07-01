# Security Policy

AI Proof of Us is experimental and unaudited. Treat the MCP server, token contracts, validator flow, and claim tooling accordingly.

## Supported Versions

| Version | Supported |
| --- | --- |
| `0.2.x` | Yes |
| Earlier versions | No |

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
- Treat claims and settlement as explicit user actions.
- Verify contract addresses and chain ID before any transaction.
- Do not treat a receipt as proof of task quality, payment, provider endorsement, or hidden AI-use detection.

## Disclosure

Please allow reasonable time for investigation and remediation before public disclosure. There is currently no bug bounty program or guarantee of payment for reports.

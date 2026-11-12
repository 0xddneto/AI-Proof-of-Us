# Independent receipt pilot

## Published package

Use Node 22 or 24. Installation needs npm access; generating and checking receipts does not require a network connection, funds or validator credentials.

```sh
npx -y aipou-mcp-server@0.6.0 --demo
npx -y aipou-mcp-server@0.6.0 --init
npx -y aipou-mcp-server@0.6.0 --doctor
```

Copy the returned MCP configuration into your client. From a source checkout, `--init` instead prints the current Node executable and absolute checkout entrypoint, so it tests the build you selected.

If a new npm version is still processing or you prefer a pinned source build:

```sh
git clone https://github.com/0xddneto/AI-Proof-of-Us.git
cd AI-Proof-of-Us
git checkout --detach v0.6.0
npm ci --workspace mcp-server --ignore-scripts --no-audit --no-fund
npm run build --workspace mcp-server
node mcp-server/dist/index.js --init
node mcp-server/dist/index.js --doctor
```

1. Run `begin_ai_task` with the SHA-256 of a task you actually need to perform. Keep prompts and outputs local.
2. Perform the task, save its output, and call `complete_ai_task` once with the SHA-256 of that file. If token usage is unavailable use zero counts plus `tokenUsageMeasurement: "unmeasured"`; measured zero is `"measured"`. Omission means `"unspecified"`.
3. Pass the receipt to `verify_aipou_receipt`. Compare `outputHash` with a fresh SHA-256 of your file. An altered copy must return `valid: false`, `workReceiptId: null` and an unverified `claimedWorkReceiptId`.
4. If completion's response is lost, use `export_ai_receipts` and match the original nonce. Do not repeat the work to recover a receipt. Reusing a completed nonce remains rejected.
5. Optionally run `--feedback` with the same installation environment. Review the local counts before sharing; nothing is sent automatically.

Report OS, Node/client, task category, verification result, friction and whether you would use it again in [issue #14](https://github.com/0xddneto/AI-Proof-of-Us/issues/14). No raw task content, secrets or full local state is requested. The disposable `--demo` is a rehearsal; only a task of your own counts as an independent pilot.

## Evidence so far

On November 11, 2026, [salahmakboul reported a real-task pilot](https://github.com/0xddneto/AI-Proof-of-Us/issues/14#issuecomment-6793106396) on Windows, using a custom Python stdio client, with Node networking blocked after installation. Signature/hash checks, tamper rejection and duplicate-nonce refusal worked. The author supplied five actionable improvements and explicitly reported no current recurring need for signed receipts. This is one independent successful trial, not production adoption, a framework integration, revenue or funding.

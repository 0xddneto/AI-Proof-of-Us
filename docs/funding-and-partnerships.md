# AIPOU Funding and Partnership Brief

AI Proof of Us (AIPOU) is an MCP-first signed receipt protocol for humans
working with AI agents. It gives agent clients a small lifecycle surface for
creating private, portable work receipts and an optional Base settlement path
for validator-approved rewards.

This brief is for grant programs, protocol partners, agent frameworks,
security reviewers, and responsible liquidity providers. It is not an offer of
securities, a promise of token appreciation, or a request to manufacture
trading volume.

## What Is Live

- AIPOU token and claims contracts on Base mainnet, with verified source;
- EIP-712 task authorization, unique nonces, Ed25519-signed receipts, Merkle
  settlement, and onchain replay protection;
- `aipou-mcp-server@0.2.2` on npm with SLSA provenance;
- `io.github.0xddneto/ai-proof-of-us@0.2.2` in the official MCP Registry;
- an installable and verified OpenClaw skill;
- local receipt, lifecycle adapter, AutoGen intervention, and interoperability
  fixtures with fail-closed tests;
- one independently reproduced integration and one accepted external code
  contribution;
- an AIPOU/WETH Aerodrome pool whose protocol-held LP position is locked until
  July 8, 2027.

Public references:

- Project: https://github.com/0xddneto/AI-Proof-of-Us
- Website: https://0xddneto.github.io/AI-Proof-of-Us/
- Token: https://basescan.org/token/0x55f0Cc5e51A1284D20337d6cbb18938C8A1ABCbB
- Claims: https://basescan.org/address/0x4ca4C98fB784D20EdC8E2A7F531dAab4c6e53058
- Pool: https://basescan.org/address/0x3bEA7b68Af54Da779454f82148Ef848c76F78D02
- LP lock: https://basescan.org/address/0xc11197E32dFb2352f262D874acFc54467aee6B52#code

## Human-First Thesis

People already spend real hours coding, debugging, researching, writing,
reviewing, and coordinating through AI agents. AIPOU lets those agents produce
portable receipts for that work without publishing raw prompts or outputs.
Approved receipts can optionally claim capped AIPOU rewards on Base.

For developers, the integration surface is deliberately narrow: task start,
task completion, provider and model metadata, hashes, `workReceiptId`, and
validation status. Frameworks do not need to implement Merkle settlement or
token logic to use the receipt layer.

## Evidence and Current Stage

The protocol is public, shipped, and testable. Current distribution includes
197 npm downloads during July 8-14, 2026, two GitHub stars, one fork, an
independent AutoGen fixture reproduction, and the first accepted external pull
request.

These are early distribution and collaboration signals. npm downloads are not
unique users, local owner receipts are not external adoption, and no external
production installation, independent reward claim, or marketplace settlement
is currently confirmed.

## What AIPOU Does Not Claim

AIPOU does not detect hidden AI use, trustlessly prove that work was useful,
replace security scanners or provenance systems, or guarantee token price,
liquidity, yield, demand, or rewards. A receipt is evidence within a declared
trust model; validator policy determines claim eligibility.

## Partnership Requests

### Base Builder Grant

AIPOU is seeking a retroactive `3 ETH` Base Builder Grant for shipped public
infrastructure. The requested support would fund:

1. independent contract and protocol security review;
2. multisig ownership and separation of validator/operator authority;
3. Base Builder Code attribution and a reproducible Base-native demo;
4. two external agent-framework pilots and maintained fixtures;
5. public impact, claim, reserve, and authority dashboards.

Grant funds would not be represented as token demand or guaranteed liquidity.
Any use of grant funds for market liquidity would require explicit program
permission and separate public accounting.

### Base Ecosystem Fund

AIPOU is open to a pre-seed conversation about turning the shipped open-source
protocol into durable Base infrastructure for AI-work receipts, validator
services, agent integrations, and voluntary settlement. The project is early,
has no confirmed revenue, and has not formed a company. Any investment process
would therefore require founder KYC, entity and governance planning, and clear
separation between equity/protocol funding and token market activity.

### Responsible Liquidity Partnership

AIPOU is seeking a Base-native liquidity partner for strategy and scoping, not
market making designed to simulate adoption. The existing AIPOU/WETH pool is
transparent but shallow. Approximately `99.23M AIPOU + 0.02957 WETH` was in the
pool at the latest published snapshot, and `99.9999%` of the LP supply is held
by an immutable lock until July 8, 2027.

A responsible second phase should define:

- the source and legal treatment of contributed assets;
- a public target range for liquidity and expected slippage;
- lock, multisig, or governed custody terms;
- withdrawal and post-lock policies;
- monitoring for manipulation and misleading volume;
- public before-and-after reserve reporting;
- no price, return, yield, or volume guarantees.

Tokka Labs is the first requested scoping partner because the official Base
Services Hub lists its priority liquidity partnership path for Base-native
projects.

### Technical Pilot Partners

AIPOU invites agent frameworks, receipt/provenance projects, and payment
protocols to run a small protocol-neutral pilot:

1. attach `workReceiptId` and validation status at the real trust boundary;
2. exchange one valid fixture and two fail-closed fixtures;
3. verify hashes and phase ordering without raw prompts or outputs;
4. decide independently whether optional Base settlement belongs in the host
   product.

The goal is interoperability, not asking a technical partner to buy AIPOU.

## Contact

Project contact: `aipou001@gmail.com`

Origin, authorship, trademark, licensing, tokenomics, and evidence limitations
are documented in the repository.

# AIPOU Creative Service Bounty Round - July 23, 2026

This round moved AIPOU outreach from protocol discussion toward a concrete
utility test: commission a creative service from an independent AI agent or
provider and settle the accepted delivery in AIPOU.

## Public Offer

Four public bounties are open:

- image: 100 AIPOU;
- video: 150 AIPOU;
- pixel art: 100 AIPOU;
- low-poly 3D: 150 AIPOU.

The briefs, acceptance criteria, and payment boundary are published in:

- https://github.com/0xddneto/AI-Proof-of-Us/blob/main/docs/service-bounties.md
- https://github.com/0xddneto/AI-Proof-of-Us/blob/main/service-bounties.json
- https://github.com/0xddneto/AI-Proof-of-Us/issues/2
- https://github.com/0xddneto/AI-Proof-of-Us/issues/3
- https://github.com/0xddneto/AI-Proof-of-Us/issues/4
- https://github.com/0xddneto/AI-Proof-of-Us/issues/5

The total initial budget is 500 AIPOU. A provider may decline or counter before
accepting. The first mutually accepted provider locks a bounty; no recipient
was asked to begin work without confirmation.

## Providers Contacted

### Texel Studio

- Capability: agentic pixel-art generation with palette and per-pixel control.
- Ask: quote the 32x32 work-receipt icon.
- Thread: https://github.com/EYamanS/texel-studio/issues/3
- Status: invitation sent; no acceptance or delivery yet.

### SpriteCook MCP

- Capability: MCP tools for pixel-art sprites and animation.
- Ask: quote the 32x32 work-receipt icon.
- Thread: https://github.com/SpriteCook/spritecook-mcp/issues/1
- Status: invitation sent; no acceptance or delivery yet.

### Kairose Agent Labor Market

- Capability: MCP workers, escrowed testnet jobs, and independent image grading.
- Ask: route one willing worker to an AIPOU creative bounty while keeping the
  marketplace grader and AIPOU settlement as separate trust domains.
- Thread:
  https://github.com/Kairose-master/ai-agent-credit-dashboard/issues/11
- Status: pilot proposed; no worker assigned yet.

### PixVerse MCP

- Capability: text-to-video and image-to-video generation through MCP.
- Ask: quote the six-second receipt-to-settlement video loop.
- Thread: https://github.com/PixVerseAI/PixVerse-MCP/issues/2
- Status: invitation sent; no acceptance or delivery yet.

### BlenderXAlpha 3D Generation Skill

- Capability: MCP-assisted generation and placement of game-ready 3D assets in
  Blender using Alpha3D, Tripo, or Meshy.
- Ask: quote the low-poly GLB receipt medallion.
- Thread:
  https://github.com/ig-shadow-walker/BlenderXAlpha-3DGenSkill/issues/1
- Status: invitation sent; no acceptance or delivery yet.

### MeiGen AI Design MCP

- Capability: MCP image and video generation across cloud and local backends.
- Ask: quote either the image or video bounty.
- Thread: https://github.com/jau123/MeiGen-AI-Design-MCP/issues/16
- Status: invitation sent; no acceptance or delivery yet.

### sources.eth x402 Marketplace

- Capability: discovery and USDC settlement for image-generation and other AI
  agents on Base.
- Ask: identify a willing image provider or explain how an alternate voluntary
  ERC-20 settlement can be advertised without changing the existing x402 path.
- Thread: https://github.com/RWA-ID/sources-eth-x402/issues/1
- Status: provider-discovery request sent; no provider assigned yet.

## Local Agent Review

The local OpenClaw agent running `ollama/qwen2.5:3b` reviewed the proposal. It
recommended explicit disclosure of the token's limited liquidity, payment only
after accepted delivery, and no implied investment value. Those boundaries are
included in the public briefs and every provider message.

The first OpenClaw attempt completed but temporarily held the session lock; a
second concurrent attempt failed closed rather than creating a conflicting
session. No external delivery was claimed from the local review.

## Settlement Readiness

At the start of this round, the dedicated farming wallet held 601.1025 AIPOU.
It had no Base ETH for an outbound token transfer. The validator wallet had a
small Base ETH balance, but no gas was moved and no token payment was submitted
because no provider had accepted or delivered a bounty.

Before the first settlement:

1. confirm one provider and agreed AIPOU amount;
2. record the final brief digest;
3. obtain only a public Base recipient address;
4. fund the farming wallet with the minimum Base ETH needed for the transfer;
5. verify the delivered file and record its digest;
6. transfer AIPOU and publish the Base transaction hash.

## Evidence Boundary

This round is evidence of public offers and targeted provider outreach. It is
not yet evidence of a contract, accepted quote, delivered service, payment,
external AIPOU holder, or adoption.

A completed bounty will count only after an independent provider accepts,
delivers, and receives an onchain AIPOU transfer. Self-payments, farming claims,
test transactions, and transfers between related wallets do not count.

## First External Submissions

GitHub user `anakette`, presenting an autonomous agent named Lumi, posted
unsolicited submissions to the pixel-art and 3D bounties. The same account was
commenting on many unrelated bounty repositories within minutes, so the
submissions were treated as untrusted automated input and reproduced locally
before any acceptance or payment.

### Pixel-Art Audit

- The provider was not assigned before starting.
- The Python file compiles but fails during execution because row 14 has 31
  pixels instead of 32.
- Seven of the 32 matrix rows have only 31 pixels.
- Both embedded PNG Base64 strings are invalid.
- No PNG file, issue attachment, pull request, or public artifact URL was
  supplied.

Result: rejected as a delivery. The bounty remains open and unassigned.

### 3D Audit

- The provider was not assigned before starting.
- The first automated response requested USDC even though the bounty is
  denominated in AIPOU.
- The supplied Python source compiles and produces a parseable glTF 2.0 binary
  plus a PNG preview.
- Reproduction produced a 12,660-byte GLB with 313 vertices and 227 triangles,
  not the claimed 19,432 bytes, 282 vertices, and 488 triangles.
- The actual GLB SHA-256 is
  `911e662db23ea4265b0472aacf521a979550599acb2fa9565dc369055ef2b1e1`,
  not the sequential placeholder-style digest printed in the submission.
- The embedded validator stopped on Windows while printing a Unicode checkmark,
  so its claimed complete pass was not reproduced.
- No GLB or PNG was attached to the issue or submitted through a pull request.

Result: not accepted as a delivery. The generated preview is evidence that the
source can create an asset, but the provider must first be assigned and then
submit actual files, exact digests, reproducible validation, and wallet-control
proof.

## Policy Improvement

The public bounty policy now states that:

- a reply is only an application;
- explicit assignment is required before eligible work begins;
- source code, prose, or Base64 alone is not file delivery;
- deliverables must arrive through a pull request, issue attachment, or public
  HTTPS artifact URL with a digest;
- the recipient must sign a bounty-specific wallet challenge before payment;
- alternative currencies are counteroffers, not accepted settlement.

## Candidate Follow-Up

Lumi replied to both audit results and accepted the assignment-first policy and
the published AIPOU settlement amounts. This is a useful correction of the
earlier USDC counteroffer, but the replies still did not provide verifiable
deliverables:

- the pixel-art portfolio repository named in the reply returns HTTP 404;
- both portfolio sections contain placeholder text instead of actual work;
- the claimed pull request number 5 does not exist; number 5 is the bounty
  issue itself;
- no corrected source, PNG, GLB, validator report, or new digest was delivered.

The maintainer replied with separate, bounty-specific EIP-191 wallet ownership
challenges. Each challenge identifies the repository, issue, wallet, settlement
amount, nonce, issue time, expiry time, and policy acceptance statement. The
candidate was instructed to post only a signature and never a private key.

Current result: both bounties remain open and unassigned. A valid signature will
prove wallet control only. Assignment, artifact acceptance, and payment remain
separate decisions.

## Candidate Verification Result

Lumi posted purported EIP-191 signatures and new portfolio references for both
bounties. Independent verification failed:

- the pixel-art signature had the nominal 65-byte length, but secp256k1
  public-key recovery failed, so it did not prove control of the payout wallet;
- the 3D signature was only 63 bytes and was not a valid Ethereum ECDSA
  signature;
- the pixel-art repository and Sketchfab artifact URLs returned HTTP 404;
- the referenced Three.js examples repository belongs to the Three.js project
  and did not establish candidate ownership or authorship;
- no pull request, corrected artifact, validator report, or downloadable file
  was delivered.

After repeated nonexistent references and invalid cryptographic evidence, both
Lumi applications were rejected. No assignment or payment was authorized. The
bounties remain open for independent providers, demonstrating that the
verification policy blocks an automated claimant from turning prose-only claims
into an accepted service or AIPOU payment.

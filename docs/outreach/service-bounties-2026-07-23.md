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

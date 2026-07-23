# AIPOU Creative Service Bounties

AIPOU is testing a simple utility: paying independent AI agents and creative
service providers for concrete deliverables.

The first round contains four small commissions for image, video, pixel art,
and 3D work. The public machine-readable list is
[`service-bounties.json`](../service-bounties.json).

## Open Bounties

| ID | Deliverable | Initial offer |
| --- | --- | ---: |
| `AIPOU-CREATIVE-IMAGE-001` | One original 1024x1024 PNG about human-agent work and a private receipt | 100 AIPOU |
| `AIPOU-CREATIVE-VIDEO-001` | One original 6-second seamless 16:9 MP4 receipt-to-settlement loop | 150 AIPOU |
| `AIPOU-CREATIVE-PIXEL-001` | One original 32x32 transparent pixel-art work-receipt icon | 100 AIPOU |
| `AIPOU-CREATIVE-3D-001` | One original low-poly GLB receipt medallion plus PNG preview | 150 AIPOU |

The detailed acceptance criteria are in the JSON file. A provider may decline
or propose a different AIPOU amount before accepting the work.

## How A Commission Works

1. The provider identifies a bounty and replies through a public project issue
   or emails `aipou001@gmail.com`.
2. Both sides agree on the exact brief, AIPOU amount, delivery location,
   attribution, and Base recipient address before work begins.
3. A SHA-256 digest of the agreed brief is recorded.
4. The provider produces the deliverable. Using the AIPOU MCP to create a work
   receipt is welcome but not required.
5. AIPOU checks only the published acceptance criteria. Delivery evidence and
   any AIPOU work receipt remain separate evidence objects.
6. After acceptance, AIPOU transfers the agreed token amount on Base and records
   the transaction hash beside the bounty.

Replying to a bounty is an application, not an assignment. Work started before
an explicit maintainer assignment is not eligible for automatic payment.

Delivery must include the actual requested files through a GitHub pull request,
GitHub issue attachment, or public HTTPS artifact URL with a SHA-256 digest.
Source code, prose, claimed test output, or Base64 text alone is not a delivered
PNG, MP4, or GLB.

No provider should send a private key, seed phrase, account password, deposit,
or advance payment. A public Base recipient address is sufficient after an
agreement exists. Before payment, the provider must prove control of that
address by signing a bounty-specific challenge message. The signature grants no
token allowance and no transaction authority.

## Settlement Boundary

AIPOU is experimental and unaudited. It has intentionally tiny market
liquidity and no promised fiat value. These bounties do not promise price,
yield, convertibility, future demand, or investment returns.

Accepting AIPOU for a service is voluntary. A provider does not need to buy
AIPOU, install the farming MCP, submit receipts, or claim rewards. The service
payment is a normal ERC-20 transfer after accepted delivery; farming rewards
and validator-approved claims are a separate protocol path.

The amount published for each bounty is denominated in AIPOU. A request for
USDC, ETH, or another asset is a counteroffer and is not accepted unless the
maintainer explicitly changes the agreement before work begins.

## Public Completion Record

For every completed bounty, the repository will record:

- bounty ID;
- provider's public name or agent identifier;
- agreed brief digest;
- deliverable URL and file digest;
- agreed AIPOU amount;
- Base recipient address;
- settlement transaction hash;
- acceptance date.

This record demonstrates actual token utility without treating self-payments,
tests, transfers between related wallets, or farming claims as service revenue
or external adoption.

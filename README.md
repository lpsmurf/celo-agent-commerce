# Celo Agent Commerce

x402 payment rails on [Celo](https://celo.org) for the things people in MiniPay markets actually buy — mobile airtime, data bundles, gift cards and eSIMs — callable by any agent, bot or app with one HTTP request, and by humans through a wallet checkout.

> Built for the [Celo Agents at Work Hackathon](https://celoplatform.notion.site/Agents-at-Work-Hackathon-3c1d5cb803de81139de7f4f3d09e55dc) (Aug–Sep 2026). Orders are fulfilled by [Cryptorefills](https://www.cryptorefills.com) (10,500+ brands, 180+ countries).

## What it does

- **Pay per order over x402.** `POST` an order, get a `402` with the price, pay a stablecoin on Celo, and the store settles through Celo's hosted facilitator, buys from Cryptorefills, and delivers. The buyer needs no CELO for gas.
- **Three stablecoins:** USD₮, USA₮ and USDC on Celo. USA₮ is what the [Self × Google Cloud faucet](https://cloud.google.com/application/web3/faucet/celo/mainnet) pays verified humans — claim it, then spend it here.
- **Tagged checkout for wallets that can't sign x402** (MiniPay, Valora): a web page that hands the wallet a normal stablecoin transfer carrying an [ERC-8021](https://github.com/celo-org/ERCs) attribution tag, verified on-chain. Gas is paid in the stablecoin via Celo fee abstraction.
- **MCP server** so an AI agent can browse and buy: `list_brands`, `list_products`, `get_quote`, `buy_product`, `get_order_status`.
- **Integrator revenue share:** apps and agents that route orders under their ERC-8004 id earn a share of the order commission.

Celo has no direct bridge for USA₮, so the store swaps USA₮ → USD₮ on Celo, then bridges to Base (where Cryptorefills settles) via [Relay](https://relay.link). A float removes the bridge hop; without one the bridge cost is priced into each order so a small order never runs at a loss.

## Layout

```
packages/
├── x402-common   Shared x402 V2 base — CAIP-2 networks, Celo assets, facilitator
│                 routing, and the "settle-before-deliver" upfront gate.
├── store         The store backend: x402 orders, the tagged checkout, the
│                 swap→bridge→fulfil pipeline, background delivery, the ledger.
└── mcp           The MCP server (stdio + Streamable HTTP), on the MCP TS SDK v2.
scripts/          ERC-8004 registration.
```

## Run it

```bash
npm install
npm run build
npm test

# store (needs a Celo operator wallet + facilitator key — see packages/store/.env.example)
npm run dev -w x402-store-backend

# MCP server over stdio
npm run dev -w celo-commerce-mcp
```

The MCP server is also live over Streamable HTTP at `https://store.hfsp.cloud/mcp`, and the store's OpenAPI spec at `https://store.hfsp.cloud/openapi.json`.

## How payment works (x402 V2)

1. `POST /api/celo/orders?asset=USDT|USAT|USDC` with `{ email, items: [{ product_id, beneficiary_account? }] }`.
2. Get `402` with `PAYMENT-REQUIRED`; sign the `exact`-scheme payment for the Celo stablecoin and retry with `PAYMENT-SIGNATURE`.
3. Get `202` with an `orderId`. Delivery runs in the background (swap, bridge, purchase); poll `GET /api/celo/orders/:orderId` until `delivered`.

Voucher codes are emailed to the buyer and are **never** returned by a status endpoint — see [SECURITY.md](SECURITY.md).

## Security

Payments are verified on-chain, the supplier's signed 402 is verified before we pay, and supplier voucher codes are never exposed through status endpoints. Details and how to report an issue: [SECURITY.md](SECURITY.md).

## Status

- [x] Celo networks, assets and facilitator routing (USD₮ / USA₮ / USDC)
- [x] x402 orders, settled end-to-end on Celo mainnet
- [x] Tagged checkout for MiniPay-style wallets
- [x] USA₮ → USD₮ swap and Celo → Base bridge
- [x] Background delivery + order status; unattended health monitoring
- [x] MCP server (stdio + HTTP)
- [x] Integrator revenue-share ledger
- [x] ERC-8004 registration (mainnet agent id 9844)
- [ ] Daily float rebalancer
- [ ] MCP Registry / Smithery listings

## License

[MIT](LICENSE) · Contact: info@hfsp.xyz

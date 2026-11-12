# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

npm workspaces, Node 20+, TypeScript ESM (`NodeNext`, so relative imports need the `.js` extension). Workspace names: `@hfsp/x402-common`, `x402-store-backend`, `celo-commerce-mcp`.

```bash
npm install
npm run build        # all workspaces; x402-common must build before store (store imports its dist)
npm test             # x402-common + store unit tests — no network, keys, chain or redis needed
npm run typecheck

npm run dev -w x402-store-backend   # tsx watch; needs packages/store/.env (see .env.example)
npm run dev -w celo-commerce-mcp    # stdio MCP server; set MCP_HTTP_PORT for Streamable HTTP at /mcp
```

Single test file / single test:

```bash
# store tests run straight from TS
cd packages/store && node --import tsx --test test/celo.test.ts
cd packages/store && node --import tsx --test --test-name-pattern "verifyCheckoutPayment" test/celo.test.ts

# x402-common compiles tests to dist-test first
cd packages/x402-common && npx tsc -p tsconfig.test.json && node --test dist-test/index.test.js
```

CI (`.github/workflows/ci.yml`) runs `npm ci && npm run build && npm test` on Node 20.

Operator scripts (run with `npx tsx` from `packages/store`): `celo-first-order.ts`, `celo-resume-order.ts`, `celo-rebalance.ts` (Base USDC float top-up; dry run unless `--send`). Root `scripts/celo-register-agent.ts` does ERC-8004 registration.

## Architecture

**x402-common** — shared x402 V2 base: CAIP-2 networks and stablecoin addresses (`networks.ts`), facilitator routing and `createResourceServer`/`gate` (`server.ts`), and `createPrepaidGate` (`prepaid.ts`) — the x402 `upfront` flow that **settles before the business handler runs**. Under upfront there is no refund, so callers own reconciliation and must guard irreversible fulfilment with a durable claim.

**store** (Express) has two rails:
- Legacy Solana rail: `/api/orders` (`routes/orders.ts`, `paysolana.ts`, `heliusVerify.ts`).
- Celo rail: mounted in `src/index.ts` **only when `celoConfig.ts`'s zod schema fully parses** (`celoEnabled`), so a missing key never half-enables a route that takes payment. `celoEnv` is `undefined` otherwise — only import Celo modules behind that check (index.ts uses dynamic imports).

Celo order flow:
1. `POST /api/celo/orders?asset=USDT|USAT|USDC` (`routes/celoOrders.ts`): price via `celoFulfil.priceOrder` (Cryptorefills price + commission; without float mode, plus Relay bridge cost + slippage margin), store a **price lock** in redis (`celoState.ts`, keyed by hash of body+asset) so the paid retry signs the exact same amount, answer 402. Refuses to quote when facilitator credits < `MIN_FACILITATOR_CREDITS` or redis is unreachable.
2. Paid retry: settle through the Celo facilitator via the prepaid gate, answer 202 with an `orderId`.
3. `celoJobs.ts` fulfils in the background on a **single serial queue** (one operator hot wallet shared across Celo and Base — parallel sends race nonces/balances): USA₮→USD₮ swap, Relay bridge Celo→Base (`relay.ts`), pay Cryptorefills on Base (`payBase.ts`, `cryptorefills.ts`), then track delivery. Stages: `fulfilling → delivering → delivered | failed`. On startup `sweepInterrupted()` sends in-flight jobs to reconciliation.
4. Anything paid but not fulfilled goes to `recordReconciliation` (redis list + `alert()`) and is **never retried automatically** — a retry could buy the product twice.

Tagged checkout (`routes/celoCheckout.ts`, `public/checkout/`): for wallets that can't sign x402 (MiniPay, Valora). The buyer sends a plain stablecoin transfer carrying an ERC-8021 attribution suffix (store `ATTRIBUTION_TAG` + per-order code); `services/checkoutVerify.ts` verifies it from the token's `Transfer` event logs, not calldata. It feeds the same `celoFulfil` pipeline.

Supplier wire quirks: Cryptorefills' 402 is V1-shaped despite claiming V2; `crWire.ts` normalizes it and encodes the payment signature their way. `crAttestation.ts` verifies the supplier's signed 402 (JWS/ES256) before paying, failing closed. `publicResult` strips voucher codes/PINs/contact data — status endpoints must never return them (order ids are not secrets).

Landing page (`public/free/`, served at `/free`; `/` redirects there): multi-language (en/sw/fil/pt) campaign page. Products come from `GET /api/celo/popular?country=` (`services/celoPopular.ts`): curated picks per country until `MIN_REAL_ORDERS` delivered orders, then ranked by real deliveries counted in `celoJobs.ts`. helmet's default CSP (`script-src 'self'`, `connect-src 'self'`) applies to all static pages — **no inline scripts or third-party fetches**; put JS in a sibling `app.js`.

Integrator revenue share: `X-Integrator` (ERC-8004 id) credits a share of commission in `celoLedger.ts` (idempotent per tx; math in `celoShare.ts`). Payouts are a separate manual step.

Redis holds all durable state (keys prefixed `store:celo:`). `noLogs` middleware: the store keeps no request logs; rate-limit keys are salted IP hashes in memory.

**mcp** — MCP server on the MCP TS SDK v2 (`@modelcontextprotocol/server`). A thin client of the store's public HTTP API (`store.ts`, default `STORE_URL=https://store.hfsp.cloud`); it never settles payments itself. `buy_product` pays either from a local `CELO_BUYER_PRIVATE_KEY` (stdio only, capped by `MAX_ORDER_USD`) or via the x402 MCP flow (`_meta["x402/payment"]` in, `_meta["x402/payment-response"]` out). HTTP mode refuses to start if a buyer key is set. Publishing: `packages/mcp/PUBLISHING.md`.

## Conventions (from CONTRIBUTING.md / SECURITY.md)

- Payment verification, wire adapters and money math live in pure, dependency-free modules (`checkoutVerify.ts`, `crWire.ts`, `celoShare.ts`, `celoSchemas.ts`) with unit tests in `packages/store/test/`. Add tests there instead of hitting live endpoints.
- Never weaken a payment check without a test showing the new rule still rejects what it should.
- Money is atomic bigint (6 decimals); round commission up (`ceilDiv`).
- Comments explain *why*, not *what*.

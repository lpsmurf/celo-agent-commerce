# Go-to-market — Celo Agent Commerce

Status on 2026-09-15: store live (`store.hfsp.cloud/health` ok), MCP live over HTTP,
settled end-to-end on Celo mainnet, ERC-8004 agent id 9844. **Nobody can find it yet**:
not on npm, not on the MCP Registry, not on Smithery, and the public OpenAPI `info`
block still describes the Solana store.

## Positioning

**One line:** the things people in MiniPay markets actually buy — airtime, data, gift
cards, eSIMs — as one x402 call on Celo, for any agent, bot or app.

**Why it wins on Celo specifically**
- Real-world spend, not a demo: 10,500+ brands, 180+ countries via Cryptorefills.
- Closes the loop on the Self × Google Cloud faucet: verified humans get USA₮, and this
  is somewhere to spend it.
- Works for wallets that can't sign x402 (MiniPay, Valora) through the tagged checkout,
  gas paid in stablecoin.
- Integrators earn a revenue share under their ERC-8004 id — a reason for other builders
  to route orders here.

## Who we sell to (in order)

| # | Segment | What they get | Where they are |
|---|---|---|---|
| 1 | **Agent builders** (Claude/ChatGPT/MCP, ElizaOS, Hermes, x402 agents) | `buy_product` tool, no account, no API key | MCP Registry, Smithery, x402 ecosystem, X/Farcaster |
| 2 | **MiniPay / Celo app builders** | Airtime + data checkout they can embed, plus rev share | Celo Discord/forum, MiniPay dev channels, Celo hackathon cohort |
| 3 | **Telegram/WhatsApp bot builders** in Africa & LatAm | One HTTP call for top-ups | Local dev communities, Celo regional hubs |
| 4 | **End users** (via partners, not direct) | Top up a phone with stablecoins | Reached through segments 1–3 |

Do not market to end users directly this month — distribution comes through integrators.

## Launch plan

### Day 0 — make it discoverable (fixes first)
- [ ] Fix OpenAPI `info` at `store.hfsp.cloud/openapi.json`: title/description must say Celo (keep Solana as a secondary network).
- [ ] `npm publish --access public` for `celo-commerce-mcp` (needs npm login) — see `packages/mcp/PUBLISHING.md`.
- [ ] Publish `server.json` to the MCP Registry (`io.github.lpsmurf/celo-commerce`).
- [ ] Connect repo at smithery.ai/new → `packages/mcp`.
- [ ] Tick "MCP Registry / Smithery listings" in README once live.
- [ ] Add a 60–90s demo video: an agent in Claude buys a data bundle paid in USD₮ on Celo, then the Celoscan tx.

### Day 1 — launch posts
- [ ] X thread (draft below) from HFSP Labs, tag @Celo, @CeloDevs, @MiniPay, @cryptorefills, @x402 ecosystem.
- [ ] Same thread cross-posted to Farcaster (/celo channel).
- [ ] Celo forum / Discord showcase post (draft below).
- [ ] Hackathon submission links to the demo video, repo, live MCP URL and agent id 9844.

### Days 2–7 — get integrators
- [ ] DM 15 builders from the Agents at Work cohort offering the rev-share integrator id.
- [ ] Ask Cryptorefills for a co-marketing retweet / "built on Cryptorefills" mention.
- [ ] Submit to x402 ecosystem listings and ERC-8004 agent directories.
- [ ] Apply to MiniPay's app discovery for the tagged checkout.
- [ ] Short "how to add airtime to your agent in 5 lines" post on dev.to / Mirror.

## Metrics (check weekly — Hermes Friday review)

| Metric | Week-1 target |
|---|---|
| Paid orders on Celo mainnet | 10 |
| Distinct paying wallets | 5 |
| Integrator ids routing orders | 2 |
| MCP installs (Smithery + npm downloads) | 50 |
| Launch thread impressions | 10k |

Pull orders/integrators from the store ledger (`/api/celo/orders/integrators/{id}`).

---

## Draft — X thread

1/ Agents can now top up a phone.
Airtime, data, gift cards and eSIMs in 180+ countries — one x402 call, paid in USD₮, USA₮ or USDC on @Celo. No account, no API key. 🧵

2/ How it works: POST an order → 402 with the price → sign a stablecoin payment → delivered. The buyer never needs CELO for gas.

3/ Built for the people who actually use MiniPay. Wallets that can't sign x402 get a tagged checkout with gas paid in stablecoin.

4/ Got USA₮ from the Self × Google Cloud faucet? Spend it on data.

5/ For agents: an MCP server with list_brands, get_quote, buy_product. Add `https://store.hfsp.cloud/mcp` to Claude or any MCP client.

6/ For builders: route orders under your ERC-8004 id and earn a share of every order.

7/ Open source, fulfilled by @cryptorefills, built for Celo Agents at Work.
github.com/lpsmurf/celo-agent-commerce

## Draft — Celo forum / Discord showcase

**Celo Agent Commerce — airtime, data, gift cards and eSIMs over x402**

We built payment rails so any agent, bot or MiniPay app can buy real-world goods with Celo stablecoins in one request.

- Live on mainnet: `https://store.hfsp.cloud` · MCP: `https://store.hfsp.cloud/mcp`
- Pay in USD₮, USA₮ or USDC; no CELO needed for gas
- Tagged checkout (ERC-8021) for MiniPay/Valora
- ERC-8004 agent id 9844; integrators earn revenue share

Looking for: MiniPay app builders and agent builders who want to add top-ups. Reply or reach us at info@hfsp.xyz.

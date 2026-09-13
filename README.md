# Celo Agent Commerce

x402 payment rails on Celo for the things people in MiniPay markets already buy — mobile airtime, data bundles, gift cards and eSIMs — callable by any agent, bot or app with one HTTP request.

> Built for the [Celo Agents at Work Hackathon](https://celoplatform.notion.site/Agents-at-Work-Hackathon-3c1d5cb803de81139de7f4f3d09e55dc) (28 Aug – 21 Sep 2026). **Work in progress** — this repository is being built in the open during the hackathon window.

## What it does

- **Pay per order over x402** — `POST` an order, receive a `402` with the price, sign, get the top-up. Settles through Celo's hosted facilitator in USD₮, USA₮ or USDC. The buyer needs no CELO.
- **Tagged checkout for wallets that can't sign x402** — a web checkout that builds a normal stablecoin transfer carrying an ERC-8021 attribution tag.
- **Integrator revenue share** — apps and agents that route orders under their ERC-8004 agent id earn a share of order value, counted only for independent buyers.
- **Self-verified pricing** — verified humans (Self) get better first-order pricing, once per person rather than once per wallet.
- **Security layer** — endpoints are checked by an x402 security audit API before integrators are listed.

## Coverage (via upstream catalog)

Nigeria (MTN, Airtel, Glo, 9mobile) · Kenya (Safaricom, Airtel) · Ghana (MTN, Glo) · Philippines (Globe, Smart) · Brazil (Claro, Vivo, TIM) — plus gift cards and eSIMs.

## Stack

- x402 V2 (`@x402/*`), `exact` scheme, Celo mainnet `eip155:42220`
- Celo hosted facilitator — `api.x402.celo.org`
- ERC-8004 Identity Registry (Celo) · Self Agent ID · ERC-8021 attribution tags

## Status

- [x] Celo networks, assets and facilitator routing
- [x] Paid request settled end-to-end on Celo Sepolia
- [x] ERC-8004 registration flow (Sepolia)
- [ ] Mainnet agent registration
- [ ] Order fulfilment and tagged checkout
- [ ] Integrator ledger and revenue share
- [ ] Self-verified pricing

## Security

Never commit keys. `.env` files are ignored; see `.env.example` once services land.

## Contact

HFSP Labs · [info@hfsp.xyz](mailto:info@hfsp.xyz)

## License

MIT

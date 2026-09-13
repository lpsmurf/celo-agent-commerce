# Security

## Reporting

Email **info@hfsp.xyz** with steps to reproduce. Please do not open a public issue for a vulnerability that could expose funds or customer data. We aim to acknowledge within a few days.

## How the payment path is protected

- **On-chain verification.** A checkout payment is accepted only after its transaction is confirmed, is a transfer of the quoted token, carries this order's attribution code, and moved at least the quoted amount to the store wallet — read from the token's own `Transfer` event, never from calldata. One transaction pays one order, once.
- **Supplier 402 attestation.** Cryptorefills mints a fresh deposit wallet per session, so `payTo` cannot be allowlisted. The gateway signs every 402 (`X-Payment-Required-Signature`, JWS/ES256). The store verifies that signature — issuer, expiry, session, the exact `PAYMENT-REQUIRED` bytes, `payTo` and network — before it signs any payment, and fails closed.
- **Settle before deliver.** Paid orders settle up front (x402 `upfront` flow); an order that cannot be fulfilled is recorded for reconciliation and never retried automatically, so a product is never bought twice.
- **No secret passthrough.** Voucher codes, PINs and buyer contact details from the supplier are never returned by a status endpoint — order ids appear in logs and on-chain calldata, so treating them as bearer tokens would leak the goods. Codes are delivered to the buyer by email only.
- **Rate limiting.** Quote, confirm and status endpoints are rate-limited per client. The client key is a salted hash of the IP, held in memory; the store keeps no request logs.

## Secrets

Operator keys and facilitator credentials live only in `.env` files, which are gitignored. Never commit a real key; `*.env.example` files show the shape with placeholders.

## Related

We also run a static + dynamic x402 audit that checks for these classes (payment bypass, replay, CORS, exposed secrets, and upstream-response passthrough). Findings that led to hardening here are tracked in commit history.

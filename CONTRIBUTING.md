# Contributing

Thanks for looking. This is a small, focused workspace: shared x402 base, the store, and the MCP server.

## Setup

```bash
npm install
npm run build
npm test          # x402-common + store unit tests, no network or keys needed
npm run typecheck
```

Node 20+. The repo is npm workspaces; run a package's script with `-w <name>` (`x402-store-backend`, `celo-commerce-mcp`, `@hfsp/x402-common`).

## Conventions

- **TypeScript, ESM.** Match the surrounding style; keep comments about *why*, not *what*.
- **Pure where it counts.** Payment verification, wire-format adapters and money math live in dependency-free modules with unit tests. Add tests there rather than reaching for a live endpoint.
- **Never weaken payment checks** without a test that shows the new rule still rejects what it should. See [SECURITY.md](SECURITY.md).
- **No secrets in commits.** `.env` is gitignored; use `*.env.example`.

## Pull requests

Keep them scoped and describe the change and how you verified it. CI runs build + tests on every PR.

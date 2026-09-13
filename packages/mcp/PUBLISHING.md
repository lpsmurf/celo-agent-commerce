# Publishing this MCP server

Two directories, two paths. The **remote** (Streamable HTTP) listing works with no npm publish; the **npm package** listing needs the package on npm first.

## MCP Registry (server.json)

`server.json` declares both a remote (`https://store.hfsp.cloud/mcp`) and an npm package. Publish with the official CLI:

```bash
# from packages/mcp
npx @modelcontextprotocol/publisher@latest login github   # GitHub OIDC; you must own the io.github.lpsmurf/* namespace
npx @modelcontextprotocol/publisher@latest publish
```

If you keep the `packages` (npm) entry, publish the package to npm first so the registry can verify it:

```bash
npm publish --access public   # requires an npm account; package name: celo-commerce-mcp
```

To list the remote only (no npm), remove the `packages` array from `server.json` before publishing.

## Smithery (smithery.yaml)

Connect the GitHub repo at https://smithery.ai/new and point it at `packages/mcp`. Smithery builds the `Dockerfile` and reads `smithery.yaml` for the config schema. No secrets go in the listing — a buyer key, if any, is entered per-install.

## Sanity check before publishing

```bash
npm run build          # dist/index.js must exist
node dist/index.js     # stdio server should start and print the store URL
```

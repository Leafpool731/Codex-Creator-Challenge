# ShadeSeason

ShadeSeason is an image-free 16-season color analysis app built with Next.js,
TypeScript, Tailwind CSS, and JSON-backed seasonal data.

## Local Development

```bash
npm install
npm run dev
```

## Cloudflare Workers

This project is configured for Cloudflare Workers through the OpenNext
Cloudflare adapter.

```bash
npm run typecheck
npm run worker:build
npx wrangler deploy --dry-run
npm run preview
```

Deploy to Cloudflare Workers with:

```bash
npm run deploy
```

The Worker entrypoint is generated at `.open-next/worker.js`, and static assets
are generated into `.open-next/assets`. Both are build artifacts and are ignored
by Git.

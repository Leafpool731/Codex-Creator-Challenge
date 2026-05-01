# Chromi

## What it is

Chromi is a **browser-based 16-season color analysis studio**. You pick a
photorealistic portrait anchor, tune a **skin profile** (depth, undertone,
saturation, contrast), and run a **rule-based scoring engine** over JSON-backed
season definitions. There is **no photo upload** in the main flow: the model is
virtual, and your choices drive the analysis.

The app surfaces **top and alternate season matches**, **color palettes**,
makeup and jewelry notes, a **cosmetic reference grid**, and a **score breakdown**
so results stay explainable. Optional AI portrait tooling lives under
`src/experimental` and is separate from the core studio.

Stack: **Next.js**, **React**, **TypeScript**, **Tailwind CSS**.

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

`wrangler.jsonc` includes a custom build hook so `npx wrangler deploy` runs the
OpenNext build before uploading. In Cloudflare's hosted Workers Builds, you can
keep the deploy command as:

```bash
npx wrangler deploy
```

If you prefer explicit dashboard build settings, use:

```bash
# Build command
npm run worker:build

# Deploy command
npx wrangler deploy
```

or set the deploy command to:

```bash
npm run deploy
```

The Worker entrypoint is generated at `.open-next/worker.js`, and static assets
are generated into `.open-next/assets`. Both are build artifacts and are ignored
by Git.

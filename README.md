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

## SEO

Set **`NEXT_PUBLIC_SITE_URL`** to your canonical origin in production (for example `https://www.example.com`) so metadata, `sitemap.xml`, `robots.txt`, and JSON-LD use correct absolute URLs. Optional: **`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`** for the Google Search Console meta tag.

## Codex skills

This repository includes **Codex-style skill packages** under `skill-package/`.
Each pack is a folder with a `SKILL.md` (YAML frontmatter + instructions),
optional `references/` markdown, and optional `agents/` metadata for agent UIs.

| Skill id | Role |
| --- | --- |
| `shade-season-portrait-editor` | **Chromi Portrait Editor** — guardrails and workflows for realistic portrait overlays, masks, hair/eye/lip edits, undertone and lighting, cache-first AI portrait variants, and beauty-tech realism QA in this Next.js codebase. |

**Layout**

- `skill-package/shade-season-portrait-editor/SKILL.md` — skill definition and acceptance criteria.
- `skill-package/shade-season-portrait-editor/references/` — deep dives (e.g. `portrait-realism.md`, `ai-editing-cache.md`).
- `skill-package/shade-season-portrait-editor/agents/openai.yaml` — agent interface: `display_name`, `short_description`, and `default_prompt` (references the skill as `$shade-season-portrait-editor`).

The core Chromi studio stays image-free; **experimental** portrait and API code
that this skill is written for lives under `src/experimental/`. Install or wire
these packs according to your Codex / agent host’s skill documentation.

## Local Development

```bash
npm install
npm run dev
```

## Cloudflare Workers

This project is configured for Cloudflare Workers through the OpenNext
Cloudflare adapter.

**Hosted builds:** OpenNext does not yet support Next.js 16’s `proxy.ts`
convention (it is treated as Node middleware). This repo uses `middleware.ts`
with `next-intl` so `npm run worker:build` succeeds. You may see a Next.js
deprecation warning until OpenNext adds `proxy` support. The dynamic Open Graph
route must not set `runtime = "edge"`; the default Node handler is compatible
with the adapter.

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

# Chromi

## What it is

Chromi is a **browser-based 16-season color analysis studio**. You pick the
portrait closest to you, tune skin depth, undertone, olive cast, hair, eyes and
color clarity, and the portrait's skin is recolored **pixel by pixel** to match.
Results include a live **drape test** (best vs. avoid colors at the neckline),
**lipstick try-on**, a generated palette, makeup, metals and an axis breakdown.
There is **no photo upload**: everything runs in the browser.

### How it works

- **Analysis space** (`lib/profile.ts`, `lib/analysis.ts`): every season is a point
  in a continuous 4-axis space (temperature, value, chroma, contrast). The profile
  is projected into it (contrast is derived from hair/eye lightness vs. skin) and
  seasons are ranked by weighted distance. Confidence comes from the margin
  between #1 and #2.
- **Palettes** (`lib/palette.ts`): generated in OKLCH from season coordinates —
  hue between each color family's cool and warm pole, lightness from value,
  spread from contrast, chroma from clarity — then gamut-mapped by reducing chroma
  only.
- **Portrait renderer** (`lib/portrait/renderer.ts`): uses a per-model region mask
  (`public/masks/*.png`: R = skin, G = hair, B = lips). Skin is shifted in OKLab
  from the photo's measured mean to the target, preserving each pixel's deviation
  (texture, shading). Lips follow a lip model fitted to the nine portraits. Edges
  are refined by color (hairline unmixing, chroma-gated sclera/background).
  Drapes are fitted to the shoulder line found in the mask, with fold shading,
  a contact shadow and color bounce onto the neck.

### Product matching ("Shop your shades")

Products live in `data/products.json`. Each has one measured shade colour; a
product matches a season when its shade is close, in OKLab, to one of the season's
target lip / cheek / eye shades (`cosmeticsForSeason` in `lib/palette.ts`).
Matching is in `lib/products.ts`; ranking is by colour distance only.

```json
{
  "id": "brand-product-shade",
  "category": "lips",
  "brand": "Brand",
  "name": "Product name",
  "shade": "Shade name",
  "hex": "#b4505f",
  "finish": "satin",
  "retailer": "Sephora",
  "url": "https://your-affiliate-link"
}
```

Add a product by measuring its swatch image (median of the centre region):

```bash
node scripts/add-product.mjs swatch.png --category lips --brand "Brand" --name "Product" --shade "Shade" --retailer "Sephora" --url "https://..." --write
```

or pass `--hex "#aabbcc"` instead of an image. Without `--write` it only prints.
The shipped entries marked `"sample": true` are placeholders spread across the
shade space; remove them when real products are in:

```bash
node -e "const f='data/products.json',fs=require('fs');fs.writeFileSync(f,JSON.stringify(JSON.parse(fs.readFileSync(f)).filter(p=>!p.sample),null,2)+'\n')"
```

Product links open with `rel="sponsored"`, and the results page carries an
affiliate disclosure.

### Validating against professional analysts

The season model is tuned to be consistent, not yet proven against real
analyses. To measure agreement, have people who've had a professional analysis
set up their profile in the studio, copy the URL, and record it in a CSV next to
the season they were given (`scripts/validation-template.csv`):

```bash
npm run validate -- results.csv
```

It reports exact, top-3 and same-family agreement and the most common
disagreements (12-season names like "Deep Winter" or "Clear Spring" are mapped).
Use those to recalibrate `data/seasons.json` coordinates and the weights in
`lib/analysis.ts`. Until then, results are shown as fit labels, not percentages.

### Regenerating masks

Masks come from MediaPipe's selfie multiclass segmenter plus face/iris landmarks,
via `scripts/mask-generator/index.html`. To add a model: put the photo in
`public/models/`, serve the generator page from the dev server alongside a small
dev-only POST endpoint that writes `public/masks/<id>.png`, run it, then add the
model to `portraitModels` in `lib/profile.ts` with its measured mean skin color.

Optional AI portrait tooling lives under `src/experimental` (excluded from the
build). It still imports the previous studio modules, which were removed, and
needs updating before it can be used again.

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

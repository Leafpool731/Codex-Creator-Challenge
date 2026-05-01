---
name: shade-season-portrait-editor
description: Maintain and improve the Chromi app's realistic image-based portrait customization system. Use when working on portrait overlays, feature masks, hair recoloring, eye recoloring, lip tint alignment, blush, freckles, undertone handling, AI portrait editing prompts, cache-first generated portrait variants, or beauty-tech realism QA in the Chromi Next.js codebase.
---

# Chromi Portrait Editor

## Core Rule

Preserve Chromi as a premium, image-free beauty-tech app built around realistic portrait images. Do not replace the portrait with cartoon, emoji, toy, primitive geometry, or procedural face drawing. If no high-quality generated/edited portrait exists, use subtle masked overlays on the real portrait image as an optimistic preview.

## Workflow

1. Inspect the current portrait component, model state, and mask config before editing.
2. Keep all model-specific coordinates in a feature mask config such as `components/portrait/featureMasks.ts`.
3. Apply feature edits through region-specific masked layers or cached AI-edited images.
4. Verify that hair and eye changes never tint the full portrait.
5. Run typecheck/build and, for deploy-sensitive work, the Cloudflare Worker dry-run.
6. For visual changes, inspect the local preview or screenshot before finalizing when possible.

## Non-Negotiables

- Do not use cartoon/procedural faces.
- Do not use a global image tint/filter for `hairColor` or `eyeColor`.
- Eye recoloring must target only the iris regions.
- Hair recoloring must target only hair masks.
- Lip tint must stay on the lips, not below the mouth.
- Freckles must be seeded, organic dots. Never use tiled/grid/matrix freckle patterns.
- Debug masks must default to off and must never render filled dots on the face.
- Lighting must enhance the portrait photographically, not reshape the face with harsh bands.
- Use AI editing when CSS/SVG overlays look fake, but keep the UX cache-first and instant-feeling.

## Portrait Overlay Guidance

Use the existing image as the source of realism. Overlays should be subtle enough that the underlying skin texture, pupils, lip shape, and hair texture still carry the result.

Prefer:

- `mix-blend-mode: color`, `soft-light`, `multiply`, or `overlay` only where visually justified.
- Elliptical/radial masks for facial regions.
- Seeded deterministic random generation for skin details.
- Debug outlines for alignment, not opaque debug fills.

Avoid:

- Full-screen feature overlays except skin tone, undertone, and lighting.
- Artificial pupil/catchlight dots. Preserve the photo's original pupils and catchlights.
- Repeated gradient tiling for freckles.
- Strong vertical or horizontal lighting bands across the face.

For detailed placement and realism rules, read `references/portrait-realism.md`.

## AI Editing Guidance

Use AI-edited images when a feature needs realism beyond CSS masks, especially for hair recoloring, eye recoloring, or multi-feature combinations. Avoid repeatedly editing an already edited image unless a composite cache key represents that final combination.

Required request order:

1. Static generated file lookup in `/public/generated/{modelId}/{editType}/{valueSlug}.png`.
2. Server memory cache by deterministic cache key.
3. Persistent object storage if available.
4. Remote AI edit call.
5. Existing masked CSS preview fallback.

For cache keys, prompt patterns, pre-generation lists, and stale request handling, read `references/ai-editing-cache.md`.

## Acceptance Criteria

Every portrait change should satisfy:

- Realistic portrait image remains the visual base.
- Hair changes affect hair only.
- Eye changes affect irises only and align inside the iris.
- Lips, blush, and freckles sit on plausible anatomical regions.
- Freckles are uneven, clustered around the nose bridge and upper cheeks, and do not look placed.
- Olive undertone reads muted green-gold without making skin gray or muddy.
- Debug visuals are invisible by default.
- Cached/common AI edits feel instant.
- Unknown edits degrade gracefully to the optimistic masked preview.
- The result feels beauty-editorial, not drawn on.

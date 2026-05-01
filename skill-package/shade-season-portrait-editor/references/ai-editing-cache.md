# AI Editing And Cache Reference

## Cache Key

Use deterministic keys and intensity buckets:

```ts
const cacheKey = [
  modelId,
  baseImageVersion,
  editType,
  valueName,
  valueHex,
  intensityBucket,
  lightingPreset
].join(":");
```

Use buckets `0`, `25`, `50`, `75`, `100` instead of raw slider values.

## Lookup Order

Before calling AI:

1. Check `/public/generated/{modelId}/{editType}/{valueSlug}.png`.
2. Check server memory cache.
3. Check persistent storage if configured, such as Cloudflare R2, S3, Supabase Storage, or Vercel Blob.
4. Call the AI edit endpoint.
5. Fall back to the masked CSS preview if no generated result exists.

Never regenerate the same edit twice.

## Client UX

Make AI feel near-instant:

- Show the existing image immediately.
- Apply CSS/masked optimistic preview for the first 300-500ms.
- Debounce AI requests by 500-700ms.
- Abort previous requests when a user keeps dragging or switching swatches.
- Ignore stale responses that do not match the latest cache key.
- Show short status labels such as `Instant preview`, `AI refining`, `AI refined`, and `Cached`.

Preload likely next edits:

- Hair tab: black, espresso brown, chestnut, golden blonde.
- Eyes tab: brown, hazel, green, blue, gray.
- Results page: recommended lip/blush shades for the predicted season.

## Pre-Generation

Provide a dev/admin script for demo preparation. Do not run pre-generation in normal user flow.

Common demo variants:

- hair: black, espresso brown, chestnut, auburn, copper, golden blonde, ash blonde
- eyes: brown, hazel, green, blue, gray
- lips: nude rose, coral, berry, red, plum
- blush: 25, 50, 75
- freckles: 25, 50, 75

Save files to `/public/generated/{modelId}/{editType}/{valueSlug}.png`.

## Avoid Cumulative Drift

Prefer editing the base portrait or a canonical cached combination. Avoid repeatedly editing an already AI-edited portrait because facial identity and texture can drift. If multiple features are active and composition is needed, cache the final combination by its own deterministic key.

## Prompt Patterns

Hair:

```text
Photorealistically recolor only the hair to {valueName}. Preserve skin, eyes, lips, background, lighting, hair texture, and facial identity.
```

Eyes:

```text
Photorealistically recolor only the irises to {valueName}. Preserve pupils, catchlights, eyelids, skin, and facial identity.
```

Lips:

```text
Apply a realistic {valueName} lip tint only to the lips. Preserve skin, teeth, eyes, hair, background, and facial identity.
```

Blush:

```text
Add natural blush to both cheekbones at {intensityBucket}% intensity. Preserve all other facial features and identity.
```

Freckles:

```text
Add natural freckles across the nose bridge and upper cheeks at {intensityBucket}% intensity. Keep spacing uneven and organic. Preserve all other facial features and identity.
```

## Storage Abstraction

Hide persistence behind a module such as `lib/storage/portraitStorage.ts`. The app must work without write access to `/public`; Cloudflare deployments should prefer object storage such as R2 for generated outputs and keep static pre-generated variants bundled as assets.

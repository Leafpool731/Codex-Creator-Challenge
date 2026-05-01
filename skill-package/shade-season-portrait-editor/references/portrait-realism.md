# Portrait Realism Reference

## Feature Mask Calibration

Keep coordinates in a single exported config object. Store model-specific overrides there too if different portraits need different calibration.

Recommended baseline:

```ts
export const FEATURE_MASKS = {
  hair: { x: 50, y: 23, width: 58, height: 42 },
  leftIris: { x: 44.5, y: 39.5, width: 2.4, height: 2.2 },
  rightIris: { x: 55.5, y: 39.5, width: 2.4, height: 2.2 },
  lips: { x: 50, y: 58, width: 17, height: 4.5 },
  leftCheek: { x: 37, y: 49, width: 30, height: 14 },
  rightCheek: { x: 63, y: 49, width: 30, height: 14 },
  freckles: { x: 50, y: 46.5, width: 42, height: 18 }
};
```

Calibrate by opening the actual model image and checking alignment at the rendered aspect ratio. Do not guess from a different model.

## Hair Recoloring

Hair color must be masked to hair regions only. Use layered masks:

- main hair cap
- left side hair
- right side hair
- crown/highlight layer

Use `color` for hue replacement, `multiply` for dark shades, and `soft-light` or `screen` sparingly for lighter shades. Never use global CSS filters for hair color. If masks spill onto skin, reduce opacity and tighten the hair config before adding more effects.

## Eye Recoloring

Eye color must target only irises. Use two tiny elliptical masks. Do not draw artificial black pupils or white catchlights over the photo unless debugging is explicitly enabled; the real portrait already has these details. Use `mix-blend-mode: color` or `overlay`, with enough opacity for blue/green/gray to be visible while preserving natural eye texture.

## Lip Tint

Lip tint should sit around `x: 50%, y: 58%` for the current Chromi portrait set. Use a soft elliptical/radial mask, low opacity, and `multiply` or `soft-light`. If the tint appears below the mouth, move the mask up before changing blend modes.

## Blush

Blush should sit on cheekbones, not low on the jaw:

- left cheek: `x: 37%, y: 49%`
- right cheek: `x: 63%, y: 49%`
- opacity: `blush / 100 * 0.32`
- blur: about `24px`
- color: `rgba(210,105,95,1)`
- blend: `soft-light`

At 50%, it should be visible but natural. At 100%, flushed but not theatrical.

## Natural Freckles

Use `generateFreckles(seed, count)`. Freckles should cluster near `x: 50%, y: 46.5%`, with range `x: 35% to 65%`, `y: 40% to 52%`.

Each freckle should vary:

- size: `0.8px to 2.8px`
- opacity: `0.15 to 0.45`
- blur: `0px to 0.6px`
- color family: warm brown, neutral brown, deep brown

Use gaussian/random clustering with denser dots near the nose bridge. Do not use tiled backgrounds, equal spacing, CSS grids, or matrix-like dot patterns.

## Olive Undertone

Olive should read as muted green-gold or beige-olive. Avoid gray-green overlays that make skin ashy. Keep olive opacity lower than a dramatic makeup color; it should modify temperature, not paint the skin.

## Lighting

Lighting may cover the whole image, but it must look photographic. Prefer radial light overlays:

- Daylight: `radial-gradient(circle at 50% 20%, rgba(255,255,240,0.18), transparent 40%)`
- Warm: `radial-gradient(circle at 45% 25%, rgba(255,220,180,0.18), transparent 45%)`
- Cool: `radial-gradient(circle at 50% 20%, rgba(220,235,255,0.16), transparent 45%)`
- Soft: very subtle brightness only
- Evening: `radial-gradient(circle at center, transparent 60%, rgba(40,25,30,0.18) 100%)`

Avoid linear-gradient shadows across the face; they create fake vertical banding.

## Debug Masks

Debug masks must default to false. When enabled, use subtle outlines only. Never render iris center dots, anchor points, filled circles, or black debug markers on the face.

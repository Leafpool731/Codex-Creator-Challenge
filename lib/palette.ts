/**
 * Season palettes generated in OKLCH from each season's coordinates.
 *
 *  - Hue:       each colour family has a cool pole and a warm pole; the season's
 *               temperature picks the point between them (blue-red ↔ tomato red,
 *               fuchsia ↔ coral, lemon ↔ marigold, emerald ↔ leaf green …).
 *  - Lightness: centred on the season's value, spread wider for high-contrast seasons.
 *  - Chroma:    scaled by the season's clarity (dusty ↔ vivid).
 *
 * Colours are gamut-mapped by reducing chroma only, so every swatch keeps the hue and
 * lightness its season calls for. Because the rules are explicit, palettes stay
 * consistent across all 16 seasons rather than drifting with hand-picked hex values.
 */

import { clamp, gamutMapLch, lerp, lerpHue, oklchToHex } from "@/lib/color/oklab";
import type { Coordinates } from "@/lib/profile";
import { seasonStyle, styleForCoordinates, type Season, type SeasonStyle } from "@/lib/seasons";

export interface Swatch {
  name: string;
  hex: string;
  family: string;
}

type Names = [light: string, standard: string, bright: string, soft: string, deep: string];

interface ColourFamily {
  key: string;
  coolHue: number;
  warmHue: number;
  /** Lightness offset in units of the season's spread (+ lighter, − deeper). */
  lift: number;
  /** Relative chroma for this family. */
  chroma: number;
  cool: Names;
  warm: Names;
}

const styleIndex: Record<SeasonStyle, number> = { light: 0, true: 1, bright: 2, soft: 3, deep: 4 };

const families: ColourFamily[] = [
  {
    key: "red", coolHue: 16, warmHue: 36, lift: 0, chroma: 1,
    cool: ["Watermelon", "Blue Red", "Cherry", "Raspberry Rose", "Ruby"],
    warm: ["Melon", "Tomato Red", "Poppy", "Rosewood", "Paprika"]
  },
  {
    key: "pink", coolHue: 352, warmHue: 26, lift: 0.7, chroma: 0.85,
    cool: ["Sweet Pea", "Rose Pink", "Fuchsia", "Dusty Rose", "Magenta"],
    warm: ["Peach Pink", "Coral", "Hot Coral", "Salmon", "Deep Coral"]
  },
  {
    key: "accent", coolHue: 328, warmHue: 58, lift: 0.3, chroma: 0.85,
    cool: ["Orchid", "Mauve", "Hot Orchid", "Dusty Mauve", "Berry"],
    warm: ["Apricot", "Tangerine", "Clear Orange", "Terracotta", "Rust"]
  },
  {
    key: "yellow", coolHue: 104, warmHue: 84, lift: 1.1, chroma: 0.95,
    cool: ["Pale Lemon", "Lemon", "Lemon Zest", "Soft Lemon", "Citrine"],
    warm: ["Butter", "Sunflower", "Marigold", "Wheat", "Mustard"]
  },
  {
    key: "green", coolHue: 160, warmHue: 128, lift: -0.2, chroma: 0.9,
    cool: ["Seafoam", "Jade", "Emerald", "Sage", "Pine"],
    warm: ["Pistachio", "Leaf Green", "Kelly Green", "Moss", "Olive"]
  },
  {
    key: "teal", coolHue: 208, warmHue: 186, lift: -0.3, chroma: 0.85,
    cool: ["Aqua Mist", "Teal", "Peacock", "Grey Teal", "Deep Teal"],
    warm: ["Light Turquoise", "Turquoise", "Bright Turquoise", "Jade Teal", "Petrol"]
  },
  {
    key: "blue", coolHue: 263, warmHue: 240, lift: -0.4, chroma: 0.85,
    cool: ["Powder Blue", "Sapphire", "Cobalt", "Slate Blue", "Royal Blue"],
    warm: ["Cornflower", "Bluebird", "Clear Blue", "Denim", "Marine"]
  },
  {
    key: "purple", coolHue: 300, warmHue: 322, lift: -0.8, chroma: 0.8,
    cool: ["Lavender", "Amethyst", "Violet", "Heather", "Deep Purple"],
    warm: ["Lilac", "Warm Violet", "Purple Orchid", "Plum", "Aubergine"]
  },
  {
    key: "wine", coolHue: 4, warmHue: 40, lift: -1.5, chroma: 0.75,
    cool: ["Rose Wine", "Burgundy", "Crimson", "Mulberry", "Black Cherry"],
    warm: ["Cinnamon", "Brick", "Chili Red", "Spice", "Oxblood"]
  },
  {
    key: "dark", coolHue: 262, warmHue: 150, lift: -2.2, chroma: 0.45,
    cool: ["Soft Navy", "Navy", "Ink Navy", "Grey Navy", "Midnight"],
    warm: ["Soft Pine", "Forest", "Spruce", "Dark Olive", "Deep Forest"]
  },
  {
    key: "light", coolHue: 225, warmHue: 165, lift: 1.4, chroma: 0.55,
    cool: ["Powder Aqua", "Sky Blue", "Icy Blue", "Misty Blue", "Icy Blue"],
    warm: ["Mint", "Light Aqua", "Clear Aqua", "Celadon", "Celadon"]
  },
  {
    key: "blush", coolHue: 2, warmHue: 45, lift: 1.6, chroma: 0.5,
    cool: ["Ballet Pink", "Rose", "Icy Pink", "Powder Rose", "Rose Taupe"],
    warm: ["Peach Cream", "Peach", "Clear Peach", "Soft Peach", "Camel Rose"]
  }
];

interface Frame {
  t: number;
  base: number;
  spread: number;
  chroma: number;
  style: SeasonStyle;
  warm: boolean;
  icy: boolean;
}

function frameFor(c: Coordinates, style: SeasonStyle): Frame {
  return {
    t: (c.temperature + 1) / 2,
    base: 0.84 - 0.38 * c.value,
    spread: 0.06 + 0.13 * c.contrast,
    chroma: 0.035 + 0.175 * c.chroma,
    style,
    warm: c.temperature > 0,
    // Winters (cool, clear, high-contrast) wear "icy" near-whites instead of pastels.
    icy: c.temperature < 0 && c.chroma > 0.55 && c.contrast > 0.7
  };
}

function familySwatch(f: ColourFamily, fr: Frame): Swatch {
  const h = lerpHue(f.coolHue, f.warmHue, fr.t);
  let L = clamp(fr.base + f.lift * fr.spread, 0.24, 0.93);
  let C = fr.chroma * f.chroma;

  if (f.key === "accent") {
    // Warm seasons get orange-family accents, cool seasons orchid/mauve.
    const hue = fr.warm ? lerp(48, 62, fr.t) : 328;
    return make(f, fr, { L, C, h: hue });
  }
  if (f.key === "yellow") {
    // Yellow only reads as yellow when light: cool seasons get clear lemon,
    // warm seasons may go down to golden mustard.
    L = Math.max(L, fr.warm ? 0.72 : 0.86);
  }
  if (f.key === "light" && fr.icy) {
    L = 0.94;
    C = 0.045;
  }
  if (f.key === "blush" && fr.icy) {
    L = 0.93;
    C = 0.04;
  }
  return make(f, fr, { L, C, h });
}

function make(f: ColourFamily, fr: Frame, lch: { L: number; C: number; h: number }): Swatch {
  const names = fr.warm ? f.warm : f.cool;
  return { family: f.key, name: names[styleIndex[fr.style]], hex: oklchToHex(gamutMapLch(lch)) };
}

function neutrals(c: Coordinates, fr: Frame): Swatch[] {
  const hue = (warmHue: number, coolHue: number) => lerpHue(coolHue, warmHue, fr.t);
  const crisp = fr.icy || (c.contrast > 0.8 && c.chroma > 0.8);

  const light = crisp
    ? { name: "Optic White", hex: oklchToHex({ L: 0.985, C: 0.003, h: 250 }) }
    : fr.warm
      ? { name: c.value > 0.55 ? "Cream" : "Ivory", hex: oklchToHex({ L: 0.95 - 0.04 * c.value, C: 0.03, h: 88 }) }
      : { name: "Soft White", hex: oklchToHex({ L: 0.95 - 0.03 * c.value, C: 0.008, h: 250 }) };

  const midL = clamp(fr.base + 0.02, 0.5, 0.78);
  const mid = fr.warm
    ? { name: c.chroma < 0.2 ? "Stone" : "Camel", hex: oklchToHex({ L: midL, C: 0.03 + 0.04 * c.chroma, h: 72 }) }
    : { name: c.chroma < 0.2 ? "Rose Taupe" : "Cool Grey", hex: oklchToHex({ L: midL, C: c.chroma < 0.2 ? 0.02 : 0.01, h: hue(40, 260) }) };

  const darkL = clamp(fr.base - 0.24, 0.3, 0.55);
  const dark = fr.warm
    ? { name: "Coffee", hex: oklchToHex({ L: darkL, C: 0.045, h: 55 }) }
    : { name: c.chroma < 0.4 ? "Cocoa" : "Slate", hex: oklchToHex({ L: darkL, C: c.chroma < 0.4 ? 0.025 : 0.02, h: c.chroma < 0.4 ? 30 : 255 }) };

  const deepestL = clamp(0.5 - 0.32 * c.value - 0.1 * c.contrast, 0.17, 0.46);
  const deepest = fr.warm
    ? { name: deepestL < 0.3 ? "Espresso" : "Chocolate", hex: oklchToHex({ L: deepestL, C: 0.035, h: 50 }) }
    : { name: deepestL < 0.24 ? "Black" : "Charcoal", hex: oklchToHex({ L: deepestL, C: 0.006, h: 260 }) };

  return [light, mid, dark, deepest].map((s) => ({ ...s, family: "neutral" }));
}

export interface SeasonPalette {
  colours: Swatch[];
  neutrals: Swatch[];
  /** Subset that reads best as a full drape near the face. */
  drapes: Swatch[];
}

const cache = new Map<string, SeasonPalette>();

export function paletteForSeason(season: Season): SeasonPalette {
  const hit = cache.get(season.id);
  if (hit) return hit;
  const fr = frameFor(season.coordinates, seasonStyle(season));
  const colours = families.map((f) => familySwatch(f, fr));
  const palette: SeasonPalette = {
    colours,
    neutrals: neutrals(season.coordinates, fr),
    drapes: ["red", "pink", "teal", "blue", "green", "purple", "accent", "dark"]
      .map((k) => colours.find((c) => c.family === k))
      .filter((c): c is Swatch => Boolean(c))
  };
  cache.set(season.id, palette);
  return palette;
}

/** Colours from the opposite corner of the colour space — the clearest "avoid" contrast. */
export function avoidPalette(season: Season): Swatch[] {
  const c = season.coordinates;
  const opposite: Coordinates = {
    temperature: -c.temperature,
    value: 1 - c.value,
    chroma: 1 - c.chroma,
    contrast: 1 - c.contrast
  };
  const fr = frameFor(opposite, styleForCoordinates(opposite));
  return ["red", "pink", "accent", "green", "blue", "purple"].map((k) =>
    familySwatch(families.find((f) => f.key === k) as ColourFamily, fr)
  );
}

/* ------------------------------------------------------------------ */
/* Cosmetics                                                          */
/* ------------------------------------------------------------------ */

export interface CosmeticSet {
  lips: Swatch[];
  cheeks: Swatch[];
  eyes: Swatch[];
}

export function cosmeticsForSeason(season: Season): CosmeticSet {
  const c = season.coordinates;
  const t = (c.temperature + 1) / 2;
  const warm = c.temperature > 0;
  const C = 0.06 + 0.13 * c.chroma;
  const lipBase = 0.7 - 0.28 * c.value;
  const swatch = (name: string, family: string, L: number, chroma: number, h: number): Swatch => ({
    name,
    family,
    hex: oklchToHex(gamutMapLch({ L: clamp(L, 0.25, 0.92), C: chroma, h }))
  });

  return {
    lips: [
      swatch(warm ? "Peach Nude" : "Rose Nude", "nude", lipBase + 0.08, C * 0.55, lerpHue(10, 50, t)),
      swatch(warm ? "Coral" : "Pink", "pink", lipBase + 0.04, C * 0.95, lerpHue(355, 32, t)),
      swatch(warm ? "Warm Red" : "Blue Red", "red", lipBase - 0.06, C * 1.15, lerpHue(16, 36, t)),
      swatch(warm ? "Terracotta" : "Berry", "berry", lipBase - 0.1, C * 0.85, lerpHue(355, 42, t)),
      swatch(warm ? "Brick" : "Wine", "deep", lipBase - 0.2, C * 0.75, lerpHue(5, 38, t))
    ],
    cheeks: [
      swatch(warm ? "Peach" : "Petal", "blush", lipBase + 0.14, C * 0.6, lerpHue(8, 50, t)),
      swatch(warm ? "Apricot" : "Rose", "blush", lipBase + 0.08, C * 0.7, lerpHue(0, 42, t)),
      swatch(warm ? "Bronze" : "Plum", "blush", lipBase - 0.02, C * 0.55, lerpHue(340, 55, t))
    ],
    eyes: [
      swatch("Highlight", "eye", 0.9 - 0.06 * c.value, 0.02 + 0.03 * c.chroma, lerpHue(250, 85, t)),
      swatch(warm ? "Bronze" : "Taupe", "eye", lipBase + 0.02, 0.03 + 0.04 * c.chroma, lerpHue(30, 65, t)),
      swatch(warm ? "Olive" : "Slate", "eye", lipBase - 0.1, 0.03 + 0.05 * c.chroma, lerpHue(255, 115, t)),
      swatch(warm ? "Brown Liner" : "Charcoal Liner", "eye", 0.3 - 0.06 * c.contrast, 0.02, lerpHue(260, 55, t)),
      swatch(warm ? "Teal Accent" : "Plum Accent", "eye", lipBase - 0.05, C * 0.7, lerpHue(320, 190, t))
    ]
  };
}

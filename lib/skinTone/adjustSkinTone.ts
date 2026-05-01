/**
 * Constrained skin-tone mixing in OKLab / OKLCH space.
 * Subtle shifts only — avoids neon, corpse-gray, orange, or green "skin".
 */

export interface SkinToneAdjustments {
  /** -50 rosy / flush … +50 cool blue (not literal blue skin) */
  rosyBlue: number;
  /** -50 golden warmth … +50 muted olive (no cartoon green) */
  goldenOlive: number;
  /** -50 softer / lower chroma … +50 clearer (not a saturation spike) */
  mutedClear: number;
  /** -50 slightly darker … +50 slightly lighter (OKLCH L only) */
  depth: number;
}

interface Rgb {
  r: number;
  g: number;
  b: number;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function clampAxis(n: number): number {
  return clamp(n, -50, 50);
}

function hexToLinearSrgb(hex: string): Rgb {
  const clean = hex.replace("#", "").trim();
  const n =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const toLin = (u: number) => {
    const x = u / 255;
    return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  };
  return {
    r: toLin(Number.parseInt(n.slice(0, 2), 16)),
    g: toLin(Number.parseInt(n.slice(2, 4), 16)),
    b: toLin(Number.parseInt(n.slice(4, 6), 16))
  };
}

function linearSrgbToHex(rgb: Rgb): string {
  const toSrgb = (v: number) => {
    const x = clamp(v, 0, 1);
    const u = x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;
    return Math.round(u * 255)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${toSrgb(rgb.r)}${toSrgb(rgb.g)}${toSrgb(rgb.b)}`;
}

/** Linear sRGB 0–1 → OKLab (L ~ 0–1, a/b small) */
function linearSrgbToOklab({ r, g, b }: Rgb): { L: number; a: number; b: number } {
  const l_ = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m_ = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s_ = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return {
    L: 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_
  };
}

function oklabToLinearSrgb(L: number, a: number, b: number): Rgb {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;
  return {
    r: +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
  };
}

function oklabToOklch(L: number, a: number, b: number): { l: number; c: number; h: number } {
  const c = Math.sqrt(a * a + b * b);
  const h = Math.atan2(b, a);
  return { l: L, c, h };
}

function oklchToOklab(l: number, c: number, h: number): { L: number; a: number; b: number } {
  return { L: l, a: Math.cos(h) * c, b: Math.sin(h) * c };
}

/** Skin-typical max chroma decreases toward very light / very dark */
function maxChromaForL(L: number): number {
  const t = clamp((L - 0.58) / 0.22, -1, 1);
  return 0.065 + (1 - t * t) * 0.055;
}

function sanitizeSkinRgb(rgb: Rgb): Rgb {
  let { r, g, b } = rgb;
  r = clamp(r, 0, 1);
  g = clamp(g, 0, 1);
  b = clamp(b, 0, 1);
  // Block corpse / neon blue
  if (b > r * 1.12 && b > g * 1.08) {
    const t = 0.35;
    b = r * (1 - t) + b * t;
  }
  // Block cartoon green
  if (g > r * 1.1 && g > b * 1.06) {
    g = (r + b) * 0.5 + g * 0.35;
  }
  // Block harsh orange
  if (r > g * 1.35 && r > b * 1.35) {
    r = g * 1.12;
  }
  // Avoid flat gray
  const minC = 0.018;
  const maxc = Math.max(r, g, b) - Math.min(r, g, b);
  if (maxc < minC) {
    const lift = minC - maxc;
    r += lift * 0.55;
    g += lift * 0.35;
    b += lift * 0.25;
  }
  return { r: clamp(r, 0, 1), g: clamp(g, 0, 1), b: clamp(b, 0, 1) };
}

/**
 * Starts from matrix base hex, applies small OKLCH/OKLab offsets, clamps to believable skin.
 */
export function adjustSkinTone(baseHex: string, raw: SkinToneAdjustments): string {
  const rosyBlue = clampAxis(raw.rosyBlue) / 50;
  const goldenOlive = clampAxis(raw.goldenOlive) / 50;
  const mutedClear = clampAxis(raw.mutedClear) / 50;
  const depth = clampAxis(raw.depth) / 50;

  let { L, a, b } = linearSrgbToOklab(hexToLinearSrgb(baseHex));

  // Rosy (negative rosyBlue): slightly more red in a; blue side: cool without painting blue
  a -= rosyBlue * 0.024;
  b -= rosyBlue * 0.014;

  // Golden (negative goldenOlive): warmer yellow; olive (positive): tiny green-gray, lower red
  b -= goldenOlive * 0.022;
  a -= goldenOlive * 0.016;
  L -= goldenOlive * 0.008;

  let { l, c, h } = oklabToOklch(L, a, b);

  // Muted / clear on chroma (not HSL saturation bomb)
  const cFactor = mutedClear <= 0 ? 1 + mutedClear * 0.22 : 1 + mutedClear * 0.11;
  c *= cFactor;
  const cMax = maxChromaForL(l);
  c = clamp(c, 0, cMax);

  // Fine luminosity (preserve general level unless user moves depth)
  l += depth * 0.042;
  l = clamp(l, 0.5, 0.94);

  const o = oklchToOklab(l, c, h);
  const rgb = sanitizeSkinRgb(oklabToLinearSrgb(o.L, o.a, o.b));
  return linearSrgbToHex(rgb);
}

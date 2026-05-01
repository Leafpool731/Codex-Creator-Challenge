/**
 * Realistic skin depth: interpolate real skin anchors in OKLab (no HSL graying / black multiply).
 */

import type { Undertone } from "@/components/portrait/featureMasks";

export interface RealisticSkinToneParams {
  baseToneHex: string;
  /** Studio slider 0 (fair) … 100 (dark) */
  depthValue: number;
  undertone: Undertone;
  /** Reserved for parity with studio API; fine tuning is applied in `adjustSkinTone` after this step. */
  rosyBlue?: number;
  goldenOlive?: number;
  mutedClear?: number;
}

interface Rgb {
  r: number;
  g: number;
  b: number;
}

interface Oklab {
  L: number;
  a: number;
  b: number;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
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

function linearSrgbToOklab({ r, g, b }: Rgb): Oklab {
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

function oklchToOklab(l: number, c: number, h: number): Oklab {
  return { L: l, a: Math.cos(h) * c, b: Math.sin(h) * c };
}

function lerpOklab(p0: Oklab, p1: Oklab, t: number): Oklab {
  const u = clamp(t, 0, 1);
  return {
    L: p0.L + (p1.L - p0.L) * u,
    a: p0.a + (p1.a - p0.a) * u,
    b: p0.b + (p1.b - p0.b) * u
  };
}

function mixLinearRgb(a: Rgb, b: Rgb, t: number): Rgb {
  const u = clamp(t, 0, 1);
  return {
    r: a.r + (b.r - a.r) * u,
    g: a.g + (b.g - a.g) * u,
    b: a.b + (b.b - a.b) * u
  };
}

function sanitizeSkinRgb(rgb: Rgb): Rgb {
  let { r, g, b } = rgb;
  r = clamp(r, 0, 1);
  g = clamp(g, 0, 1);
  b = clamp(b, 0, 1);
  if (b > r * 1.12 && b > g * 1.08) {
    b = r * 0.65 + b * 0.35;
  }
  if (g > r * 1.1 && g > b * 1.06) {
    g = (r + b) * 0.52 + g * 0.32;
  }
  if (r > g * 1.38 && r > b * 1.38) {
    r = g * 1.08 + r * 0.08;
  }
  const spread = Math.max(r, g, b) - Math.min(r, g, b);
  if (spread < 0.02) {
    r += 0.012;
    g += 0.006;
  }
  return { r: clamp(r, 0, 1), g: clamp(g, 0, 1), b: clamp(b, 0, 1) };
}

/** Seasonal-style depth ramp: porcelain → … → rich deep (includes olive stop). */
const SKIN_DEPTH_CHAIN = [
  "#FFF0E8",
  "#FFD6B2",
  "#E8B895",
  "#D0A582",
  "#938070",
  "#7D5939",
  "#442708",
  "#2A1508"
] as const;

const OLIVE_ANCHOR = "#8A7B68";

function hexToOklab(hex: string): Oklab {
  return linearSrgbToOklab(hexToLinearSrgb(hex));
}

function oklabToHex(L: number, a: number, b: number): string {
  return linearSrgbToHex(sanitizeSkinRgb(oklabToLinearSrgb(L, a, b)));
}

function interpolateDepthChain(depthValue: number): string {
  const d = clamp(depthValue, 0, 100);
  const n = SKIN_DEPTH_CHAIN.length;
  const u = (d / 100) * (n - 1);
  const i = Math.min(Math.floor(u), n - 2);
  const f = u - i;
  const o0 = hexToOklab(SKIN_DEPTH_CHAIN[i]);
  const o1 = hexToOklab(SKIN_DEPTH_CHAIN[i + 1]);
  const mixed = lerpOklab(o0, o1, f);
  return oklabToHex(mixed.L, mixed.a, mixed.b);
}

function blendWithBaseTone(interpolatedHex: string, baseToneHex: string, weight: number): string {
  const t = clamp(weight, 0, 0.45);
  const a = hexToLinearSrgb(interpolatedHex);
  const b = hexToLinearSrgb(baseToneHex);
  return linearSrgbToHex(sanitizeSkinRgb(mixLinearRgb(a, b, t)));
}

function undertoneCharacter(hex: string, undertone: Undertone): string {
  let { L, a, b } = hexToOklab(hex);

  if (undertone === "cool") {
    a += 0.007;
    b -= 0.005;
    if (a > 0.015 && b > 0.012) {
      b *= 0.88;
      a += 0.002;
    }
  } else if (undertone === "warm") {
    b += 0.012;
    a += 0.002;
    const { l, c, h } = oklabToOklch(L, a, b);
    const o = oklchToOklab(Math.min(l, 0.72), Math.max(c, 0.018), h);
    L = o.L;
    a = o.a;
    b = o.b;
  } else if (undertone === "olive") {
    const ol = hexToOklab(OLIVE_ANCHOR);
    const blend = lerpOklab({ L, a, b }, ol, 0.14);
    L = blend.L;
    a = blend.a * 0.96 + ol.a * 0.04;
    b = blend.b * 0.94 + ol.b * 0.06;
    const { l, c, h } = oklabToOklch(L, a, b);
    const o = oklchToOklab(l, c * 0.94, h);
    L = o.L;
    a = o.a;
    b = o.b;
  } else {
    a *= 0.985;
    b += 0.002;
  }

  if (L < 0.42 && undertone === "warm") {
    b += 0.006;
    const { l, c, h } = oklabToOklch(L, a, b);
    const o = oklchToOklab(l, Math.max(c, 0.022), h);
    L = o.L;
    a = o.a;
    b = o.b;
  }

  return oklabToHex(L, a, b);
}

/**
 * Maps skin depth through real skin hex anchors in OKLab, preserves undertone family,
 * blends in the selected matrix swatch, then subtle undertone character (no gray/mud).
 */
export function getRealisticSkinTone(params: RealisticSkinToneParams): string {
  const { baseToneHex, depthValue, undertone } = params;
  const interpolated = interpolateDepthChain(depthValue);
  const blended = blendWithBaseTone(interpolated, baseToneHex, 0.26);
  return undertoneCharacter(blended, undertone);
}

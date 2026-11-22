/**
 * OKLab / OKLCH colour math (Björn Ottosson, 2020) with sRGB gamut mapping.
 * One shared implementation for palettes, skin modelling and the portrait renderer.
 */

export interface Lab {
  L: number;
  a: number;
  b: number;
}

export interface Lch {
  L: number;
  C: number;
  /** Hue in degrees, 0–360 */
  h: number;
}

export type Rgb = [number, number, number];

export function clamp(value: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, value));
}

export function srgbToLinear(channel: number): number {
  const x = channel / 255;
  return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
}

export function linearToSrgb(value: number): number {
  const x = clamp(value);
  const u = x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;
  return Math.round(u * 255);
}

export function linearRgbToOklab(r: number, g: number, b: number): Lab {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return {
    L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  };
}

export function oklabToLinearRgb({ L, a, b }: Lab): Rgb {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
  ];
}

export function labToLch({ L, a, b }: Lab): Lch {
  const h = (Math.atan2(b, a) * 180) / Math.PI;
  return { L, C: Math.hypot(a, b), h: h < 0 ? h + 360 : h };
}

export function lchToLab({ L, C, h }: Lch): Lab {
  const rad = (h * Math.PI) / 180;
  return { L, a: Math.cos(rad) * C, b: Math.sin(rad) * C };
}

export function hexToRgb(hex: string): Rgb {
  const clean = hex.replace("#", "").trim();
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  return [
    Number.parseInt(full.slice(0, 2), 16),
    Number.parseInt(full.slice(2, 4), 16),
    Number.parseInt(full.slice(4, 6), 16)
  ];
}

export function rgbToHex([r, g, b]: Rgb): string {
  return `#${[r, g, b].map((v) => clamp(v, 0, 255).toString(16).padStart(2, "0")).join("")}`;
}

export function hexToOklab(hex: string): Lab {
  const [r, g, b] = hexToRgb(hex);
  return linearRgbToOklab(srgbToLinear(r), srgbToLinear(g), srgbToLinear(b));
}

export function hexToOklch(hex: string): Lch {
  return labToLch(hexToOklab(hex));
}

function inGamut([r, g, b]: Rgb, eps = 1e-4): boolean {
  return r >= -eps && r <= 1 + eps && g >= -eps && g <= 1 + eps && b >= -eps && b <= 1 + eps;
}

/**
 * Map an OKLCH colour into sRGB by reducing chroma at constant lightness and hue
 * (binary search), which keeps the colour's identity instead of clipping channels.
 */
export function gamutMapLch(lch: Lch): Lch {
  const L = clamp(lch.L);
  if (inGamut(oklabToLinearRgb(lchToLab({ ...lch, L })))) {
    return { ...lch, L };
  }
  let lo = 0;
  let hi = lch.C;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(oklabToLinearRgb(lchToLab({ L, C: mid, h: lch.h })))) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return { L, C: lo, h: lch.h };
}

export function oklchToHex(lch: Lch): string {
  const mapped = gamutMapLch(lch);
  const [r, g, b] = oklabToLinearRgb(lchToLab(mapped));
  return rgbToHex([linearToSrgb(r), linearToSrgb(g), linearToSrgb(b)]);
}

export function oklabToHex(lab: Lab): string {
  return oklchToHex(labToLch(lab));
}

/** WCAG relative luminance, for choosing legible text on swatches. */
export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map(srgbToLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function readableTextOn(hex: string): "#ffffff" | "#1c1917" {
  return relativeLuminance(hex) > 0.36 ? "#1c1917" : "#ffffff";
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Interpolate hue the short way round the wheel. */
export function lerpHue(a: number, b: number, t: number): number {
  const delta = ((((b - a) % 360) + 540) % 360) - 180;
  const h = a + delta * t;
  return ((h % 360) + 360) % 360;
}

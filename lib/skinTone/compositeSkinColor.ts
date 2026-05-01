import type { Undertone } from "@/components/portrait/featureMasks";
import {
  adjustSkinTone,
  type SkinToneAdjustments
} from "@/lib/skinTone/adjustSkinTone";

interface Rgb {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): Rgb {
  const clean = hex.replace("#", "").trim();
  const n =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  return {
    r: Number.parseInt(n.slice(0, 2), 16),
    g: Number.parseInt(n.slice(2, 4), 16),
    b: Number.parseInt(n.slice(4, 6), 16)
  };
}

function rgbToHex({ r, g, b }: Rgb): string {
  const clampChannel = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `#${[r, g, b].map((c) => clampChannel(c).toString(16).padStart(2, "0")).join("")}`;
}

function mixRgb(a: Rgb, b: Rgb, t: number): Rgb {
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t
  };
}

function rgbToHsl(rgb: Rgb): { h: number; s: number; l: number } {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) {
    return { h: 0, s: 0, l };
  }
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h, s, l };
}

function hslToRgb(h: number, s: number, l: number): Rgb {
  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255)
  };
}

/** Fine depth 0–100: slightly lightens or deepens without washing out. */
function adjustDepth(rgb: Rgb, depth: number): Rgb {
  const t = (depth - 50) / 100;
  const { h, s, l } = rgbToHsl(rgb);
  const nl = Math.max(0.08, Math.min(0.92, l - t * 0.12));
  return hslToRgb(h, s, nl);
}

/**
 * Undertone: not a flat wash — subtle directional shifts on the matrix hex.
 */
export function applyUndertoneShift(baseHex: string, undertone: Undertone): Rgb {
  const base = hexToRgb(baseHex);

  if (undertone === "cool") {
    const pinkBlue = { r: 232, g: 210, b: 228 };
    const pullYellow = mixRgb(base, { r: 220, g: 215, b: 235 }, 0.14);
    return mixRgb(pullYellow, pinkBlue, 0.08);
  }

  if (undertone === "warm") {
    const golden = { r: 255, g: 218, b: 185 };
    return mixRgb(base, golden, 0.12);
  }

  if (undertone === "olive") {
    const oliveGray = { r: 168, g: 172, b: 158 };
    const reduced = {
      r: base.r * 0.96,
      g: base.g * 1.02,
      b: base.b * 0.97
    };
    return mixRgb(mixRgb(reduced, oliveGray, 0.11), { r: 175, g: 178, b: 165 }, 0.06);
  }

  return base;
}

export function compositeSkinColor(
  baseHex: string,
  undertone: Undertone,
  depth: number,
  adjustments: SkinToneAdjustments
): string {
  let rgb = applyUndertoneShift(baseHex, undertone);
  rgb = adjustDepth(rgb, depth);
  const hexAfterDepth = rgbToHex(rgb);
  return adjustSkinTone(hexAfterDepth, adjustments);
}

/** Opacity for color blend: 0.4–0.75 from depth slider. */
export function skinToneLayerOpacity(depth: number): number {
  const t = Math.max(0, Math.min(100, depth)) / 100;
  return 0.4 + t * 0.35;
}

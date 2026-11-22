/**
 * Pixel-accurate portrait renderer.
 *
 * Each model photo ships with a region mask (scripts/mask-generator):
 *   R = skin (face, ears, neck, shoulders — eyes, brows and lips excluded)
 *   G = hair
 *   B = lips
 *
 * Skin is recoloured in OKLab by shifting the photo's measured mean skin colour to the
 * target while keeping every pixel's deviation from that mean — so pores, shadows and
 * highlights survive and the result reads as the same face with different colouring.
 *
 * Draping is drawn as a fabric cape fitted to the model's real shoulder line (found from
 * the mask), with fold shading, a contact shadow on the neck and a faint colour bounce onto
 * the skin above it — the effect that makes in-person draping work.
 */

import { hexToOklab, linearRgbToOklab, srgbToLinear, type Lab } from "@/lib/color/oklab";

export interface RenderParams {
  /** Mean skin colour of the photo (measured). */
  measuredSkin: Lab;
  /** Desired mean skin colour. */
  targetSkin: Lab;
  drapeHex?: string | null;
  lipHex?: string | null;
}

const SRGB_TO_LINEAR = new Float32Array(256).map((_, i) => srgbToLinear(i));
const LUT_SIZE = 4096;
const LINEAR_TO_SRGB = new Uint8ClampedArray(LUT_SIZE + 1).map((_, i) => {
  const x = i / LUT_SIZE;
  const u = x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;
  return Math.round(u * 255);
});

function toByte(v: number): number {
  if (v <= 0) return 0;
  if (v >= 1) return 255;
  return LINEAR_TO_SRGB[(v * LUT_SIZE) | 0];
}

function smoothstep(a: number, b: number, v: number): number {
  const t = Math.max(0, Math.min(1, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

function pixels(img: HTMLImageElement, w: number, h: number): Uint8ClampedArray {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("2D canvas unavailable");
  ctx.drawImage(img, 0, 0, w, h);
  return ctx.getImageData(0, 0, w, h).data;
}

export class PortraitRenderer {
  readonly width: number;
  readonly height: number;
  private readonly base: Uint8ClampedArray;
  /** Pixel indices touched by any effect. */
  private readonly idx: Uint32Array;
  private readonly L: Float32Array;
  private readonly A: Float32Array;
  private readonly B: Float32Array;
  private readonly skinW: Float32Array;
  private readonly lipW: Float32Array;
  private readonly drapeW: Float32Array;
  private readonly fold: Float32Array;
  private readonly shadow: Float32Array;
  private readonly bounce: Float32Array;
  private readonly lipMean: Lab;

  private constructor(img: HTMLImageElement, mask: HTMLImageElement) {
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    this.width = w;
    this.height = h;
    this.base = pixels(img, w, h);
    const m = pixels(mask, w, h);

    const drape = this.computeDrape(m, w, h);

    const touched: number[] = [];
    for (let p = 0, n = w * h; p < n; p++) {
      const q = p * 4;
      if (m[q] > 2 || m[q + 1] > 2 || m[q + 2] > 2 || drape.alpha[p] > 0.002) touched.push(p);
    }
    const count = touched.length;
    this.idx = Uint32Array.from(touched);
    this.L = new Float32Array(count);
    this.A = new Float32Array(count);
    this.B = new Float32Array(count);
    this.skinW = new Float32Array(count);
    this.lipW = new Float32Array(count);
    this.drapeW = new Float32Array(count);
    this.fold = new Float32Array(count);
    this.shadow = new Float32Array(count);
    this.bounce = new Float32Array(count);

    let lipSum = 0;
    let lipL = 0;
    let lipA = 0;
    let lipB = 0;
    let skinSum = 0;
    let skinL = 0;
    let skinA = 0;
    let skinB = 0;
    let hairSum = 0;
    let hairL = 0;
    for (let i = 0; i < count; i++) {
      const p = this.idx[i];
      const q = p * 4;
      const lab = linearRgbToOklab(
        SRGB_TO_LINEAR[this.base[q]],
        SRGB_TO_LINEAR[this.base[q + 1]],
        SRGB_TO_LINEAR[this.base[q + 2]]
      );
      this.L[i] = lab.L;
      this.A[i] = lab.a;
      this.B[i] = lab.b;
      this.skinW[i] = m[q] / 255;
      const lw = m[q + 2] / 255;
      this.lipW[i] = lw;
      if (lw > 0.8) {
        lipSum++;
        lipL += lab.L;
        lipA += lab.a;
        lipB += lab.b;
      }
      this.drapeW[i] = drape.alpha[p];
      this.fold[i] = drape.fold[p];
      this.shadow[i] = drape.shadow[p];
      this.bounce[i] = drape.bounce[p];
      if (this.skinW[i] > 0.95) {
        skinSum++;
        skinL += lab.L;
        skinA += lab.a;
        skinB += lab.b;
      }
      if (m[q + 1] > 245) {
        hairSum++;
        hairL += lab.L;
      }
    }
    this.lipMean = lipSum
      ? { L: lipL / lipSum, a: lipA / lipSum, b: lipB / lipSum }
      : { L: 0.6, a: 0.08, b: 0.03 };

    // Colour-aware edge refinement. The segmenter's skin confidence is soft at the hairline
    // and jaw, and the eye cut-out feathers over the lid margin; pixels in those bands that
    // look like this face's skin are recoloured fully, so no pale halo survives.
    // Background and sclera are near-neutral (low chroma), so the chroma gate protects them;
    // hair and irises are far from the skin mean in OKLab.
    if (skinSum) {
      const sL = skinL / skinSum;
      const sA = skinA / skinSum;
      const sB = skinB / skinSum;
      const hL = hairSum ? hairL / hairSum : 0.3;
      for (let i = 0; i < count; i++) {
        const w0 = this.skinW[i];
        if (w0 >= 0.98 || this.lipW[i] > 0) continue;
        const dE = Math.hypot((this.L[i] - sL) * 0.8, this.A[i] - sA, this.B[i] - sB);
        const chromaGate = smoothstep(0.022, 0.045, Math.hypot(this.A[i], this.B[i]));
        const likeness = Math.exp(-((dE / 0.08) ** 2)) * chromaGate;
        // Fine hair at the hairline lets scalp show through. Treat a hair-region pixel as a
        // blend of scalp and hair and unmix it by lightness: at skin lightness it is all
        // scalp, at the hair's mean lightness all hair.
        const hairW = m[this.idx[i] * 4 + 1] / 255;
        const scalpFraction = Math.max(0, Math.min(1, (this.L[i] - hL) / Math.max(0.05, sL - hL)));
        const scalp = hairW * scalpFraction * chromaGate;
        this.skinW[i] = w0 + (1 - w0) * Math.max(likeness, scalp);
      }
    }
  }

  static async load(src: string, maskSrc: string): Promise<PortraitRenderer> {
    const [img, mask] = await Promise.all([loadImage(src), loadImage(maskSrc)]);
    return new PortraitRenderer(img, mask);
  }

  /**
   * Find the neck and shoulder line from the skin mask and build a cape that wraps the
   * base of the neck and rests on the shoulders.
   */
  private computeDrape(m: Uint8ClampedArray, w: number, h: number) {
    const skinAt = (x: number, y: number) => m[(y * w + x) * 4] > 128;
    const alpha = new Float32Array(w * h);
    const fold = new Float32Array(w * h);
    const shadow = new Float32Array(w * h);
    const bounce = new Float32Array(w * h);

    let lipsBottom = Math.round(h * 0.6);
    for (let y = h - 1; y > 0; y--) {
      let found = false;
      for (let x = 0; x < w; x += 2) {
        if (m[(y * w + x) * 4 + 2] > 128) {
          found = true;
          break;
        }
      }
      if (found) {
        lipsBottom = y;
        break;
      }
    }

    const rowSpan = (y: number): [number, number] => {
      let a = -1;
      let b = -1;
      for (let x = 0; x < w; x++) if (skinAt(x, y)) { a = x; break; }
      for (let x = w - 1; x >= 0; x--) if (skinAt(x, y)) { b = x; break; }
      return [a, b];
    };

    // Narrowest point of the neck below the mouth.
    let neckY = Math.round(lipsBottom + h * 0.12);
    let neckWidth = Infinity;
    for (let y = Math.round(lipsBottom + h * 0.06); y < h * 0.92; y++) {
      const [a, b] = rowSpan(y);
      if (a < 0) continue;
      const width = b - a;
      if (width < neckWidth) {
        neckWidth = width;
        neckY = y;
      }
    }
    let shoulderY = Math.round(h * 0.88);
    for (let y = neckY; y < h; y++) {
      const [a, b] = rowSpan(y);
      if (a >= 0 && b - a > neckWidth * 2.2) {
        shoulderY = y;
        break;
      }
    }
    const collarY = neckY + 0.6 * (shoulderY - neckY);
    const [na, nb] = rowSpan(Math.round(collarY));
    const cx = na >= 0 ? (na + nb) / 2 : w / 2;
    const halfNeck = na >= 0 ? (nb - na) / 2 : w * 0.1;
    const R = halfNeck * 1.22;
    const pad = h * 0.01;

    // Top edge of the drape for every column.
    const top = new Float32Array(w);
    for (let x = 0; x < w; x++) {
      const dx = x - cx;
      if (Math.abs(dx) < R) {
        top[x] = collarY + halfNeck * 0.42 * Math.sqrt(1 - (dx / R) ** 2);
      } else {
        let ys = h;
        for (let y = neckY; y < h; y++) {
          if (skinAt(x, y)) {
            ys = y;
            break;
          }
        }
        top[x] = Math.max(collarY, ys - pad);
      }
    }
    // Soften the junction between neckline and shoulders.
    const win = Math.max(3, Math.round(w * 0.018));
    const smooth = new Float32Array(w);
    for (let x = 0; x < w; x++) {
      let s = 0;
      let n = 0;
      for (let k = -win; k <= win; k++) {
        const xx = Math.min(w - 1, Math.max(0, x + k));
        s += top[xx];
        n++;
      }
      smooth[x] = s / n;
    }

    const shadowH = h * 0.022;
    const bounceH = h * 0.2;
    for (let x = 0; x < w; x++) {
      const yTop = smooth[x];
      const edge = Math.abs(x - cx) / (w / 2);
      const phase = (x / w) * Math.PI * 2 * 4.5;
      for (let y = Math.max(0, Math.floor(yTop - bounceH)); y < h; y++) {
        const p = y * w + x;
        const d = y - yTop;
        if (d >= -1.2) {
          const a = smoothstep(-1.2, 1.2, d);
          alpha[p] = a;
          const depth = smoothstep(0, h * 0.1, d);
          // Folds fan out radially from the neck (cloth hanging off the shoulders),
          // with a slower vertical ripple so they don't look combed.
          const ang = Math.atan2(y - collarY + h * 0.05, x - cx);
          const dist = Math.hypot(x - cx, y - collarY) / h;
          const radial = Math.sin(ang * 16 + 2.2 * Math.sin(dist * 11 + ang * 3)) * 0.07 * depth;
          const ripple = Math.sin(phase * 0.55 + (y / h) * 5) * 0.035 * depth;
          // Rolled collar edge: a highlight on the lip of the fabric, shadow just under it.
          const rim =
            0.09 * Math.exp(-Math.max(0, d) / (h * 0.005)) -
            0.06 * Math.exp(-(((d - h * 0.014) / (h * 0.007)) ** 2));
          const fall = -0.08 * ((y - yTop) / Math.max(1, h - yTop));
          const curve = -0.08 * edge * edge;
          fold[p] = 1 + radial + ripple + rim + fall + curve;
        } else {
          const above = -d;
          if (above < shadowH) shadow[p] = 0.22 * (1 - above / shadowH) ** 2;
          if (above < bounceH) bounce[p] = 0.12 * (1 - above / bounceH) ** 2;
        }
      }
    }

    return { alpha, fold, shadow, bounce };
  }

  render(out: ImageData, params: RenderParams): void {
    const data = out.data;
    data.set(this.base);

    const { measuredSkin: mS, targetSkin: tS } = params;
    const skinX = regionTransform(mS, tS);
    // Lips get their own target from the lip model, applied as a delta from the photo's lips.
    const lm = this.lipMean;
    const lipFrom = lipModel(mS);
    const lipTo = lipModel(tS);
    const lipX = regionTransform(lm, {
      L: lm.L + (lipTo.L - lipFrom.L),
      a: lm.a + (lipTo.a - lipFrom.a),
      b: lm.b + (lipTo.b - lipFrom.b)
    });

    const drape = params.drapeHex ? hexToOklab(params.drapeHex) : null;
    const lip = params.lipHex ? hexToOklab(params.lipHex) : null;

    const { idx, L, A, B, skinW, lipW, drapeW, fold, shadow, bounce } = this;
    for (let i = 0, n = idx.length; i < n; i++) {
      let l = L[i];
      let a = A[i];
      let b = B[i];

      const sw = skinW[i];
      if (sw > 0) {
        const lw0 = lipW[i];
        const x = lw0 > 0 ? mixTransform(skinX, lipX, lw0) : skinX;
        const nl = x.tL + (l - x.mL) * x.shade;
        // Rotate hue, then carry the pixel's chroma deviation from the mean additively.
        const c = Math.hypot(a, b);
        const ra = a * x.cos - b * x.sin;
        const rb = a * x.sin + b * x.cos;
        const s = c > 1e-5 ? Math.max(0, x.tC + (c - x.mC) * x.dev) / c : 0;
        l += (nl - l) * sw;
        a += (ra * s - a) * sw;
        b += (rb * s - b) * sw;
        if (drape) {
          const s = shadow[i] * sw;
          l *= 1 - s;
          const k = bounce[i] * sw;
          a += (drape.a - a) * k;
          b += (drape.b - b) * k;
          l += (drape.L - l) * k * 0.25;
        }
      }

      const lw = lipW[i];
      if (lip && lw > 0) {
        // Lipstick keeps the lip's own texture (measured on the original pixels).
        const t = lw * 0.88;
        const nl = lip.L + (L[i] - lm.L) * 0.85;
        const na = lip.a + (A[i] - lm.a) * 0.35;
        const nb = lip.b + (B[i] - lm.b) * 0.35;
        l += (nl - l) * t;
        a += (na - a) * t;
        b += (nb - b) * t;
      }

      const dw = drapeW[i];
      if (drape && dw > 0) {
        const f = fold[i];
        const nl = Math.min(0.99, drape.L * f);
        // Fabric folds also shift chroma slightly (shadows are richer, highlights paler).
        const cs = 0.9 + 0.1 * f;
        l += (nl - l) * dw;
        a += (drape.a * cs - a) * dw;
        b += (drape.b * cs - b) * dw;
      }

      const l1 = l + 0.3963377774 * a + 0.2158037573 * b;
      const m1 = l - 0.1055613458 * a - 0.0638541728 * b;
      const s1 = l - 0.0894841775 * a - 1.291485548 * b;
      const lc = l1 * l1 * l1;
      const mc = m1 * m1 * m1;
      const sc = s1 * s1 * s1;
      let r = 4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc;
      let g = -1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc;
      let bl = -0.0041960863 * lc - 0.7034186147 * mc + 1.707614701 * sc;
      // Gamut-map instead of clipping: pull toward this pixel's own grey (same OKLab L)
      // just far enough to fit, which preserves hue rather than skewing it.
      const lo = Math.min(r, g, bl);
      const hi = Math.max(r, g, bl);
      if (lo < 0 || hi > 1) {
        const grey = Math.min(1, Math.max(0, l * l * l));
        let t = 1;
        if (lo < 0) t = Math.min(t, grey / (grey - lo));
        if (hi > 1) t = Math.min(t, (1 - grey) / (hi - grey));
        r = grey + (r - grey) * t;
        g = grey + (g - grey) * t;
        bl = grey + (bl - grey) * t;
      }
      const q = idx[i] * 4;
      data[q] = toByte(r);
      data[q + 1] = toByte(g);
      data[q + 2] = toByte(bl);
    }
  }
}

interface RegionTransform {
  mL: number;
  tL: number;
  mC: number;
  tC: number;
  cos: number;
  sin: number;
  shade: number;
  /** How much of each pixel's chroma deviation from the mean is kept. */
  dev: number;
}

/** Carries a region's measured mean colour onto a target mean. */
function regionTransform(m: Lab, t: Lab): RegionTransform {
  const theta = Math.atan2(t.b, t.a) - Math.atan2(m.b, m.a);
  const mC = Math.hypot(m.a, m.b);
  const tC = Math.hypot(t.a, t.b);
  return {
    mL: m.L,
    tL: t.L,
    mC,
    tC,
    cos: Math.cos(theta),
    sin: Math.sin(theta),
    // Deeper targets compress shading proportionally (as real deeper skin does).
    shade: 0.45 + 0.55 * (t.L / m.L),
    dev: Math.min(1.2, Math.max(0.6, tC / Math.max(mC, 1e-4)))
  };
}

function mixTransform(a: RegionTransform, b: RegionTransform, t: number): RegionTransform {
  const mix = (x: number, y: number) => x + (y - x) * t;
  return {
    mL: mix(a.mL, b.mL),
    tL: mix(a.tL, b.tL),
    mC: mix(a.mC, b.mC),
    tC: mix(a.tC, b.tC),
    cos: mix(a.cos, b.cos),
    sin: mix(a.sin, b.sin),
    shade: mix(a.shade, b.shade),
    dev: mix(a.dev, b.dev)
  };
}

/**
 * Natural lip colour for a given mean skin colour, fitted to the nine portraits:
 * lips sit ~0.10 L below fair skin, converging to ~0.01 on the deepest skin; chroma
 * falls from ~0.10 to ~0.055; hue sits 6–17° redder than the skin.
 */
function lipModel(skin: Lab): Lab {
  const sL = skin.L;
  const sh = (Math.atan2(skin.b, skin.a) * 180) / Math.PI;
  const L = sL - (0.013 + 0.222 * Math.max(0, sL - 0.357));
  const C = 0.062 + 0.095 * Math.max(0, sL - 0.35);
  const h = ((sh - (6 + 25 * Math.max(0, sL - 0.35))) * Math.PI) / 180;
  return { L, a: Math.cos(h) * C, b: Math.sin(h) * C };
}

const cache = new Map<string, Promise<PortraitRenderer>>();

export function getRenderer(src: string, maskSrc: string): Promise<PortraitRenderer> {
  let hit = cache.get(src);
  if (!hit) {
    hit = PortraitRenderer.load(src, maskSrc);
    hit.catch(() => cache.delete(src));
    cache.set(src, hit);
  }
  return hit;
}

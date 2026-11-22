/**
 * The user's colouring profile: what they set in the studio, how it maps to a realistic
 * skin colour, and how it projects onto the four analysis axes used for season matching.
 */

import { clamp, labToLch, lchToLab, oklchToHex, type Lab } from "@/lib/color/oklab";

export interface HairOption {
  id: string;
  /** Representative colour for the swatch */
  hex: string;
  /** OKLab lightness of typical hair of this colour */
  L: number;
  /** -1 ash / cool … +1 golden / red */
  warmth: number;
}

export interface EyeOption {
  id: string;
  hex: string;
  /** Iris lightness (OKLab L) */
  L: number;
  /** 0 soft / grey-ish … 1 clear, sparkling, high-contrast iris */
  clarity: number;
  warmth: number;
}

export const hairOptions: HairOption[] = [
  { id: "platinum", hex: "#e4d9c4", L: 0.88, warmth: -0.3 },
  { id: "ash-blonde", hex: "#b9a88a", L: 0.73, warmth: -0.6 },
  { id: "golden-blonde", hex: "#c9a063", L: 0.73, warmth: 0.8 },
  { id: "strawberry", hex: "#c08455", L: 0.66, warmth: 0.95 },
  { id: "light-brown", hex: "#8f7357", L: 0.56, warmth: -0.1 },
  { id: "auburn", hex: "#8c4a2f", L: 0.48, warmth: 1 },
  { id: "golden-brown", hex: "#7a5636", L: 0.48, warmth: 0.6 },
  { id: "medium-brown", hex: "#5e4535", L: 0.41, warmth: 0 },
  { id: "dark-brown", hex: "#3d2c23", L: 0.32, warmth: -0.1 },
  { id: "black-brown", hex: "#261c18", L: 0.25, warmth: -0.2 },
  { id: "black", hex: "#151314", L: 0.18, warmth: -0.5 },
  { id: "silver", hex: "#b8b8b8", L: 0.78, warmth: -0.8 }
];

export const eyeOptions: EyeOption[] = [
  { id: "icy-blue", hex: "#8fb3cf", L: 0.72, clarity: 0.95, warmth: -0.9 },
  { id: "blue", hex: "#5a7fa3", L: 0.58, clarity: 0.75, warmth: -0.7 },
  { id: "blue-grey", hex: "#7d8d99", L: 0.62, clarity: 0.25, warmth: -0.5 },
  { id: "grey-green", hex: "#7e8a72", L: 0.6, clarity: 0.2, warmth: 0 },
  { id: "green", hex: "#5f8a55", L: 0.56, clarity: 0.7, warmth: 0.2 },
  { id: "hazel", hex: "#8a7344", L: 0.52, clarity: 0.35, warmth: 0.5 },
  { id: "amber", hex: "#9c6a2c", L: 0.52, clarity: 0.6, warmth: 0.9 },
  { id: "light-brown", hex: "#7a5233", L: 0.42, clarity: 0.4, warmth: 0.5 },
  { id: "dark-brown", hex: "#43291b", L: 0.3, clarity: 0.55, warmth: 0.1 },
  { id: "black-brown", hex: "#221713", L: 0.21, clarity: 0.85, warmth: -0.1 }
];

export interface Profile {
  modelId: string;
  /** 0 porcelain … 100 deepest */
  skinDepth: number;
  /** -50 cool (pink / blue-red) … +50 warm (golden / peach) */
  undertone: number;
  olive: boolean;
  /** 0 soft / muted … 100 clear / vivid — how saturated colour behaves next to the face */
  clarity: number;
  hair: string;
  eyes: string;
}

export interface PortraitModel {
  id: string;
  src: string;
  mask: string;
  /** Mean skin colour measured from the photo through its skin mask (OKLab). */
  measuredSkin: Lab;
  /** The profile this photo represents. Rendering applies deltas from this baseline. */
  baseline: Omit<Profile, "modelId">;
}

/**
 * Measured with the mask generator in scripts/mask-generator (mean over mask > 0.9).
 * Depths follow from the skin model below: depth = (0.86 − L) / 0.52.
 */
export const portraitModels: PortraitModel[] = [
  {
    id: "model-01",
    measuredSkin: { L: 0.777, a: 0.0512, b: 0.0411 },
    baseline: { skinDepth: 16, undertone: -28, olive: false, clarity: 55, hair: "dark-brown", eyes: "light-brown" }
  },
  {
    id: "model-02",
    measuredSkin: { L: 0.791, a: 0.0463, b: 0.066 },
    baseline: { skinDepth: 13, undertone: 30, olive: false, clarity: 50, hair: "light-brown", eyes: "hazel" }
  },
  {
    id: "model-03",
    measuredSkin: { L: 0.703, a: 0.0608, b: 0.0605 },
    baseline: { skinDepth: 30, undertone: -18, olive: false, clarity: 55, hair: "dark-brown", eyes: "dark-brown" }
  },
  {
    id: "model-04",
    measuredSkin: { L: 0.689, a: 0.0579, b: 0.0781 },
    baseline: { skinDepth: 33, undertone: 28, olive: false, clarity: 60, hair: "dark-brown", eyes: "light-brown" }
  },
  {
    id: "model-05",
    measuredSkin: { L: 0.627, a: 0.0404, b: 0.0585 },
    baseline: { skinDepth: 45, undertone: 8, olive: true, clarity: 35, hair: "medium-brown", eyes: "hazel" }
  },
  {
    id: "model-06",
    measuredSkin: { L: 0.566, a: 0.0598, b: 0.0791 },
    baseline: { skinDepth: 56, undertone: 30, olive: false, clarity: 60, hair: "black-brown", eyes: "dark-brown" }
  },
  {
    id: "model-07",
    measuredSkin: { L: 0.577, a: 0.057, b: 0.0734 },
    baseline: { skinDepth: 54, undertone: 4, olive: false, clarity: 50, hair: "dark-brown", eyes: "dark-brown" }
  },
  {
    id: "model-08",
    measuredSkin: { L: 0.354, a: 0.0438, b: 0.039 },
    baseline: { skinDepth: 97, undertone: -22, olive: false, clarity: 70, hair: "black", eyes: "black-brown" }
  },
  {
    id: "model-09",
    measuredSkin: { L: 0.363, a: 0.0564, b: 0.0581 },
    baseline: { skinDepth: 95, undertone: 24, olive: false, clarity: 65, hair: "black", eyes: "dark-brown" }
  }
].map((m) => ({ ...m, src: `/models/${m.id}.png`, mask: `/masks/${m.id}.png` }));

export function getPortraitModel(id: string): PortraitModel {
  return portraitModels.find((m) => m.id === id) ?? portraitModels[0];
}

export function getHair(id: string): HairOption {
  return hairOptions.find((h) => h.id === id) ?? hairOptions[8];
}

export function getEyes(id: string): EyeOption {
  return eyeOptions.find((e) => e.id === id) ?? eyeOptions[8];
}

export function profileForModel(modelId: string): Profile {
  const model = getPortraitModel(modelId);
  return { modelId: model.id, ...model.baseline };
}

export const defaultProfile: Profile = profileForModel("model-01");

/** How far (in profile units) a portrait is from a profile's skin. Depth dominates. */
function portraitDistance(m: PortraitModel, p: Profile): number {
  return (
    Math.abs(m.baseline.skinDepth - p.skinDepth) +
    0.2 * Math.abs(m.baseline.undertone - p.undertone) +
    (m.baseline.olive === p.olive ? 0 : 6)
  );
}

/**
 * A photo can only be recoloured so far before the rest of the face (eyes, hair,
 * shading) gives it away. Pick the real portrait closest to the profile, so the
 * renderer only has to cover a small residual difference. Sticks with the current
 * portrait unless another is clearly closer, so dragging a slider doesn't flicker.
 */
export function closestPortrait(p: Profile, current = p.modelId, hysteresis = 4): string {
  const cur = getPortraitModel(current);
  let best = cur;
  let bestD = portraitDistance(cur, p);
  for (const m of portraitModels) {
    const d = portraitDistance(m, p);
    if (d < bestD - (m.id === cur.id ? 0 : hysteresis)) {
      best = m;
      bestD = d;
    }
  }
  return best.id;
}

/** Same profile, shown on its closest real portrait. */
export function withClosestPortrait(p: Profile): Profile {
  const modelId = closestPortrait(p);
  return modelId === p.modelId ? p : { ...p, modelId };
}

/* ------------------------------------------------------------------ */
/* Skin model                                                          */
/* ------------------------------------------------------------------ */

/**
 * Parametric human skin colour in OKLCH, fitted to the nine measured portraits.
 * Lightness spans porcelain (L≈0.86) to deepest (L≈0.34). Hue sits in the narrow
 * 38°–60° skin band: cool undertones lean pink-red, warm lean golden; olive rotates
 * slightly toward yellow-green and drops chroma (the grey-green cast olive skin has).
 */
export function skinColor(p: Pick<Profile, "skinDepth" | "undertone" | "olive" | "clarity">): Lab {
  const depth = clamp(p.skinDepth / 100);
  const u = clamp(p.undertone / 50, -1, 1);
  const L = 0.86 - 0.52 * depth;
  // Deeper skin reads slightly redder in OKLCH; centre the neutral hue on lightness.
  const neutralHue = 47 + (L - 0.6) * 16;
  let h = neutralHue + 8.5 * u;
  // Skin chroma peaks at mid depths and falls toward porcelain and the deepest tones.
  let C = 0.05 + 0.045 * (1 - ((L - 0.6) / 0.3) ** 2);
  C *= 1 + 0.12 * u;
  C *= 0.88 + 0.24 * clamp(p.clarity / 100);
  if (p.olive) {
    h += 9;
    C *= 0.8;
  }
  return lchToLab({ L, C: Math.max(0.02, C), h });
}

/* ------------------------------------------------------------------ */
/* Analysis axes                                                       */
/* ------------------------------------------------------------------ */

export interface Coordinates {
  /** -1 cool … +1 warm */
  temperature: number;
  /** 0 light … 1 deep (overall colouring value) */
  value: number;
  /** 0 muted … 1 clear */
  chroma: number;
  /** 0 low … 1 high (lightness difference between hair/eyes and skin) */
  contrast: number;
}

export function contrastLevel(p: Profile): number {
  const skinL = skinColor(p).L;
  const hair = getHair(p.hair);
  const eyes = getEyes(p.eyes);
  const hairGap = Math.abs(hair.L - skinL);
  const eyeGap = Math.abs(eyes.L - skinL);
  return clamp((hairGap * 0.75 + eyeGap * 0.25) * 1.75);
}

export function profileCoordinates(p: Profile): Coordinates {
  const hair = getHair(p.hair);
  const eyes = getEyes(p.eyes);
  const depth = clamp(p.skinDepth / 100);
  const hairDepth = clamp((0.88 - hair.L) / 0.7);
  const eyeDepth = clamp((0.75 - eyes.L) / 0.55);

  // Skin undertone dominates; hair and eyes confirm. Scaled so clearly warm/cool
  // colouring reaches the poles where Warm Spring/Autumn and Cool Summer/Winter sit.
  let temperature = (clamp(p.undertone / 50, -1, 1) * 0.74 + hair.warmth * 0.16 + eyes.warmth * 0.1) * 1.25;
  let chroma = (clamp(p.clarity / 100) * 0.62 + eyes.clarity * 0.26 + contrastLevel(p) * 0.12) * 1.12 - 0.04;
  if (p.olive) {
    // Olive skin reads neutral-warm and noticeably muted.
    temperature = temperature * 0.7 + 0.12;
    chroma -= 0.12;
  }

  return {
    temperature: clamp(temperature, -1, 1),
    value: clamp(depth * 0.55 + hairDepth * 0.35 + eyeDepth * 0.1),
    chroma: clamp(chroma),
    contrast: contrastLevel(p)
  };
}

/* ------------------------------------------------------------------ */
/* URL serialisation                                                   */
/* ------------------------------------------------------------------ */

export function profileToSearchParams(p: Profile): string {
  const params = new URLSearchParams({
    m: p.modelId,
    d: String(Math.round(p.skinDepth)),
    u: String(Math.round(p.undertone)),
    c: String(Math.round(p.clarity)),
    h: p.hair,
    e: p.eyes
  });
  if (p.olive) params.set("o", "1");
  return params.toString();
}

type SearchParams = Partial<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function num(value: string | undefined, fallback: number, min: number, max: number): number {
  const n = value === undefined ? Number.NaN : Number(value);
  return Number.isFinite(n) ? clamp(n, min, max) : fallback;
}

export function profileFromSearchParams(sp: SearchParams): Profile {
  const base = profileForModel(first(sp.m) ?? defaultProfile.modelId);
  const hair = first(sp.h);
  const eyes = first(sp.e);
  return withClosestPortrait({
    modelId: base.modelId,
    skinDepth: num(first(sp.d), base.skinDepth, 0, 100),
    undertone: num(first(sp.u), base.undertone, -50, 50),
    clarity: num(first(sp.c), base.clarity, 0, 100),
    olive: first(sp.o) === undefined ? base.olive : first(sp.o) === "1",
    hair: hairOptions.some((o) => o.id === hair) ? (hair as string) : base.hair,
    eyes: eyeOptions.some((o) => o.id === eyes) ? (eyes as string) : base.eyes
  });
}

export function hasProfileParams(sp: SearchParams): boolean {
  return first(sp.m) !== undefined;
}

/** Undertone description bucket, for labels. */
export function undertoneBucket(p: Profile): "cool" | "neutral-cool" | "neutral" | "neutral-warm" | "warm" | "olive" {
  if (p.olive) return "olive";
  if (p.undertone <= -30) return "cool";
  if (p.undertone <= -10) return "neutral-cool";
  if (p.undertone < 10) return "neutral";
  if (p.undertone < 30) return "neutral-warm";
  return "warm";
}

export function skinHex(p: Profile): string {
  return oklchToHex(labToLch(skinColor(p)));
}

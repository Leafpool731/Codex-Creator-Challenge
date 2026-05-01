import { getInitialSelections } from "@/lib/attributes";
import type { ContrastValue, UserSelections } from "@/lib/types";

export type LightingPresetId = "daylight" | "warm" | "cool" | "soft" | "evening";

/** Matrix-driven skin depth bands (see data/skinDepthHex.json). */
export interface ModelState {
  modelId: string;
  skinTone: string;
  undertone: number;
  skinDepth: number;
  /** -50 rosy … +50 cool blue (scoring nudge) */
  rosyBlue: number;
  /** -50 golden … +50 olive (scoring nudge) */
  goldenOlive: number;
  /** -50 muted … +50 clear (maps to chroma for scoring) */
  mutedClear: number;
  /** -50 darker … +50 lighter fine luminance (scoring nudge) */
  skinFineDepth: number;
  contrast: number;
  lightingPreset: LightingPresetId;
  lightIntensity: number;
  environmentBrightness: number;
  lightWarmth: number;
}

export interface SkinToneOption {
  id: string;
  label: string;
  hex: string;
  depth: number;
}

export interface LightingPreset {
  id: LightingPresetId;
  label: string;
  description: string;
  lightIntensity: number;
  environmentBrightness: number;
  lightWarmth: number;
}

export interface QuickLookPreset {
  id: string;
  label: string;
  note: string;
  state: Partial<ModelState>;
}

export const skinToneOptions: SkinToneOption[] = [
  { id: "porcelain", label: "Porcelain", hex: "#FFF0E8", depth: 0 },
  { id: "fair", label: "Fair", hex: "#FFD6B2", depth: 1 },
  { id: "light", label: "Light", hex: "#E8B895", depth: 2 },
  { id: "medium", label: "Medium", hex: "#D0A582", depth: 3 },
  { id: "tan", label: "Tan", hex: "#7D5939", depth: 4 },
  { id: "deep", label: "Deep", hex: "#442708", depth: 5 },
  { id: "rich-deep", label: "Rich Deep", hex: "#2A1508", depth: 6 }
];

export const lightingPresets: LightingPreset[] = [
  {
    id: "daylight",
    label: "Daylight",
    description: "Balanced window light",
    lightIntensity: 72,
    environmentBrightness: 82,
    lightWarmth: 50
  },
  {
    id: "warm",
    label: "Warm",
    description: "Golden vanity light",
    lightIntensity: 74,
    environmentBrightness: 76,
    lightWarmth: 78
  },
  {
    id: "cool",
    label: "Cool",
    description: "Blue studio light",
    lightIntensity: 68,
    environmentBrightness: 74,
    lightWarmth: 24
  },
  {
    id: "soft",
    label: "Soft",
    description: "Diffused editorial light",
    lightIntensity: 54,
    environmentBrightness: 78,
    lightWarmth: 56
  },
  {
    id: "evening",
    label: "Evening",
    description: "Low warm ambience",
    lightIntensity: 60,
    environmentBrightness: 48,
    lightWarmth: 82
  }
];

export const defaultModelState: ModelState = {
  modelId: "model-01",
  skinTone: "light",
  undertone: 58,
  skinDepth: 2,
  rosyBlue: 0,
  goldenOlive: 0,
  mutedClear: 0,
  skinFineDepth: 0,
  contrast: 50,
  lightingPreset: "daylight",
  lightIntensity: 72,
  environmentBrightness: 82,
  lightWarmth: 50
};

export const quickLookPresets: QuickLookPreset[] = [
  {
    id: "soft-cool",
    label: "Soft cool",
    note: "Fair, cool-neutral",
    state: {
      skinTone: "fair",
      skinDepth: 1,
      undertone: 28,
      mutedClear: -18,
      rosyBlue: -6,
      goldenOlive: 0,
      skinFineDepth: 0,
      contrast: 28,
      lightingPreset: "soft",
      lightIntensity: 54,
      environmentBrightness: 78,
      lightWarmth: 56
    }
  },
  {
    id: "sunlit-warm",
    label: "Sunlit warm",
    note: "Medium depth, warm",
    state: {
      skinTone: "medium",
      skinDepth: 3,
      undertone: 82,
      mutedClear: 22,
      rosyBlue: 0,
      goldenOlive: -12,
      skinFineDepth: 0,
      contrast: 36,
      lightingPreset: "warm",
      lightIntensity: 74,
      environmentBrightness: 76,
      lightWarmth: 78
    }
  },
  {
    id: "clear-deep",
    label: "Clear deep",
    note: "Tan, higher chroma",
    state: {
      skinTone: "tan",
      skinDepth: 4,
      undertone: 40,
      mutedClear: 28,
      rosyBlue: 0,
      goldenOlive: 0,
      skinFineDepth: 0,
      contrast: 54,
      lightingPreset: "daylight",
      lightIntensity: 76,
      environmentBrightness: 78,
      lightWarmth: 45
    }
  }
];

const numberKeys = [
  "undertone",
  "skinDepth",
  "rosyBlue",
  "goldenOlive",
  "mutedClear",
  "skinFineDepth",
  "contrast",
  "lightIntensity",
  "environmentBrightness",
  "lightWarmth"
] as const;

const stringKeys = ["modelId", "skinTone", "lightingPreset"] as const;

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function nearestSkinDepthId(depth: number): string {
  return skinToneOptions.reduce((nearest, option) => {
    return Math.abs(option.depth - depth) < Math.abs(nearest.depth - depth)
      ? option
      : nearest;
  }, skinToneOptions[0]).id;
}

function mutedClearToSelection(mutedClear: number): string {
  if (mutedClear <= -16) {
    return "soft";
  }

  if (mutedClear >= 20) {
    return "bright";
  }

  return "medium";
}

/** Nudge undertone for scoring from fine-tune axes (subtle). */
function effectiveUndertoneNumber(state: ModelState): number {
  let u = state.undertone;
  u -= state.rosyBlue * 0.1;
  const go = clamp(state.goldenOlive, -50, 50);
  if (go > 0) {
    const t = go / 50;
    u = u * (1 - t * 0.14) + 52 * (t * 0.14);
  } else if (go < 0) {
    u += (-go / 50) * 6;
  }
  return clamp(u, 0, 100);
}

function effectiveSkinDepthForSelection(state: ModelState): number {
  return clamp(state.skinDepth + state.skinFineDepth * 0.02, 0, 6);
}

function undertoneToSelection(undertone: number): string {
  if (undertone <= 18) {
    return "cool";
  }

  if (undertone >= 51 && undertone <= 53) {
    return "olive";
  }

  if (undertone <= 40) {
    return "neutral-cool";
  }

  if (undertone < 60) {
    return "neutral";
  }

  if (undertone < 82) {
    return "neutral-warm";
  }

  return "warm";
}

/** Studio contrast is explicit now that hair and eye editing are out of scope. */
function contrastFromModel(contrast: number): ContrastValue {
  if (contrast <= 36) {
    return "low";
  }

  if (contrast >= 68) {
    return "high";
  }

  return "medium";
}

export function getLightingPreset(id: LightingPresetId): LightingPreset {
  return lightingPresets.find((preset) => preset.id === id) ?? lightingPresets[0];
}

export function applyLightingPreset(
  state: ModelState,
  presetId: LightingPresetId
): ModelState {
  const preset = getLightingPreset(presetId);

  return {
    ...state,
    lightingPreset: preset.id,
    lightIntensity: preset.lightIntensity,
    environmentBrightness: preset.environmentBrightness,
    lightWarmth: preset.lightWarmth
  };
}

export function modelStateToSelections(state: ModelState): UserSelections {
  const defaults = getInitialSelections();

  return {
    ...defaults,
    skinDepth: nearestSkinDepthId(effectiveSkinDepthForSelection(state)),
    undertone: undertoneToSelection(effectiveUndertoneNumber(state)),
    chroma: mutedClearToSelection(state.mutedClear),
    contrast: contrastFromModel(state.contrast)
  };
}

export function modelStateToSearchParams(state: ModelState): string {
  const params = new URLSearchParams(modelStateToSelections(state));

  numberKeys.forEach((key) => {
    params.set(key, String(Math.round(state[key])));
  });

  stringKeys.forEach((key) => {
    params.set(key, state[key]);
  });

  return params.toString();
}

export function modelStateFromSearchParams(
  input?: Partial<Record<string, string | string[] | undefined>>
): ModelState {
  const next: ModelState = { ...defaultModelState };

  if (!input) {
    return next;
  }

  numberKeys.forEach((key) => {
    const raw = input[key];
    const value = Array.isArray(raw) ? raw[0] : raw;
    const parsed = value ? Number(value) : NaN;

    if (Number.isFinite(parsed)) {
      if (key === "skinDepth") {
        next[key] = clamp(parsed, 0, 6);
      } else if (
        key === "rosyBlue" ||
        key === "goldenOlive" ||
        key === "mutedClear" ||
        key === "skinFineDepth"
      ) {
        next[key] = clamp(parsed, -50, 50);
      } else {
        next[key] = clamp(parsed);
      }
    }
  });

  stringKeys.forEach((key) => {
    const raw = input[key];
    const value = Array.isArray(raw) ? raw[0] : raw;

    if (value) {
      next[key] = value as never;
    }
  });

  const legacySelections = getInitialSelections();

  Object.keys(legacySelections).forEach((key) => {
    const raw = input[key];
    const value = Array.isArray(raw) ? raw[0] : raw;

    if (!value) {
      return;
    }

    if (key === "skinDepth") {
      const tone = skinToneOptions.find((option) => option.id === value);
      if (tone) {
        next.skinTone = tone.id;
        next.skinDepth = tone.depth;
      }
    }

    if (key === "undertone") {
      const map: Record<string, number> = {
        cool: 10,
        "neutral-cool": 32,
        neutral: 50,
        "neutral-warm": 68,
        warm: 90,
        olive: 52
      };
      next.undertone = map[value] ?? next.undertone;
    }

    if (key === "chroma") {
      const map: Record<string, number> = { soft: -28, medium: 0, bright: 30 };
      next.mutedClear = map[value] ?? next.mutedClear;
    }

    if (key === "contrast") {
      const map: Record<string, number> = { low: 24, medium: 50, high: 82 };
      next.contrast = map[value] ?? next.contrast;
    }
  });

  const legacyChromaRaw = input.chroma;
  const legacyChromaStr = Array.isArray(legacyChromaRaw)
    ? legacyChromaRaw[0]
    : legacyChromaRaw;
  const legacyChromaNum =
    legacyChromaStr !== undefined && legacyChromaStr !== ""
      ? Number(legacyChromaStr)
      : NaN;
  const isNumericLegacyChroma =
    Number.isFinite(legacyChromaNum) &&
    legacyChromaNum >= 0 &&
    legacyChromaNum <= 100 &&
    !["soft", "medium", "bright"].includes(String(legacyChromaStr).toLowerCase());
  if (
    isNumericLegacyChroma &&
    next.mutedClear === 0 &&
    next.rosyBlue === 0 &&
    next.goldenOlive === 0
  ) {
    next.mutedClear = clamp(Math.round(((legacyChromaNum - 54) / 40) * 50), -50, 50);
  }

  return next;
}

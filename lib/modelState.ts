import { getAttributeOption, getInitialSelections } from "@/lib/attributes";
import type { ContrastValue, UserSelections } from "@/lib/types";

export type LightingPresetId = "daylight" | "warm" | "cool" | "soft" | "evening";

export interface ModelState {
  skinTone: string;
  undertone: number;
  skinDepth: number;
  chroma: number;
  freckles: number;
  blush: number;
  hairColor: string;
  eyeColor: string;
  lipColor: string;
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

export interface ColorOption {
  id: string;
  label: string;
  hex: string;
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
  { id: "porcelain", label: "Porcelain", hex: "#f1d6ce", depth: 0 },
  { id: "fair", label: "Fair", hex: "#e8c0ad", depth: 1 },
  { id: "light", label: "Light", hex: "#d7a17c", depth: 2 },
  { id: "medium", label: "Medium", hex: "#b97756", depth: 3 },
  { id: "tan", label: "Tan", hex: "#92593d", depth: 4 },
  { id: "deep", label: "Deep", hex: "#653a2c", depth: 5 },
  { id: "rich-deep", label: "Rich deep", hex: "#3d241f", depth: 6 }
];

export const hairColorOptions: ColorOption[] = [
  { id: "ash-blonde", label: "Ash blonde", hex: "#c5bca6" },
  { id: "golden-blonde", label: "Golden blonde", hex: "#d9a953" },
  { id: "copper", label: "Copper", hex: "#b85a32" },
  { id: "auburn", label: "Auburn", hex: "#7c3829" },
  { id: "chestnut", label: "Chestnut", hex: "#5e392c" },
  { id: "espresso", label: "Espresso", hex: "#2f211d" },
  { id: "soft-black", label: "Soft black", hex: "#141217" },
  { id: "silver", label: "Silver", hex: "#c8c8c5" }
];

export const eyeColorOptions: ColorOption[] = [
  { id: "light-blue", label: "Light blue", hex: "#8fb4cb" },
  { id: "clear-blue", label: "Clear blue", hex: "#3e92c5" },
  { id: "blue-gray", label: "Blue gray", hex: "#8294a0" },
  { id: "green", label: "Green", hex: "#6f966e" },
  { id: "hazel", label: "Hazel", hex: "#8b7a43" },
  { id: "amber", label: "Amber", hex: "#b06b2c" },
  { id: "warm-brown", label: "Warm brown", hex: "#70472b" },
  { id: "deep-brown", label: "Deep brown", hex: "#3b261d" }
];

export const lipColorOptions: ColorOption[] = [
  { id: "rose-balm", label: "Rose balm", hex: "#b86a72" },
  { id: "peach-nude", label: "Peach nude", hex: "#c67b62" },
  { id: "berry-veil", label: "Berry veil", hex: "#8d4057" },
  { id: "coral-gloss", label: "Coral gloss", hex: "#d46155" },
  { id: "cocoa-rose", label: "Cocoa rose", hex: "#8f5a58" },
  { id: "clear-red", label: "Clear red", hex: "#b9283d" }
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
  skinTone: "light",
  undertone: 58,
  skinDepth: 2,
  chroma: 54,
  freckles: 14,
  blush: 28,
  hairColor: "chestnut",
  eyeColor: "hazel",
  lipColor: "rose-balm",
  lightingPreset: "daylight",
  lightIntensity: 72,
  environmentBrightness: 82,
  lightWarmth: 50
};

export const quickLookPresets: QuickLookPreset[] = [
  {
    id: "soft-cool",
    label: "Soft cool",
    note: "Muted rose, ash hair",
    state: {
      skinTone: "fair",
      skinDepth: 1,
      undertone: 28,
      chroma: 28,
      hairColor: "ash-blonde",
      eyeColor: "blue-gray",
      lipColor: "rose-balm",
      lightingPreset: "soft",
      lightIntensity: 54,
      environmentBrightness: 78,
      lightWarmth: 56
    }
  },
  {
    id: "sunlit-warm",
    label: "Sunlit warm",
    note: "Golden skin, copper hair",
    state: {
      skinTone: "medium",
      skinDepth: 3,
      undertone: 82,
      chroma: 68,
      freckles: 36,
      blush: 34,
      hairColor: "copper",
      eyeColor: "amber",
      lipColor: "coral-gloss",
      lightingPreset: "warm",
      lightIntensity: 74,
      environmentBrightness: 76,
      lightWarmth: 78
    }
  },
  {
    id: "clear-deep",
    label: "Clear deep",
    note: "High contrast, jewel eyes",
    state: {
      skinTone: "tan",
      skinDepth: 4,
      undertone: 40,
      chroma: 82,
      freckles: 4,
      blush: 18,
      hairColor: "soft-black",
      eyeColor: "clear-blue",
      lipColor: "berry-veil",
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
  "chroma",
  "freckles",
  "blush",
  "lightIntensity",
  "environmentBrightness",
  "lightWarmth"
] as const;

const stringKeys = [
  "skinTone",
  "hairColor",
  "eyeColor",
  "lipColor",
  "lightingPreset"
] as const;

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

function chromaToSelection(chroma: number): string {
  if (chroma <= 36) {
    return "soft";
  }

  if (chroma >= 68) {
    return "bright";
  }

  return "medium";
}

function undertoneToSelection(undertone: number): string {
  if (undertone <= 18) {
    return "cool";
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

function contrastFromModel(state: ModelState): ContrastValue {
  const hairDepth =
    getAttributeOption("hairColor", state.hairColor).depthValue ?? state.skinDepth;
  const eyeDepth =
    getAttributeOption("eyeColor", state.eyeColor).depthValue ?? state.skinDepth;
  const deepestFeature = Math.max(hairDepth, eyeDepth);
  const contrast = Math.abs(deepestFeature - state.skinDepth);

  if (contrast >= 3.2) {
    return "high";
  }

  if (contrast >= 1.6) {
    return "medium";
  }

  return "low";
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
    skinDepth: nearestSkinDepthId(state.skinDepth),
    undertone: undertoneToSelection(state.undertone),
    chroma: chromaToSelection(state.chroma),
    contrast: contrastFromModel(state),
    eyeColor: state.eyeColor,
    hairColor: state.hairColor
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
  const state: ModelState = { ...defaultModelState };

  if (!input) {
    return state;
  }

  numberKeys.forEach((key) => {
    const raw = input[key];
    const value = Array.isArray(raw) ? raw[0] : raw;
    const parsed = value ? Number(value) : NaN;

    if (Number.isFinite(parsed)) {
      state[key] = key === "skinDepth" ? clamp(parsed, 0, 6) : clamp(parsed);
    }
  });

  stringKeys.forEach((key) => {
    const raw = input[key];
    const value = Array.isArray(raw) ? raw[0] : raw;

    if (value) {
      state[key] = value as never;
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
        state.skinTone = tone.id;
        state.skinDepth = tone.depth;
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
      state.undertone = map[value] ?? state.undertone;
    }

    if (key === "chroma") {
      const map: Record<string, number> = { soft: 24, medium: 54, bright: 82 };
      state.chroma = map[value] ?? state.chroma;
    }

    if (key === "eyeColor") {
      state.eyeColor = value;
    }

    if (key === "hairColor") {
      state.hairColor = value;
    }
  });

  return state;
}

export function getOptionHex(options: ColorOption[], id: string): string {
  return options.find((option) => option.id === id)?.hex ?? options[0].hex;
}

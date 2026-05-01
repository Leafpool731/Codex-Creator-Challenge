"use client";

import { createContext, useContext, useMemo, useState } from "react";
import {
  eyeColorOptions,
  hairColorOptions,
  lipColorOptions,
  modelStateToSearchParams,
  skinToneOptions,
  type ColorOption,
  type ModelState
} from "@/lib/modelState";
import type { PortraitEditType } from "@/lib/cache/cacheKey";

export type Undertone = "cool" | "neutral" | "warm" | "olive";
export type LightingPreset = "daylight" | "warm" | "cool" | "soft" | "evening";

export interface StudioState {
  modelId: string;
  skinTone: string;
  undertone: Undertone;
  depth: number;
  saturation: number;
  freckles: number;
  blush: number;
  hairIntensity: number;
  hairColor: string;
  eyeColor: string;
  lipColor: string;
  lipTint: number;
  lastEditType: PortraitEditType | null;
  lightingPreset: LightingPreset;
  lightIntensity: number;
  environment: number;
  warmth: number;
}

export interface PortraitModelOption {
  id: string;
  src: string;
  label: string;
}

export interface QuickLookOption extends PortraitModelOption {
  state: Partial<StudioState>;
}

interface StudioContextValue {
  state: StudioState;
  skinTones: typeof skinToneOptions;
  hairColors: ColorOption[];
  eyeColors: ColorOption[];
  lipColors: ColorOption[];
  setState: (patch: Partial<StudioState>) => void;
  setLightingPreset: (preset: LightingPreset) => void;
  resetView: () => void;
}

export const portraitModels: PortraitModelOption[] = [
  { id: "model-01", src: "/models/model-01.png", label: "Fair Cool" },
  { id: "model-02", src: "/models/model-02.png", label: "Fair Warm" },
  { id: "model-03", src: "/models/model-03.png", label: "Medium Cool" },
  { id: "model-04", src: "/models/model-04.png", label: "Medium Warm" },
  { id: "model-05", src: "/models/model-05.png", label: "Medium Olive" },
  { id: "model-06", src: "/models/model-06.png", label: "Tan Warm" },
  { id: "model-07", src: "/models/model-07.png", label: "Tan Neutral" },
  { id: "model-08", src: "/models/model-08.png", label: "Deep Cool" },
  { id: "model-09", src: "/models/model-09.png", label: "Deep Warm" }
];

const defaultState: StudioState = {
  modelId: "model-01",
  skinTone: "light",
  undertone: "neutral",
  depth: 36,
  saturation: 46,
  freckles: 12,
  blush: 28,
  hairIntensity: 75,
  hairColor: "chestnut",
  eyeColor: "hazel",
  lipColor: "rose-balm",
  lipTint: 42,
  lastEditType: null,
  lightingPreset: "daylight",
  lightIntensity: 72,
  environment: 68,
  warmth: 49
};

const presetValues: Record<
  LightingPreset,
  Pick<StudioState, "lightIntensity" | "environment" | "warmth">
> = {
  daylight: { lightIntensity: 72, environment: 68, warmth: 49 },
  warm: { lightIntensity: 74, environment: 64, warmth: 76 },
  cool: { lightIntensity: 66, environment: 65, warmth: 26 },
  soft: { lightIntensity: 58, environment: 70, warmth: 54 },
  evening: { lightIntensity: 52, environment: 43, warmth: 82 }
};

export const quickLookOptions: QuickLookOption[] = [
  {
    ...portraitModels[0],
    state: {
      modelId: "model-01",
      skinTone: "porcelain",
      undertone: "cool",
      depth: 14,
      saturation: 30,
      hairColor: "chestnut",
      eyeColor: "hazel",
      lipColor: "rose-balm",
      blush: 22
    }
  },
  {
    ...portraitModels[1],
    state: {
      modelId: "model-02",
      skinTone: "fair",
      undertone: "warm",
      depth: 24,
      saturation: 44,
      hairColor: "golden-blonde",
      eyeColor: "amber",
      lipColor: "peach-nude",
      lightingPreset: "warm",
      ...presetValues.warm
    }
  },
  {
    ...portraitModels[2],
    state: {
      modelId: "model-03",
      skinTone: "light",
      undertone: "neutral",
      depth: 36,
      saturation: 50,
      hairColor: "espresso",
      eyeColor: "brown",
      lipColor: "rose-balm"
    }
  },
  {
    ...portraitModels[3],
    state: {
      modelId: "model-04",
      skinTone: "medium",
      undertone: "warm",
      depth: 50,
      saturation: 58,
      hairColor: "espresso",
      eyeColor: "brown",
      lipColor: "coral-gloss"
    }
  },
  {
    ...portraitModels[4],
    state: {
      modelId: "model-05",
      skinTone: "tan",
      undertone: "olive",
      depth: 62,
      saturation: 38,
      hairColor: "soft-black",
      eyeColor: "deep-brown",
      lipColor: "cocoa-rose",
      lightingPreset: "soft",
      ...presetValues.soft
    }
  },
  {
    ...portraitModels[5],
    state: {
      modelId: "model-06",
      skinTone: "tan",
      undertone: "warm",
      depth: 70,
      saturation: 62,
      hairColor: "soft-black",
      eyeColor: "brown",
      lipColor: "coral-gloss"
    }
  },
  {
    ...portraitModels[6],
    state: {
      modelId: "model-07",
      skinTone: "deep",
      undertone: "warm",
      depth: 78,
      saturation: 52,
      hairColor: "soft-black",
      eyeColor: "deep-brown",
      lipColor: "cocoa-rose"
    }
  },
  {
    ...portraitModels[7],
    state: {
      modelId: "model-08",
      skinTone: "rich-deep",
      undertone: "cool",
      depth: 90,
      saturation: 42,
      hairColor: "soft-black",
      eyeColor: "deep-brown",
      lipColor: "berry-veil",
      lightingPreset: "cool",
      ...presetValues.cool
    }
  },
  {
    ...portraitModels[8],
    state: {
      modelId: "model-09",
      skinTone: "rich-deep",
      undertone: "warm",
      depth: 95,
      saturation: 62,
      hairColor: "soft-black",
      eyeColor: "deep-brown",
      lipColor: "clear-red",
      lightingPreset: "evening",
      ...presetValues.evening
    }
  }
];

const StudioContext = createContext<StudioContextValue | null>(null);

export function getPortraitSrc(modelId: string): string {
  return portraitModels.find((model) => model.id === modelId)?.src ?? portraitModels[0].src;
}

function undertoneToNumber(undertone: Undertone): number {
  const values: Record<Undertone, number> = {
    cool: 18,
    neutral: 50,
    warm: 84,
    olive: 52
  };

  return values[undertone];
}

function getPatchEditType(patch: Partial<StudioState>): PortraitEditType | null {
  if ("hairColor" in patch || "hairIntensity" in patch) {
    return "hair";
  }

  if ("eyeColor" in patch) {
    return "eyes";
  }

  if ("lipColor" in patch || "lipTint" in patch) {
    return "lips";
  }

  if ("blush" in patch) {
    return "blush";
  }

  if ("freckles" in patch) {
    return "freckles";
  }

  return null;
}

export function studioStateToModelState(state: StudioState): ModelState {
  return {
    modelId: state.modelId,
    skinTone: state.skinTone,
    undertone: undertoneToNumber(state.undertone),
    skinDepth: Math.round((state.depth / 100) * 60) / 10,
    chroma: state.saturation,
    freckles: state.freckles,
    blush: state.blush,
    hairIntensity: state.hairIntensity,
    hairColor: state.hairColor,
    eyeColor: state.eyeColor,
    lipColor: state.lipColor,
    lightingPreset: state.lightingPreset,
    lightIntensity: state.lightIntensity,
    environmentBrightness: state.environment,
    lightWarmth: state.warmth
  };
}

export function studioStateToSearchParams(state: StudioState): string {
  return modelStateToSearchParams(studioStateToModelState(state));
}

export function PortraitStudioProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [state, setLocalState] = useState<StudioState>(defaultState);

  const value = useMemo<StudioContextValue>(
    () => ({
      state,
      skinTones: skinToneOptions,
      hairColors: hairColorOptions,
      eyeColors: eyeColorOptions,
      lipColors: lipColorOptions,
      setState: (patch) =>
        setLocalState((current) => {
          const lastEditType = getPatchEditType(patch);

          return {
            ...current,
            ...patch,
            lastEditType: lastEditType ?? current.lastEditType
          };
        }),
      setLightingPreset: (lightingPreset) =>
        setLocalState((current) => ({
          ...current,
          lightingPreset,
          ...presetValues[lightingPreset]
        })),
      resetView: () => setLocalState(defaultState)
    }),
    [state]
  );

  return (
    <StudioContext.Provider value={value}>{children}</StudioContext.Provider>
  );
}

export function usePortraitStudio() {
  const context = useContext(StudioContext);

  if (!context) {
    throw new Error("usePortraitStudio must be used inside PortraitStudioProvider");
  }

  return context;
}

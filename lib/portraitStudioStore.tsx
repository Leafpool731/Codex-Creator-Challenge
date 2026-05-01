"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { LightingPreset, Undertone } from "@/components/portrait/featureMasks";
import {
  modelStateToSearchParams,
  skinToneOptions,
  type ModelState
} from "@/lib/modelState";

export type { LightingPreset, Undertone };

export interface StudioState {
  modelId: string;
  skinTone: string;
  undertone: Undertone;
  depth: number;
  saturation: number;
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
  depth: 50,
  saturation: 50,
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
      depth: 28,
      saturation: 32
    }
  },
  {
    ...portraitModels[1],
    state: {
      modelId: "model-02",
      skinTone: "fair",
      undertone: "warm",
      depth: 38,
      saturation: 48,
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
      depth: 50,
      saturation: 52
    }
  },
  {
    ...portraitModels[3],
    state: {
      modelId: "model-04",
      skinTone: "medium",
      undertone: "warm",
      depth: 55,
      saturation: 58
    }
  },
  {
    ...portraitModels[4],
    state: {
      modelId: "model-05",
      skinTone: "tan",
      undertone: "olive",
      depth: 58,
      saturation: 42,
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
      depth: 62,
      saturation: 58
    }
  },
  {
    ...portraitModels[6],
    state: {
      modelId: "model-07",
      skinTone: "deep",
      undertone: "neutral",
      depth: 68,
      saturation: 48
    }
  },
  {
    ...portraitModels[7],
    state: {
      modelId: "model-08",
      skinTone: "rich-deep",
      undertone: "cool",
      depth: 72,
      saturation: 44,
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
      depth: 78,
      saturation: 58,
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

export function studioStateToModelState(state: StudioState): ModelState {
  const skinToneMeta =
    skinToneOptions.find((o) => o.id === state.skinTone) ?? skinToneOptions[2];
  const fine = (state.depth - 50) / 100;
  const skinDepth = Math.max(
    0,
    Math.min(6, skinToneMeta.depth + fine * 0.45)
  );

  return {
    modelId: state.modelId,
    skinTone: state.skinTone,
    undertone: undertoneToNumber(state.undertone),
    skinDepth,
    chroma: state.saturation,
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
      setState: (patch) =>
        setLocalState((current) => ({
          ...current,
          ...patch
        })),
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

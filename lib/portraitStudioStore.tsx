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
  /** -50 rosy … +50 cool blue */
  rosyBlue: number;
  /** -50 golden … +50 olive */
  goldenOlive: number;
  /** -50 muted … +50 clear */
  mutedClear: number;
  /** -50 darker … +50 lighter (fine luminance) */
  skinFineDepth: number;
  contrast: number;
  lightingPreset: LightingPreset;
  lightIntensity: number;
  environment: number;
  warmth: number;
  /** When false, show the model image without skin/lighting overlays. */
  portraitOverlays: boolean;
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
  rosyBlue: 0,
  goldenOlive: 0,
  mutedClear: 0,
  skinFineDepth: 0,
  contrast: 50,
  lightingPreset: "daylight",
  lightIntensity: 72,
  environment: 68,
  warmth: 49,
  portraitOverlays: true
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
      rosyBlue: -8,
      goldenOlive: 0,
      mutedClear: -20,
      skinFineDepth: 0,
      contrast: 28
    }
  },
  {
    ...portraitModels[1],
    state: {
      modelId: "model-02",
      skinTone: "fair",
      undertone: "warm",
      depth: 38,
      rosyBlue: 0,
      goldenOlive: -14,
      mutedClear: -8,
      skinFineDepth: 0,
      contrast: 36,
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
      rosyBlue: 0,
      goldenOlive: 0,
      mutedClear: 0,
      skinFineDepth: 0,
      contrast: 50
    }
  },
  {
    ...portraitModels[3],
    state: {
      modelId: "model-04",
      skinTone: "medium",
      undertone: "warm",
      depth: 55,
      rosyBlue: 0,
      goldenOlive: -10,
      mutedClear: 18,
      skinFineDepth: 0,
      contrast: 54
    }
  },
  {
    ...portraitModels[4],
    state: {
      modelId: "model-05",
      skinTone: "tan",
      undertone: "olive",
      depth: 58,
      rosyBlue: 0,
      goldenOlive: 22,
      mutedClear: -14,
      skinFineDepth: 0,
      contrast: 42,
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
      rosyBlue: 0,
      goldenOlive: -12,
      mutedClear: 16,
      skinFineDepth: 0,
      contrast: 58
    }
  },
  {
    ...portraitModels[6],
    state: {
      modelId: "model-07",
      skinTone: "deep",
      undertone: "neutral",
      depth: 68,
      rosyBlue: 0,
      goldenOlive: 0,
      mutedClear: -6,
      skinFineDepth: 0,
      contrast: 62
    }
  },
  {
    ...portraitModels[7],
    state: {
      modelId: "model-08",
      skinTone: "rich-deep",
      undertone: "cool",
      depth: 72,
      rosyBlue: 6,
      goldenOlive: 0,
      mutedClear: -12,
      skinFineDepth: 0,
      contrast: 76,
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
      rosyBlue: 0,
      goldenOlive: -8,
      mutedClear: 20,
      skinFineDepth: 0,
      contrast: 82,
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
    rosyBlue: state.rosyBlue,
    goldenOlive: state.goldenOlive,
    mutedClear: state.mutedClear,
    skinFineDepth: state.skinFineDepth,
    contrast: state.contrast,
    lightingPreset: state.lightingPreset,
    lightIntensity: state.lightIntensity,
    environmentBrightness: state.environment,
    lightWarmth: state.warmth,
    portraitOverlays: state.portraitOverlays
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

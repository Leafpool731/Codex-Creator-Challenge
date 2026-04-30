"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type Undertone = "cool" | "neutral" | "warm" | "olive";
export type LightingPreset = "daylight" | "warm" | "cool" | "soft" | "evening";

export interface SkinToneOption {
  id: string;
  label: string;
  hex: string;
}

export interface StudioState {
  skinTone: string;
  undertone: Undertone;
  depth: number;
  saturation: number;
  freckles: number;
  blush: number;
  lipTint: number;
  lightingPreset: LightingPreset;
  lightIntensity: number;
  environment: number;
  warmth: number;
}

interface StudioContextValue {
  state: StudioState;
  skinTones: SkinToneOption[];
  setState: (patch: Partial<StudioState>) => void;
  setLightingPreset: (preset: LightingPreset) => void;
  resetView: () => void;
}

const skinTones: SkinToneOption[] = [
  { id: "porcelain", label: "Porcelain", hex: "#f3e6dc" },
  { id: "fair", label: "Fair", hex: "#efdccf" },
  { id: "light", label: "Light", hex: "#dfbea7" },
  { id: "medium", label: "Medium", hex: "#c59a77" },
  { id: "tan", label: "Tan", hex: "#ad7e59" },
  { id: "deep", label: "Deep", hex: "#855839" },
  { id: "rich-deep", label: "Rich deep", hex: "#5e3723" }
];

const defaultState: StudioState = {
  skinTone: "tan",
  undertone: "olive",
  depth: 58,
  saturation: 50,
  freckles: 25,
  blush: 35,
  lipTint: 40,
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

const StudioContext = createContext<StudioContextValue | null>(null);

export function PortraitStudioProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [state, setLocalState] = useState<StudioState>(defaultState);

  const value = useMemo<StudioContextValue>(
    () => ({
      state,
      skinTones,
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

export const quickLookOptions = [
  { id: "model-01", src: "/models/model-01.png", label: "Olive glow" },
  { id: "model-02", src: "/models/model-02.png", label: "Soft neutral" },
  { id: "model-03", src: "/models/model-03.png", label: "Warm copper" },
  { id: "model-04", src: "/models/model-04.png", label: "Cool contrast" }
];

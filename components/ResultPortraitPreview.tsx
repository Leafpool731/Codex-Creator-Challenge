"use client";

import { PortraitImage } from "@/components/portrait/PortraitImage";
import type { Undertone } from "@/components/portrait/PortraitOverlays";
import {
  eyeColorOptions,
  hairColorOptions,
  lipColorOptions,
  skinToneOptions,
  type ModelState
} from "@/lib/modelState";

interface ResultPortraitPreviewProps {
  state: ModelState;
}

function getHex<T extends { id: string; hex: string }>(
  options: T[],
  id: string
): string {
  return options.find((option) => option.id === id)?.hex ?? options[0].hex;
}

function numericUndertoneToMode(value: number): Undertone {
  if (value <= 28) {
    return "cool";
  }

  if (value >= 51 && value <= 53) {
    return "olive";
  }

  if (value >= 72) {
    return "warm";
  }

  return "neutral";
}

export function ResultPortraitPreview({ state }: ResultPortraitPreviewProps) {
  const depth = Math.round((state.skinDepth / 6) * 100);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#ddd2c9] bg-[#f2e8df] shadow-[0_24px_56px_rgba(85,63,50,0.12)]">
      <PortraitImage
        modelId={state.modelId}
        skinTone={getHex(skinToneOptions, state.skinTone)}
        undertone={numericUndertoneToMode(state.undertone)}
        depth={depth}
        saturation={state.chroma}
        blush={state.blush}
        freckles={state.freckles}
        hairColor={getHex(hairColorOptions, state.hairColor)}
        hairIntensity={state.hairIntensity}
        eyeColor={getHex(eyeColorOptions, state.eyeColor)}
        lipColor={getHex(lipColorOptions, state.lipColor)}
        lipTint={44}
        lightingPreset={state.lightingPreset}
        lightIntensity={state.lightIntensity}
        environment={state.environmentBrightness}
        warmth={state.lightWarmth}
        minHeightClassName="min-h-[28rem]"
      />
    </div>
  );
}

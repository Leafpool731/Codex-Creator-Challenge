"use client";

import { PortraitImage } from "@/components/portrait/PortraitImage";
import type { Undertone } from "@/components/portrait/PortraitOverlays";
import { skinToneOptions, type ModelState } from "@/lib/modelState";

interface ResultPortraitPreviewProps {
  state: ModelState;
}

function getHex(id: string): string {
  return skinToneOptions.find((option) => option.id === id)?.hex ?? skinToneOptions[0].hex;
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

/** Invert studio mapping: skinDepth ≈ band.depth + ((depthSlider - 50) / 100) * 0.45 */
function depthSliderFromModel(state: ModelState): number {
  const band =
    skinToneOptions.find((o) => o.id === state.skinTone) ?? skinToneOptions[2];
  const fine = (state.skinDepth - band.depth) / 0.45;
  return Math.round(Math.max(0, Math.min(100, 50 + fine * 100)));
}

export function ResultPortraitPreview({ state }: ResultPortraitPreviewProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#ddd2c9] bg-[#f2e8df] shadow-[0_24px_56px_rgba(85,63,50,0.12)]">
      <PortraitImage
        modelId={state.modelId}
        skinToneHex={getHex(state.skinTone)}
        undertone={numericUndertoneToMode(state.undertone)}
        depth={depthSliderFromModel(state)}
        saturation={state.chroma}
        lightingPreset={state.lightingPreset}
        lightIntensity={state.lightIntensity}
        environment={state.environmentBrightness}
        warmth={state.lightWarmth}
        minHeightClassName="min-h-[min(48vh,20rem)] sm:min-h-[24rem] lg:min-h-[28rem]"
      />
    </div>
  );
}

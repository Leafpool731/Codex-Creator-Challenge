"use client";

import { useMemo } from "react";
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
  const skinAdjustments = useMemo(
    () => ({
      rosyBlue: state.rosyBlue,
      goldenOlive: state.goldenOlive,
      mutedClear: state.mutedClear,
      depth: state.skinFineDepth
    }),
    [state.rosyBlue, state.goldenOlive, state.mutedClear, state.skinFineDepth]
  );

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#ddd2c9] bg-gradient-to-b from-[#F5EFEA] to-[#EFE7E2] shadow-[0_24px_56px_rgba(85,63,50,0.12)]">
      <div className="p-5 sm:p-7 md:p-8">
        <PortraitImage
          variant="results"
          modelId={state.modelId}
          skinToneHex={getHex(state.skinTone)}
          undertone={numericUndertoneToMode(state.undertone)}
          depth={depthSliderFromModel(state)}
          skinAdjustments={skinAdjustments}
          lightingPreset={state.lightingPreset}
          lightIntensity={state.lightIntensity}
          environment={state.environmentBrightness}
          warmth={state.lightWarmth}
          overlaysEnabled={state.portraitOverlays}
          fit="contain"
          minHeightClassName="min-h-[min(44vh,16rem)] sm:min-h-[20rem] md:min-h-[22rem]"
        />
      </div>
    </div>
  );
}

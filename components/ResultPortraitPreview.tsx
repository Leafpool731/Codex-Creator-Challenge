"use client";

import Image from "next/image";
import { useState } from "react";
import { PortraitOverlays, getPortraitFilter, type Undertone } from "@/components/PortraitOverlays";
import {
  eyeColorOptions,
  hairColorOptions,
  lipColorOptions,
  skinToneOptions,
  type ModelState
} from "@/lib/modelState";
import { getPortraitSrc } from "@/lib/portraitStudioStore";

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
  const [imageMissing, setImageMissing] = useState(false);
  const depth = Math.round((state.skinDepth / 6) * 100);
  const undertone = numericUndertoneToMode(state.undertone);
  const portraitFilter = getPortraitFilter({
    depth,
    saturation: state.chroma,
    lightingPreset: state.lightingPreset
  });

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#ddd2c9] bg-[#f2e8df] shadow-[0_24px_56px_rgba(85,63,50,0.12)]">
      <div className="relative aspect-[4/5] min-h-[28rem]">
        {imageMissing ? (
          <div className="grid h-full place-items-center p-8 text-center text-sm leading-6 text-[#6f635c]">
            Add realistic portraits to /public/models to enable the result preview.
          </div>
        ) : (
          <>
            <Image
              src={getPortraitSrc(state.modelId)}
              alt="Photorealistic portrait model"
              fill
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-cover object-top"
              style={{ filter: portraitFilter }}
              onError={() => setImageMissing(true)}
            />
            <PortraitOverlays
              skinTone={getHex(skinToneOptions, state.skinTone)}
              undertone={undertone}
              depth={depth}
              saturation={state.chroma}
              blush={state.blush}
              freckles={state.freckles}
              hairColor={getHex(hairColorOptions, state.hairColor)}
              eyeColor={getHex(eyeColorOptions, state.eyeColor)}
              lipColor={getHex(lipColorOptions, state.lipColor)}
              lipTint={44}
              lightingPreset={state.lightingPreset}
              lightIntensity={state.lightIntensity}
              environment={state.environmentBrightness}
              warmth={state.lightWarmth}
            />
          </>
        )}
      </div>
    </div>
  );
}

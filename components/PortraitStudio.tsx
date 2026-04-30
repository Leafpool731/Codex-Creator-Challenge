"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { LightingRail } from "@/components/LightingRail";
import { PortraitOverlays, getPortraitFilter } from "@/components/PortraitOverlays";
import { StudioControls } from "@/components/StudioControls";
import { getPortraitSrc, usePortraitStudio } from "@/lib/portraitStudioStore";

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function PortraitStudio() {
  const { state, resetView, skinTones, hairColors, eyeColors, lipColors } =
    usePortraitStudio();
  const [imageMissing, setImageMissing] = useState(false);
  const [showFullFrame, setShowFullFrame] = useState(false);
  const selectedTone =
    skinTones.find((tone) => tone.id === state.skinTone) ?? skinTones[2];
  const selectedHair =
    hairColors.find((tone) => tone.id === state.hairColor) ?? hairColors[0];
  const selectedEye =
    eyeColors.find((tone) => tone.id === state.eyeColor) ?? eyeColors[0];
  const selectedLip =
    lipColors.find((tone) => tone.id === state.lipColor) ?? lipColors[0];
  const portraitSrc = getPortraitSrc(state.modelId);
  const portraitFilter = getPortraitFilter({
    depth: state.depth,
    saturation: state.saturation,
    undertone: state.undertone,
    lightingPreset: state.lightingPreset
  });

  useEffect(() => {
    setImageMissing(false);
  }, [portraitSrc]);

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-[#ddd2c9] bg-[#f2e8df] shadow-[0_24px_56px_rgba(85,63,50,0.14)]">
        <LightingRail />
        <button
          type="button"
          onClick={resetView}
          className="absolute right-4 top-4 z-20 rounded-lg border border-[#dfd4ca] bg-white/82 px-3 py-2 text-xs font-medium text-[#3b322d] shadow-sm backdrop-blur transition hover:bg-white"
        >
          Reset view
        </button>

        <div className="relative aspect-[4/5] min-h-[32rem] lg:min-h-[42rem]">
          {imageMissing ? (
            <div className="grid h-full place-items-center p-8 text-center text-sm leading-6 text-[#6f635c]">
              Add realistic portraits to /public/models to enable the model studio.
            </div>
          ) : (
            <>
              <Image
                src={portraitSrc}
                alt="Photorealistic portrait model"
                fill
                priority
                sizes="(min-width: 1280px) 48vw, (min-width: 768px) 64vw, 100vw"
                className={showFullFrame ? "object-contain object-top" : "object-cover object-top"}
                style={{ filter: portraitFilter }}
                onError={() => setImageMissing(true)}
              />
              <PortraitOverlays
                skinTone={selectedTone.hex}
                undertone={state.undertone}
                depth={state.depth}
                saturation={state.saturation}
                blush={state.blush}
                freckles={state.freckles}
                hairColor={selectedHair.hex}
                eyeColor={selectedEye.hex}
                lipColor={selectedLip.hex}
                lipTint={state.lipTint}
                lightingPreset={state.lightingPreset}
                lightIntensity={state.lightIntensity}
                environment={state.environment}
                warmth={state.warmth}
              />
            </>
          )}
        </div>

        <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setShowFullFrame((current) => !current)}
            aria-label={showFullFrame ? "Use cropped portrait view" : "Preview full frame"}
            className="rounded-lg border border-[#dfd4ca] bg-white/82 px-2.5 py-2 text-[11px] font-semibold text-[#443a34] backdrop-blur transition hover:bg-white"
          >
            {showFullFrame ? "Crop" : "Full"}
          </button>
          <button
            type="button"
            onClick={resetView}
            aria-label="Reset preview"
            className="rounded-lg border border-[#dfd4ca] bg-white/82 px-2.5 py-2 text-[11px] font-semibold text-[#443a34] backdrop-blur transition hover:bg-white"
          >
            Reset
          </button>
        </div>

        <div className="absolute left-4 top-4 z-20 rounded-full border border-[#dfd4ca] bg-white/78 px-3 py-1 text-xs font-medium text-[#51443d] backdrop-blur">
          {titleCase(state.lightingPreset)}
        </div>
      </div>

      <StudioControls />
    </div>
  );
}

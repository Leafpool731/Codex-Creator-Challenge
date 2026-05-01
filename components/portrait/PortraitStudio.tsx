"use client";

import { useState } from "react";
import { LightingRail } from "@/components/LightingRail";
import { AIFeatureEditStatus } from "@/components/AIFeatureEditStatus";
import { PortraitImage } from "@/components/portrait/PortraitImage";
import { StudioControls } from "@/components/StudioControls";
import { usePortraitEditUi } from "@/hooks/PortraitEditUiContext";
import { usePortraitStudio } from "@/lib/portraitStudioStore";

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function PortraitStudio() {
  const portraitEdit = usePortraitEditUi();
  const { state, resetView, skinTones, hairColors, eyeColors, lipColors } =
    usePortraitStudio();
  const [showFullFrame, setShowFullFrame] = useState(false);
  const [showMasks, setShowMasks] = useState(false);
  const selectedTone =
    skinTones.find((tone) => tone.id === state.skinTone) ?? skinTones[2];
  const selectedHair =
    hairColors.find((tone) => tone.id === state.hairColor) ?? hairColors[0];
  const selectedEye =
    eyeColors.find((tone) => tone.id === state.eyeColor) ?? eyeColors[0];
  const selectedLip =
    lipColors.find((tone) => tone.id === state.lipColor) ?? lipColors[0];
  const refinedImageUrl = portraitEdit.aiRefined ? portraitEdit.imageUrl : undefined;

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-[#ddd2c9] bg-[#f2e8df] shadow-[0_24px_56px_rgba(85,63,50,0.14)]">
        <LightingRail />
        <div className="absolute right-4 top-4 z-20 flex flex-wrap justify-end gap-2">
          <AIFeatureEditStatus state={portraitEdit} />
          <button
            type="button"
            onClick={() => setShowMasks((current) => !current)}
            aria-pressed={showMasks}
            className="rounded-lg border border-[#dfd4ca] bg-white/82 px-3 py-2 text-xs font-medium text-[#3b322d] shadow-sm backdrop-blur transition hover:bg-white"
          >
            Debug masks
          </button>
          <button
            type="button"
            onClick={resetView}
            className="rounded-lg border border-[#dfd4ca] bg-white/82 px-3 py-2 text-xs font-medium text-[#3b322d] shadow-sm backdrop-blur transition hover:bg-white"
          >
            Reset view
          </button>
        </div>

        <PortraitImage
          modelId={state.modelId}
          skinTone={selectedTone.hex}
          undertone={state.undertone}
          depth={state.depth}
          saturation={state.saturation}
          blush={state.blush}
          freckles={state.freckles}
          hairColor={selectedHair.hex}
          hairIntensity={state.hairIntensity}
          eyeColor={selectedEye.hex}
          lipColor={selectedLip.hex}
          lipTint={state.lipTint}
          lightingPreset={state.lightingPreset}
          lightIntensity={state.lightIntensity}
          environment={state.environment}
          warmth={state.warmth}
          refinedImageUrl={refinedImageUrl}
          refinedEditType={portraitEdit.aiRefined ? portraitEdit.editType : undefined}
          showMasks={showMasks}
          fit={showFullFrame ? "contain" : "cover"}
          priority
        />

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

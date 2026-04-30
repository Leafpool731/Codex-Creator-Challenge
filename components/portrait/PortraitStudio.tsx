"use client";

import { useMemo, useState } from "react";
import { LightingRail } from "@/components/LightingRail";
import { AIGenerationStatus } from "@/components/portrait/AIGenerationStatus";
import { PortraitImage } from "@/components/portrait/PortraitImage";
import { StudioControls } from "@/components/StudioControls";
import { usePortraitEdit } from "@/hooks/usePortraitEdit";
import { PORTRAIT_BASE_IMAGE_VERSION } from "@/lib/cache/cacheKey";
import { getPortraitSrc, usePortraitStudio } from "@/lib/portraitStudioStore";
import type { ColorOption } from "@/lib/modelState";

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildEditRequest(
  state: ReturnType<typeof usePortraitStudio>["state"],
  selectedHair: ColorOption,
  selectedEye: ColorOption,
  selectedLip: ColorOption
) {
  if (!state.lastEditType) {
    return null;
  }

  const base = {
    modelId: state.modelId,
    baseImageVersion: PORTRAIT_BASE_IMAGE_VERSION,
    lightingPreset: state.lightingPreset,
    currentImageUrl: getPortraitSrc(state.modelId)
  };

  if (state.lastEditType === "hair") {
    return {
      ...base,
      editType: "hair" as const,
      valueName: selectedHair.label,
      valueHex: selectedHair.hex,
      intensity: state.hairIntensity
    };
  }

  if (state.lastEditType === "eyes") {
    return {
      ...base,
      editType: "eyes" as const,
      valueName: selectedEye.label,
      valueHex: selectedEye.hex,
      intensity: 75
    };
  }

  if (state.lastEditType === "lips") {
    return {
      ...base,
      editType: "lips" as const,
      valueName: selectedLip.label,
      valueHex: selectedLip.hex,
      intensity: state.lipTint
    };
  }

  if (state.lastEditType === "blush") {
    return {
      ...base,
      editType: "blush" as const,
      valueName: `${state.blush}`,
      valueHex: "#d36969",
      intensity: state.blush
    };
  }

  return {
    ...base,
    editType: "freckles" as const,
    valueName: `${state.freckles}`,
    valueHex: "#55321e",
    intensity: state.freckles
  };
}

export function PortraitStudio() {
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
  const editRequest = useMemo(
    () => buildEditRequest(state, selectedHair, selectedEye, selectedLip),
    [
      selectedEye,
      selectedHair,
      selectedLip,
      state.blush,
      state.freckles,
      state.hairIntensity,
      state.lastEditType,
      state.lightingPreset,
      state.lipTint,
      state.modelId
    ]
  );
  const portraitEdit = usePortraitEdit(editRequest, {
    enabled: Boolean(editRequest) && !showMasks
  });
  const refinedImageUrl = portraitEdit.aiRefined ? portraitEdit.imageUrl : undefined;

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-[#ddd2c9] bg-[#f2e8df] shadow-[0_24px_56px_rgba(85,63,50,0.14)]">
        <LightingRail />
        <div className="absolute right-4 top-4 z-20 flex flex-wrap justify-end gap-2">
          <AIGenerationStatus state={portraitEdit} />
          <button
            type="button"
            onClick={() => setShowMasks((current) => !current)}
            aria-pressed={showMasks}
            className="rounded-lg border border-[#dfd4ca] bg-white/82 px-3 py-2 text-xs font-medium text-[#3b322d] shadow-sm backdrop-blur transition hover:bg-white"
          >
            Show overlay masks
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

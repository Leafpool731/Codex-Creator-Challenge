import { PORTRAIT_BASE_IMAGE_VERSION } from "@/lib/cache/cacheKey";
import type { PortraitEditDescriptor } from "@/lib/cache/cacheKey";
import type { ColorOption } from "@/lib/modelState";
import { getPortraitSrc, type StudioState } from "@/lib/portraitStudioStore";

export function buildEditRequestFromStudio(
  state: StudioState,
  selectedHair: ColorOption,
  selectedEye: ColorOption,
  selectedLip: ColorOption
): PortraitEditDescriptor | null {
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

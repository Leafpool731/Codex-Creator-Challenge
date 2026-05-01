"use client";

import { useMemo } from "react";
import { CustomizationPanel } from "@/components/CustomizationPanel";
import { PortraitStudio } from "@/components/portrait/PortraitStudio";
import { usePortraitEdit } from "@/hooks/usePortraitEdit";
import { PortraitEditUiProvider } from "@/hooks/PortraitEditUiContext";
import { buildEditRequestFromStudio } from "@/lib/portrait/buildEditRequest";
import { usePortraitStudio } from "@/lib/portraitStudioStore";

export function ShadeSeasonStudioLayout() {
  const { state, hairColors, eyeColors, lipColors } = usePortraitStudio();
  const selectedHair =
    hairColors.find((tone) => tone.id === state.hairColor) ?? hairColors[0];
  const selectedEye =
    eyeColors.find((tone) => tone.id === state.eyeColor) ?? eyeColors[0];
  const selectedLip =
    lipColors.find((tone) => tone.id === state.lipColor) ?? lipColors[0];
  const editRequest = useMemo(
    () =>
      buildEditRequestFromStudio(state, selectedHair, selectedEye, selectedLip),
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
    enabled: Boolean(editRequest)
  });

  return (
    <PortraitEditUiProvider value={portraitEdit}>
      <>
        <PortraitStudio />
        <CustomizationPanel portraitEdit={portraitEdit} />
      </>
    </PortraitEditUiProvider>
  );
}

"use client";

import { CustomizationPanel } from "@/components/CustomizationPanel";
import { PortraitStudio } from "@/components/portrait/PortraitStudio";

// TODO: Reintroduce AI-based feature editing for:
// - hair (segmentation)
// - eyes (iris mask)
// - lips (cosmetic rendering)

export function ShadeSeasonStudioLayout() {
  return (
    <>
      <PortraitStudio />
      <CustomizationPanel />
    </>
  );
}

"use client";

import { useEffect } from "react";
import { preloadPortraitEdit } from "@/hooks/usePortraitEdit";
import { PORTRAIT_BASE_IMAGE_VERSION } from "@/lib/cache/cacheKey";
import type { LightingPresetId } from "@/lib/modelState";

interface ResultsPalettePreloaderProps {
  modelId: string;
  lightingPreset: LightingPresetId;
  lipColors: string[];
  blushColors: string[];
}

export function ResultsPalettePreloader({
  modelId,
  lightingPreset,
  lipColors,
  blushColors
}: ResultsPalettePreloaderProps) {
  useEffect(() => {
    lipColors.slice(0, 3).forEach((valueHex, index) => {
      preloadPortraitEdit({
        modelId,
        baseImageVersion: PORTRAIT_BASE_IMAGE_VERSION,
        editType: "lips",
        valueName: `recommended lip ${index + 1}`,
        valueHex,
        intensity: 75,
        lightingPreset,
        currentImageUrl: `/models/${modelId}.png`
      });
    });

    blushColors.slice(0, 2).forEach((valueHex, index) => {
      preloadPortraitEdit({
        modelId,
        baseImageVersion: PORTRAIT_BASE_IMAGE_VERSION,
        editType: "blush",
        valueName: `recommended blush ${index + 1}`,
        valueHex,
        intensity: index === 0 ? 50 : 75,
        lightingPreset,
        currentImageUrl: `/models/${modelId}.png`
      });
    });
  }, [blushColors, lightingPreset, lipColors, modelId]);

  return null;
}

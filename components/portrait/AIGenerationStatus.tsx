"use client";

import type { PortraitEditUiState } from "@/hooks/usePortraitEdit";

interface AIGenerationStatusProps {
  state: PortraitEditUiState;
}

export function AIGenerationStatus({ state }: AIGenerationStatusProps) {
  if (state.status === "idle") {
    return null;
  }

  const hairMaskNeeded =
    state.editType === "hair" &&
    state.status === "fallback" &&
    state.message?.toLowerCase().includes("hair mask needed");
  const label =
    hairMaskNeeded
      ? "Mask needed"
      : state.status === "optimistic"
        ? state.editType === "hair"
          ? "Preparing recolor"
          : "Instant preview"
      : state.status === "loading"
        ? state.editType === "hair"
          ? "Recoloring hair..."
          : "AI refining..."
        : state.aiRefined
          ? state.editType === "hair"
            ? "Hair refined"
            : "AI refined"
          : state.status === "error"
            ? "Preview only"
            : "CSS preview";

  const detail =
    hairMaskNeeded
      ? "Original"
      : state.status === "cached"
      ? state.source === "static"
        ? "Precomputed"
        : "Cached"
      : state.status === "refined"
        ? state.editType === "hair"
          ? "Pixel mask"
          : "Generated"
        : state.status === "loading"
          ? "Debounced"
          : state.status === "error"
            ? "No generated image"
            : "No wait";

  return (
    <div className="rounded-full border border-[#dfd4ca] bg-white/84 px-3 py-1.5 text-xs font-medium text-[#51443d] shadow-sm backdrop-blur">
      <span>{label}</span>
      <span className="mx-1 text-[#a89b91]">/</span>
      <span className="text-[#8b7d74]">{detail}</span>
    </div>
  );
}

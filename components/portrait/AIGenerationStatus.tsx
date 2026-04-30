"use client";

import type { PortraitEditUiState } from "@/hooks/usePortraitEdit";

interface AIGenerationStatusProps {
  state: PortraitEditUiState;
}

export function AIGenerationStatus({ state }: AIGenerationStatusProps) {
  if (state.status === "idle") {
    return null;
  }

  const label =
    state.status === "optimistic"
      ? "Instant preview"
      : state.status === "loading"
        ? "AI refining..."
        : state.aiRefined
          ? "AI refined"
          : state.status === "error"
            ? "Preview only"
            : "CSS preview";

  const detail =
    state.status === "cached"
      ? state.source === "static"
        ? "Precomputed"
        : "Cached"
      : state.status === "refined"
        ? "Generated"
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

"use client";

import { usePortraitStudio } from "@/lib/portraitStudioStore";

const presets: Array<{ id: "daylight" | "warm" | "cool" | "soft" | "evening"; label: string }> = [
  { id: "daylight", label: "Daylight" },
  { id: "warm", label: "Warm" },
  { id: "cool", label: "Cool" },
  { id: "soft", label: "Soft" },
  { id: "evening", label: "Evening" }
];

export function LightingRail() {
  const { state, setLightingPreset } = usePortraitStudio();

  return (
    <div className="absolute left-4 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-2 rounded-2xl border border-[#dfd4ca] bg-[#f7f2ec]/90 p-2 shadow-sm backdrop-blur">
      {presets.map((preset) => {
        const active = preset.id === state.lightingPreset;
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => setLightingPreset(preset.id)}
            className={`rounded-xl px-3 py-2 text-xs font-medium transition ${
              active
                ? "bg-[#f0e4d8] text-[#2f2723] shadow-sm"
                : "text-[#645750] hover:bg-white/70"
            }`}
          >
            {preset.label}
          </button>
        );
      })}
    </div>
  );
}

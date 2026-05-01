"use client";

import { lightingPresets, type LightingPresetId } from "@/lib/modelState";

interface LightingPresetRailProps {
  value: LightingPresetId;
  onChange: (value: LightingPresetId) => void;
}

export function LightingPresetRail({ value, onChange }: LightingPresetRailProps) {
  return (
    <nav
      aria-label="Lighting presets"
      className="absolute left-4 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-2"
    >
      {lightingPresets.map((preset) => {
        const active = value === preset.id;

        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onChange(preset.id)}
            className={`rounded-full border px-3 py-2 text-xs font-semibold shadow-sm backdrop-blur transition hover:-translate-y-0.5 ${
              active
                ? "border-[#7b4f47] bg-[#2e211e] text-[#fffaf4]"
                : "border-white/60 bg-white/70 text-stone-700 hover:border-[#a98276]"
            }`}
            aria-pressed={active}
            title={preset.description}
          >
            {preset.label}
          </button>
        );
      })}
    </nav>
  );
}

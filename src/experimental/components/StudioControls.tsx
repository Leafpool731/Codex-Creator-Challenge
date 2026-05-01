"use client";

import { SliderControl } from "@/components/SliderControl";
import { usePortraitStudio, type LightingPreset } from "@/lib/portraitStudioStore";

const lightingPresets: Array<{ id: LightingPreset; label: string }> = [
  { id: "daylight", label: "Daylight" },
  { id: "warm", label: "Warm" },
  { id: "cool", label: "Cool" },
  { id: "soft", label: "Soft" },
  { id: "evening", label: "Evening" }
];

export function StudioControls() {
  const { state, setState, setLightingPreset } = usePortraitStudio();

  return (
    <div className="grid gap-5 rounded-2xl border border-[#ded3ca] bg-[#f8f2ec] p-4 shadow-[0_12px_34px_rgba(85,63,50,0.09)] md:grid-cols-3">
      <div className="md:col-span-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#6b5e56]">
          Lighting preset
        </p>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Lighting preset">
          {lightingPresets.map((preset) => {
            const active = state.lightingPreset === preset.id;

            return (
              <button
                key={preset.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setLightingPreset(preset.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "border-[#3d322c] bg-[#2f2723] text-[#fff8f1]"
                    : "border-[#d9cec5] bg-white/80 text-[#51443d] hover:border-[#9f896d]"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>
      <SliderControl
        label="Light intensity"
        value={state.lightIntensity}
        onChange={(lightIntensity) => setState({ lightIntensity })}
        minLabel="Low"
        maxLabel="High"
      />
      <SliderControl
        label="Environment"
        value={state.environment}
        onChange={(environment) => setState({ environment })}
        minLabel="Low"
        maxLabel="High"
      />
      <SliderControl
        label="Warmth"
        value={state.warmth}
        onChange={(warmth) => setState({ warmth })}
        minLabel="Cool"
        maxLabel="Warm"
      />
    </div>
  );
}

"use client";

import { AttributeSlider } from "@/components/AttributeSlider";
import type { ModelState } from "@/lib/modelState";

interface StudioLightingControlsProps {
  state: ModelState;
  onChange: (patch: Partial<ModelState>) => void;
}

export function StudioLightingControls({
  state,
  onChange
}: StudioLightingControlsProps) {
  return (
    <div className="grid gap-4 rounded-2xl border border-white/70 bg-white/72 p-4 shadow-[0_18px_50px_rgba(87,64,53,0.12)] backdrop-blur md:grid-cols-3">
      <AttributeSlider
        id="light-intensity"
        label="Light intensity"
        minLabel="Dim"
        maxLabel="Bright"
        value={state.lightIntensity}
        onChange={(lightIntensity) => onChange({ lightIntensity })}
      />
      <AttributeSlider
        id="environment-brightness"
        label="Environment"
        minLabel="Low"
        maxLabel="Airy"
        value={state.environmentBrightness}
        onChange={(environmentBrightness) => onChange({ environmentBrightness })}
      />
      <AttributeSlider
        id="light-warmth"
        label="Warmth"
        minLabel="Cool"
        maxLabel="Warm"
        value={state.lightWarmth}
        onChange={(lightWarmth) => onChange({ lightWarmth })}
      />
    </div>
  );
}

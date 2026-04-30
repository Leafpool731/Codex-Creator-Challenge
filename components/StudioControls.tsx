"use client";

import { SliderControl } from "@/components/SliderControl";
import { usePortraitStudio } from "@/lib/portraitStudioStore";

export function StudioControls() {
  const { state, setState } = usePortraitStudio();

  return (
    <div className="grid gap-5 rounded-2xl border border-[#ded3ca] bg-[#f8f2ec] p-4 shadow-[0_12px_34px_rgba(85,63,50,0.09)] md:grid-cols-3">
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

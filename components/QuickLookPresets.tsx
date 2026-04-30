"use client";

import { RealisticModelPreview } from "@/components/RealisticModelPreview";
import {
  defaultModelState,
  quickLookPresets,
  type ModelState
} from "@/lib/modelState";

interface QuickLookPresetsProps {
  onSelect: (state: ModelState) => void;
}

export function QuickLookPresets({ onSelect }: QuickLookPresetsProps) {
  return (
    <section className="space-y-3" aria-labelledby="quick-look-heading">
      <h3 id="quick-look-heading" className="text-sm font-semibold text-stone-900">
        Quick look presets
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {quickLookPresets.map((preset) => {
          const state = { ...defaultModelState, ...preset.state };

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelect(state)}
              className="group overflow-hidden rounded-2xl border border-stone-200 bg-white/75 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#9b786f]"
            >
              <div className="h-28 overflow-hidden">
                <RealisticModelPreview state={state} compact />
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-stone-900">{preset.label}</p>
                <p className="mt-1 text-[11px] leading-4 text-stone-500">
                  {preset.note}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

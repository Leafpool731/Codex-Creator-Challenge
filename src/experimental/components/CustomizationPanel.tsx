"use client";

import Link from "next/link";
import { useMemo } from "react";
import { FineTuneSlider } from "@/components/FineTuneSlider";
import { QuickLooks } from "@/components/QuickLooks";
import { SegmentedControl } from "@/components/SegmentedControl";
import { SliderControl } from "@/components/SliderControl";
import {
  studioStateToSearchParams,
  usePortraitStudio,
  type Undertone
} from "@/lib/portraitStudioStore";

const undertoneOptions: Array<{ id: Undertone; label: string }> = [
  { id: "cool", label: "Cool" },
  { id: "neutral", label: "Neutral" },
  { id: "warm", label: "Warm" },
  { id: "olive", label: "Olive" }
];

export function CustomizationPanel() {
  const { state, setState, skinTones } = usePortraitStudio();
  const resultQuery = useMemo(() => studioStateToSearchParams(state), [state]);

  return (
    <aside className="rounded-2xl border border-[#ddd2c9] bg-[#fcf8f3]/96 p-4 shadow-[0_18px_44px_rgba(85,63,50,0.1)] backdrop-blur">
      <div className="border-b border-[#e1d7ce] pb-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#6b5e56]">Skin</p>
      </div>

      <div className="mt-4 space-y-5" role="region" aria-label="Skin tone controls">
        <div>
          <p className="mb-2 text-sm font-medium text-[#4f443f]">Skin depth</p>
          <p className="mb-3 text-xs text-[#897c74]">
            Matrix-driven base color — then fine-tune depth and undertone direction.
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-4">
            {skinTones.map((tone) => {
              const active = state.skinTone === tone.id;

              return (
                <button
                  key={tone.id}
                  type="button"
                  onClick={() => setState({ skinTone: tone.id })}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-2 text-center transition ${
                    active
                      ? "border-[#3d322c] bg-[#f5ebe3] ring-2 ring-[#d7cab8]"
                      : "border-[#e5dcd4] bg-white/70 hover:border-[#c4b5a8]"
                  }`}
                >
                  <span
                    className="h-9 w-9 shrink-0 rounded-full border-2 border-white/90 shadow-inner"
                    style={{ backgroundColor: tone.hex }}
                    aria-hidden
                  />
                  <span className="text-[11px] font-medium leading-tight text-[#3d322c]">
                    {tone.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-[#4f443f]">Undertone</p>
          <SegmentedControl
            value={state.undertone}
            options={undertoneOptions}
            onChange={(undertone) => setState({ undertone: undertone as Undertone })}
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-[#4f443f]">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-[#c4b5a8] accent-[#2f2723]"
            checked={state.portraitOverlays}
            onChange={(e) => setState({ portraitOverlays: e.target.checked })}
          />
          Preview overlay on model
        </label>

        <SliderControl
          label="Depth"
          value={state.depth}
          onChange={(depth) => setState({ depth })}
          minLabel="Lighter"
          maxLabel="Deeper"
        />

        <FineTuneSlider
          label="Rosy ↔ Cool Blue"
          minLabel="Rosy / flush"
          maxLabel="Cool blue"
          value={state.rosyBlue}
          onChange={(rosyBlue) => setState({ rosyBlue })}
        />
        <FineTuneSlider
          label="Golden ↔ Olive"
          minLabel="Golden warmth"
          maxLabel="Muted olive"
          value={state.goldenOlive}
          onChange={(goldenOlive) => setState({ goldenOlive })}
        />
        <FineTuneSlider
          label="Muted ↔ Clear"
          minLabel="Muted"
          maxLabel="Clear"
          value={state.mutedClear}
          onChange={(mutedClear) => setState({ mutedClear })}
        />
        <FineTuneSlider
          label="Fine lightness"
          minLabel="Slightly darker"
          maxLabel="Slightly lighter"
          value={state.skinFineDepth}
          onChange={(skinFineDepth) => setState({ skinFineDepth })}
        />
      </div>

      <div className="mt-6 border-t border-[#e1d7ce] pt-4">
        <QuickLooks />
        <Link
          href={`/results?${resultQuery}`}
          className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#2f2723] py-3 text-sm font-semibold text-[#fff8f1] shadow-[0_14px_34px_rgba(47,39,35,0.24)] transition hover:bg-[#463a33]"
        >
          Analyze My Season *
        </Link>
        <p className="mt-3 text-center text-xs text-[#897c74]">
          No upload required. Your choices stay private.
        </p>
      </div>
    </aside>
  );
}

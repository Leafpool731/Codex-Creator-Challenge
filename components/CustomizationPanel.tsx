"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { QuickLooks } from "@/components/QuickLooks";
import { SegmentedControl } from "@/components/SegmentedControl";
import { SliderControl } from "@/components/SliderControl";
import { SwatchSelector } from "@/components/SwatchSelector";
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

const tabs = ["Skin", "Hair", "Eyes", "Features"] as const;
type Tab = (typeof tabs)[number];

export function CustomizationPanel() {
  const {
    state,
    setState,
    skinTones,
    hairColors,
    eyeColors,
    lipColors
  } = usePortraitStudio();
  const [activeTab, setActiveTab] = useState<Tab>("Skin");
  const resultQuery = useMemo(() => studioStateToSearchParams(state), [state]);

  return (
    <aside className="rounded-2xl border border-[#ddd2c9] bg-[#fcf8f3]/96 p-4 shadow-[0_18px_44px_rgba(85,63,50,0.1)] backdrop-blur">
      <div className="grid grid-cols-4 border-b border-[#e1d7ce] pb-3" role="tablist">
        {tabs.map((tab) => {
          const active = tab === activeTab;

          return (
            <button
              type="button"
              key={tab}
              role="tab"
              aria-selected={active}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-xs font-medium transition ${
                active
                  ? "border-b-2 border-[#3d322c] text-[#2f2723]"
                  : "text-[#8f8178] hover:text-[#3d322c]"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div className="mt-4 min-h-[25rem] space-y-4" role="tabpanel">
        {activeTab === "Skin" ? (
          <>
            <div>
              <p className="mb-2 text-sm font-medium text-[#4f443f]">Skin tone</p>
              <SwatchSelector
                value={state.skinTone}
                options={skinTones}
                onChange={(skinTone) => setState({ skinTone })}
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-[#4f443f]">Undertone</p>
              <SegmentedControl
                value={state.undertone}
                options={undertoneOptions}
                onChange={(undertone) =>
                  setState({ undertone: undertone as Undertone })
                }
              />
            </div>

            <SliderControl
              label="Depth"
              value={state.depth}
              onChange={(depth) => setState({ depth })}
              minLabel="Fair"
              maxLabel="Deep"
            />
            <SliderControl
              label="Saturation"
              value={state.saturation}
              onChange={(saturation) => setState({ saturation })}
              minLabel="Muted"
              maxLabel="Vibrant"
            />
            <SliderControl
              label="Freckles"
              value={state.freckles}
              onChange={(freckles) => setState({ freckles })}
              minLabel="0%"
              maxLabel="100%"
            />
            <SliderControl
              label="Blush"
              value={state.blush}
              onChange={(blush) => setState({ blush })}
              minLabel="0%"
              maxLabel="100%"
            />
          </>
        ) : null}

        {activeTab === "Hair" ? (
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium text-[#4f443f]">Hair color</p>
              <SwatchSelector
                value={state.hairColor}
                options={hairColors}
                onChange={(hairColor) => setState({ hairColor })}
              />
            </div>
          </div>
        ) : null}

        {activeTab === "Eyes" ? (
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium text-[#4f443f]">Eye color</p>
              <SwatchSelector
                value={state.eyeColor}
                options={eyeColors}
                onChange={(eyeColor) => setState({ eyeColor })}
              />
            </div>
          </div>
        ) : null}

        {activeTab === "Features" ? (
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium text-[#4f443f]">Lip color</p>
              <SwatchSelector
                value={state.lipColor}
                options={lipColors}
                onChange={(lipColor) => setState({ lipColor })}
              />
            </div>
            <SliderControl
              label="Lip tint"
              value={state.lipTint}
              onChange={(lipTint) => setState({ lipTint })}
              minLabel="Bare"
              maxLabel="Tinted"
            />
            <SliderControl
              label="Freckles"
              value={state.freckles}
              onChange={(freckles) => setState({ freckles })}
              minLabel="0%"
              maxLabel="100%"
            />
            <SliderControl
              label="Blush"
              value={state.blush}
              onChange={(blush) => setState({ blush })}
              minLabel="0%"
              maxLabel="100%"
            />
          </div>
        ) : null}
      </div>

      <div className="mt-5 border-t border-[#e1d7ce] pt-4">
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

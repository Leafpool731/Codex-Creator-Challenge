"use client";

import { useState } from "react";
import { AttributeSlider } from "@/components/AttributeSlider";
import { ColorSwatchGroup } from "@/components/ColorSwatchGroup";
import { QuickLookPresets } from "@/components/QuickLookPresets";
import {
  eyeColorOptions,
  hairColorOptions,
  lipColorOptions,
  skinToneOptions,
  type ModelState
} from "@/lib/modelState";

type ControlTab = "skin" | "hair" | "eyes" | "features";

interface ModelControlsPanelProps {
  state: ModelState;
  onChange: (patch: Partial<ModelState>) => void;
  onReplace: (state: ModelState) => void;
  onAnalyze: () => void;
}

const tabs: Array<{ id: ControlTab; label: string }> = [
  { id: "skin", label: "Skin" },
  { id: "hair", label: "Hair" },
  { id: "eyes", label: "Eyes" },
  { id: "features", label: "Features" }
];

export function ModelControlsPanel({
  state,
  onChange,
  onReplace,
  onAnalyze
}: ModelControlsPanelProps) {
  const [activeTab, setActiveTab] = useState<ControlTab>("skin");

  function setSkinTone(skinTone: string) {
    const tone = skinToneOptions.find((option) => option.id === skinTone);
    onChange({
      skinTone,
      skinDepth: tone?.depth ?? state.skinDepth
    });
  }

  return (
    <aside className="rounded-[1.75rem] border border-white/70 bg-[#fffaf5]/86 p-4 shadow-[0_28px_80px_rgba(87,64,53,0.15)] backdrop-blur-xl lg:sticky lg:top-6">
      <div className="grid grid-cols-4 rounded-full bg-[#efe2da] p-1" role="tablist">
        {tabs.map((tab) => {
          const selected = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                selected
                  ? "bg-white text-stone-950 shadow-sm"
                  : "text-stone-600 hover:text-stone-950"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 min-h-[29rem] space-y-5">
        {activeTab === "skin" ? (
          <>
            <ColorSwatchGroup
              label="Skin tone"
              options={skinToneOptions}
              value={state.skinTone}
              onChange={setSkinTone}
            />
            <AttributeSlider
              id="undertone"
              label="Undertone"
              minLabel="Cool"
              maxLabel="Warm"
              value={state.undertone}
              onChange={(undertone) => onChange({ undertone })}
            />
            <AttributeSlider
              id="skin-depth"
              label="Depth"
              minLabel="Fair"
              maxLabel="Deep"
              value={state.skinDepth}
              min={0}
              max={6}
              step={0.25}
              onChange={(skinDepth) => onChange({ skinDepth })}
            />
            <AttributeSlider
              id="skin-saturation"
              label="Saturation"
              minLabel="Muted"
              maxLabel="Vibrant"
              value={state.chroma}
              onChange={(chroma) => onChange({ chroma })}
            />
            <AttributeSlider
              id="freckles"
              label="Freckles"
              minLabel="None"
              maxLabel="Defined"
              value={state.freckles}
              onChange={(freckles) => onChange({ freckles })}
            />
            <AttributeSlider
              id="blush"
              label="Blush"
              minLabel="Soft"
              maxLabel="Flushed"
              value={state.blush}
              onChange={(blush) => onChange({ blush })}
            />
          </>
        ) : null}

        {activeTab === "hair" ? (
          <>
            <ColorSwatchGroup
              label="Hair color"
              options={hairColorOptions}
              value={state.hairColor}
              onChange={(hairColor) => onChange({ hairColor })}
            />
            <div className="rounded-2xl border border-stone-200 bg-white/70 p-4 text-sm leading-6 text-stone-600">
              Hair depth and temperature feed the 16-season scoring engine,
              especially for contrast-sensitive Spring, Autumn, and Winter
              profiles.
            </div>
          </>
        ) : null}

        {activeTab === "eyes" ? (
          <>
            <ColorSwatchGroup
              label="Eye color"
              options={eyeColorOptions}
              value={state.eyeColor}
              onChange={(eyeColor) => onChange({ eyeColor })}
            />
            <div className="rounded-2xl border border-stone-200 bg-white/70 p-4 text-sm leading-6 text-stone-600">
              Eye clarity and depth contribute to chroma and contrast matching
              for the top season and alternates.
            </div>
          </>
        ) : null}

        {activeTab === "features" ? (
          <>
            <ColorSwatchGroup
              label="Lip color"
              options={lipColorOptions}
              value={state.lipColor}
              onChange={(lipColor) => onChange({ lipColor })}
            />
            <AttributeSlider
              id="feature-blush"
              label="Blush amount"
              minLabel="Soft"
              maxLabel="Flushed"
              value={state.blush}
              onChange={(blush) => onChange({ blush })}
            />
            <AttributeSlider
              id="feature-freckles"
              label="Freckles"
              minLabel="None"
              maxLabel="Defined"
              value={state.freckles}
              onChange={(freckles) => onChange({ freckles })}
            />
          </>
        ) : null}
      </div>

      <div className="mt-5 space-y-5 border-t border-stone-200 pt-5">
        <QuickLookPresets onSelect={onReplace} />
        <button
          type="button"
          onClick={onAnalyze}
          className="w-full rounded-full bg-[#2e211e] px-5 py-3 text-sm font-semibold text-[#fffaf4] shadow-[0_18px_44px_rgba(46,33,30,0.22)] transition hover:-translate-y-0.5 hover:bg-[#6f4b43]"
        >
          Analyze My Season
        </button>
      </div>
    </aside>
  );
}

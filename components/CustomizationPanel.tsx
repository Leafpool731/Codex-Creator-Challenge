"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FeatureEditor } from "@/components/FeatureEditor";
import { ModelSelector } from "@/components/ModelSelector";
import { QuickLooks } from "@/components/QuickLooks";
import { preloadPortraitEdit } from "@/hooks/usePortraitEdit";
import type { PortraitEditUiState } from "@/hooks/usePortraitEdit";
import { PORTRAIT_BASE_IMAGE_VERSION } from "@/lib/cache/cacheKey";
import {
  getPortraitSrc,
  studioStateToSearchParams,
  usePortraitStudio
} from "@/lib/portraitStudioStore";

const tabs = ["Skin", "Hair", "Eyes", "Features"] as const;
type Tab = (typeof tabs)[number];

interface CustomizationPanelProps {
  portraitEdit: PortraitEditUiState;
}

export function CustomizationPanel({ portraitEdit }: CustomizationPanelProps) {
  const { state, hairColors, eyeColors, lipColors } = usePortraitStudio();
  const [activeTab, setActiveTab] = useState<Tab>("Skin");
  const resultQuery = useMemo(() => studioStateToSearchParams(state), [state]);

  useEffect(() => {
    const base = {
      modelId: state.modelId,
      baseImageVersion: PORTRAIT_BASE_IMAGE_VERSION,
      lightingPreset: state.lightingPreset,
      currentImageUrl: getPortraitSrc(state.modelId)
    };

    if (activeTab === "Hair") {
      ["black", "espresso", "chestnut", "golden-blonde"]
        .map((id) => hairColors.find((option) => option.id === id))
        .filter((option): option is NonNullable<typeof option> => Boolean(option))
        .forEach((option) =>
          preloadPortraitEdit({
            ...base,
            editType: "hair",
            valueName: option.label,
            valueHex: option.hex,
            intensity: state.hairIntensity
          })
        );
    }

    if (activeTab === "Eyes") {
      ["brown", "hazel", "green", "clear-blue", "gray"]
        .map((id) => eyeColors.find((option) => option.id === id))
        .filter((option): option is NonNullable<typeof option> => Boolean(option))
        .forEach((option) =>
          preloadPortraitEdit({
            ...base,
            editType: "eyes",
            valueName: option.label,
            valueHex: option.hex,
            intensity: 75
          })
        );
    }

    if (activeTab === "Features") {
      ["rose-balm", "coral-gloss", "berry-veil"]
        .map((id) => lipColors.find((option) => option.id === id))
        .filter((option): option is NonNullable<typeof option> => Boolean(option))
        .forEach((option) =>
          preloadPortraitEdit({
            ...base,
            editType: "lips",
            valueName: option.label,
            valueHex: option.hex,
            intensity: state.lipTint
          })
        );
    }
  }, [
    activeTab,
    eyeColors,
    hairColors,
    lipColors,
    state.hairIntensity,
    state.lightingPreset,
    state.lipTint,
    state.modelId
  ]);

  return (
    <aside className="rounded-2xl border border-[#ddd2c9] bg-[#fcf8f3]/96 p-4 shadow-[0_18px_44px_rgba(85,63,50,0.1)] backdrop-blur">
      <ModelSelector />

      <div className="mt-5 grid grid-cols-4 border-b border-[#e1d7ce] pb-3" role="tablist">
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

      <div className="mt-4 min-h-[25rem]" role="tabpanel">
        <FeatureEditor activeTab={activeTab} aiState={portraitEdit} />
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

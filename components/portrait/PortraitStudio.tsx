"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { PortraitImage } from "@/components/portrait/PortraitImage";
import { usePortraitStudio } from "@/lib/portraitStudioStore";

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function PortraitStudio() {
  const t = useTranslations("portrait");
  const { state, resetView, skinTones } = usePortraitStudio();
  const [showFullFrame, setShowFullFrame] = useState(false);
  const selectedTone =
    skinTones.find((tone) => tone.id === state.skinTone) ?? skinTones[0];

  return (
    <div className="min-w-0 space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-[#ddd2c9] bg-[#f2e8df] shadow-[0_24px_56px_rgba(85,63,50,0.14)]">
        <div className="pointer-events-none absolute inset-x-2 top-2 z-20 flex flex-wrap items-start justify-between gap-2 sm:inset-x-4 sm:top-4">
          <div className="pointer-events-auto max-w-[min(100%,12rem)] rounded-full border border-[#dfd4ca] bg-white/78 px-2.5 py-1 text-[11px] font-medium text-[#51443d] backdrop-blur sm:max-w-none sm:px-3 sm:text-xs">
            {titleCase(state.lightingPreset)}
          </div>
          <button
            type="button"
            onClick={resetView}
            className="pointer-events-auto min-h-[44px] shrink-0 rounded-lg border border-[#dfd4ca] bg-white/82 px-3 py-2 text-xs font-medium text-[#3b322d] shadow-sm backdrop-blur transition hover:bg-white sm:min-h-0"
          >
            {t("resetView")}
          </button>
        </div>

        <PortraitImage
          modelId={state.modelId}
          skinToneHex={selectedTone.hex}
          undertone={state.undertone}
          depth={state.depth}
          saturation={state.saturation}
          lightingPreset={state.lightingPreset}
          lightIntensity={state.lightIntensity}
          environment={state.environment}
          warmth={state.warmth}
          fit={showFullFrame ? "contain" : "cover"}
          priority
        />

        <div className="absolute bottom-2 right-2 z-20 pb-[env(safe-area-inset-bottom)] sm:bottom-4 sm:right-4">
          <button
            type="button"
            onClick={() => setShowFullFrame((current) => !current)}
            aria-label={showFullFrame ? t("ariaCrop") : t("ariaFull")}
            className="min-h-[44px] min-w-[44px] rounded-lg border border-[#dfd4ca] bg-white/82 px-2.5 py-2 text-[11px] font-semibold text-[#443a34] backdrop-blur transition hover:bg-white sm:min-h-0 sm:min-w-0"
          >
            {showFullFrame ? t("crop") : t("full")}
          </button>
        </div>
      </div>
    </div>
  );
}

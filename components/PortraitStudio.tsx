"use client";

import Image from "next/image";
import { useState } from "react";
import { LightingRail } from "@/components/LightingRail";
import { PortraitOverlays } from "@/components/PortraitOverlays";
import { StudioControls } from "@/components/StudioControls";
import { usePortraitStudio } from "@/lib/portraitStudioStore";

export function PortraitStudio() {
  const { state, resetView } = usePortraitStudio();
  const [imageMissing, setImageMissing] = useState(false);

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-[#ddd2c9] bg-[#f2e8df] shadow-[0_24px_56px_rgba(85,63,50,0.14)]">
        <LightingRail />
        <button
          type="button"
          onClick={resetView}
          className="absolute right-4 top-4 z-20 rounded-lg border border-[#dfd4ca] bg-white/80 px-3 py-2 text-xs font-medium text-[#3b322d] backdrop-blur"
        >
          Reset view
        </button>

        <div className="relative aspect-[16/13]">
          {imageMissing ? (
            <div className="grid h-full place-items-center p-6 text-center text-sm text-[#6f635c]">
              Add portrait images to /public/models to enable realistic preview.
            </div>
          ) : (
            <>
              <Image
                src="/models/model-01.png"
                alt="Photorealistic portrait model"
                fill
                priority
                className="object-cover"
                onError={() => setImageMissing(true)}
              />
              <PortraitOverlays />
            </>
          )}
        </div>

        <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
          <button
            type="button"
            className="rounded-lg border border-[#dfd4ca] bg-white/80 px-2.5 py-2 text-xs text-[#443a34] backdrop-blur"
          >
            ⤢
          </button>
          <button
            type="button"
            onClick={resetView}
            className="rounded-lg border border-[#dfd4ca] bg-white/80 px-2.5 py-2 text-xs text-[#443a34] backdrop-blur"
          >
            ↺
          </button>
        </div>

        <div className="absolute left-4 top-4 z-20 rounded-full border border-[#dfd4ca] bg-white/78 px-3 py-1 text-xs font-medium text-[#51443d] backdrop-blur">
          {state.lightingPreset}
        </div>
      </div>

      <StudioControls />
    </div>
  );
}

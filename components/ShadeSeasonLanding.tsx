"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LightingPresetRail } from "@/components/LightingPresetRail";
import { ModelControlsPanel } from "@/components/ModelControlsPanel";
import { RealisticModelPreview } from "@/components/RealisticModelPreview";
import { SeasonFeatureCards } from "@/components/SeasonFeatureCards";
import { StudioLightingControls } from "@/components/StudioLightingControls";
import { getSeasonMatches } from "@/lib/scoring";
import {
  applyLightingPreset,
  defaultModelState,
  modelStateFromSearchParams,
  modelStateToSearchParams,
  modelStateToSelections,
  type LightingPresetId,
  type ModelState
} from "@/lib/modelState";

function ShadeSeasonLandingInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialState = useMemo(
    () => modelStateFromSearchParams(Object.fromEntries(searchParams.entries())),
    [searchParams]
  );
  const [modelState, setModelState] = useState<ModelState>(initialState);
  const selections = useMemo(() => modelStateToSelections(modelState), [modelState]);
  const matches = useMemo(() => getSeasonMatches(selections, 3), [selections]);
  const topMatch = matches[0];

  function updateModel(patch: Partial<ModelState>) {
    setModelState((current) => ({ ...current, ...patch }));
  }

  function chooseLightingPreset(presetId: LightingPresetId) {
    setModelState((current) => applyLightingPreset(current, presetId));
  }

  function resetLighting() {
    setModelState((current) => ({
      ...current,
      lightingPreset: defaultModelState.lightingPreset,
      lightIntensity: defaultModelState.lightIntensity,
      environmentBrightness: defaultModelState.environmentBrightness,
      lightWarmth: defaultModelState.lightWarmth
    }));
  }

  function analyze() {
    router.push(`/results?${modelStateToSearchParams(modelState)}`);
  }

  return (
    <section className="min-h-screen overflow-hidden bg-[linear-gradient(135deg,#fff9f2_0%,#f3e5dc_44%,#ead4ca_100%)] px-4 py-5 text-stone-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[92rem] gap-6 xl:grid-cols-[0.82fr_1.14fr_0.92fr]">
        <div className="flex flex-col gap-6 rounded-[2rem] border border-white/70 bg-white/40 p-5 shadow-[0_28px_80px_rgba(87,64,53,0.12)] backdrop-blur-xl sm:p-7">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-white/70 bg-white shadow-sm">
              <span className="h-5 w-5 rounded-full bg-[conic-gradient(from_180deg,#ead6cf,#caa291,#80665e,#ead6cf)]" />
            </span>
            <span className="text-lg font-semibold tracking-normal">ShadeSeason</span>
          </div>

          <div>
            <p className="inline-flex rounded-full border border-white/70 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-normal text-stone-600 shadow-sm">
              Image-free color analysis
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-normal text-stone-950 sm:text-5xl xl:text-6xl">
              Find your most flattering colors. No selfie required.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-stone-600">
              Customize a realistic editorial model, tune the studio lighting,
              and reveal your 16-season palette with transparent scoring.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row xl:flex-col 2xl:flex-row">
            <Link
              href="/studio"
              className="inline-flex items-center justify-center rounded-full bg-[#2e211e] px-5 py-3 text-sm font-semibold text-[#fffaf4] shadow-[0_18px_44px_rgba(46,33,30,0.2)] transition hover:-translate-y-0.5 hover:bg-[#6f4b43]"
            >
              Start analysis
            </Link>
            <Link
              href="/results"
              className="inline-flex items-center justify-center rounded-full border border-white/80 bg-white/60 px-5 py-3 text-sm font-semibold text-stone-900 shadow-sm transition hover:-translate-y-0.5 hover:border-[#b09187]"
            >
              View sample result
            </Link>
          </div>

          <SeasonFeatureCards />
        </div>

        <div className="space-y-4">
          <div className="relative">
            <LightingPresetRail
              value={modelState.lightingPreset}
              onChange={chooseLightingPreset}
            />
            <RealisticModelPreview
              state={modelState}
              onResetView={resetLighting}
            />
            <div className="pointer-events-none absolute bottom-5 left-5 right-5 z-20 flex items-end justify-between gap-4">
              <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-normal text-stone-500">
                  Live match
                </p>
                <p className="mt-1 text-lg font-semibold text-stone-950">
                  {topMatch.season.name}
                </p>
              </div>
              <div className="rounded-full border border-white/70 bg-white/72 px-4 py-2 text-sm font-semibold text-stone-800 shadow-sm backdrop-blur">
                {topMatch.percent}% fit
              </div>
            </div>
          </div>

          <StudioLightingControls state={modelState} onChange={updateModel} />
        </div>

        <ModelControlsPanel
          state={modelState}
          onChange={updateModel}
          onReplace={setModelState}
          onAnalyze={analyze}
        />
      </div>
    </section>
  );
}

export function ShadeSeasonLanding() {
  return (
    <Suspense
      fallback={
        <section className="min-h-screen bg-[#fff9f2] px-6 py-8">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/70 bg-white/60 p-8 shadow-[0_28px_80px_rgba(87,64,53,0.12)]">
            <p className="text-sm font-semibold text-stone-700">Loading studio...</p>
          </div>
        </section>
      }
    >
      <ShadeSeasonLandingInner />
    </Suspense>
  );
}

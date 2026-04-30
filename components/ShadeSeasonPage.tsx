"use client";

import Link from "next/link";
import { CustomizationPanel } from "@/components/CustomizationPanel";
import { FeatureCard } from "@/components/FeatureCard";
import { PortraitStudio } from "@/components/PortraitStudio";
import { PortraitStudioProvider } from "@/lib/portraitStudioStore";

export function ShadeSeasonPage() {
  return (
    <PortraitStudioProvider>
      <main className="min-h-screen bg-[linear-gradient(130deg,#fbf5ef_0%,#f4e8dd_52%,#efddd0_100%)] px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-[92rem] gap-5 xl:grid-cols-[0.88fr_1.24fr_0.98fr]">
          <section className="rounded-2xl border border-[#e2d7ce] bg-[#fbf7f1]/94 p-5 shadow-[0_24px_60px_rgba(85,63,50,0.09)]">
            <p className="text-[2rem] font-medium leading-none text-[#2f2723]">
              <span className="[font-family:Georgia,Times,serif]">ShadeSeason</span> ✦
            </p>
            <p className="mt-3 inline-flex rounded-full border border-[#e2d7ce] bg-[#f5eee8] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#756860]">
              Image-free color analysis
            </p>

            <h1 className="mt-6 text-[2.8rem] leading-[1.02] text-[#2f2723] [font-family:Georgia,Times,serif]">
              Find your most flattering colors.
            </h1>
            <p className="mt-1 text-[2.35rem] italic leading-[1.02] text-[#7f7066] [font-family:Georgia,Times,serif]">
              No selfie required.
            </p>

            <p className="mt-5 max-w-[24rem] text-[15px] leading-7 text-[#6f625a]">
              Customize a realistic model, tune the lighting, and discover your
              16-season palette with transparent, science-backed results.
            </p>

            <div className="mt-6 space-y-2">
              <Link
                href="/studio"
                className="flex w-fit items-center gap-2 rounded-xl bg-[#2f2723] px-5 py-3 text-sm font-semibold text-[#fff8f1] shadow-[0_16px_36px_rgba(47,39,35,0.25)]"
              >
                Start analysis <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/results"
                className="inline-flex rounded-xl border border-[#ddd2c9] bg-[#f7efe8] px-5 py-3 text-sm font-semibold text-[#3f3530]"
              >
                View sample result
              </Link>
            </div>

            <div className="mt-6 space-y-3">
              <FeatureCard
                title="16-Season System"
                description="Detailed analysis across all 16 seasons"
              />
              <FeatureCard
                title="Transparent Scoring"
                description="Understand why your results are a match"
              />
              <FeatureCard
                title="Personalized Recommendations"
                description="Colors, makeup, hair, and jewelry for you"
              />
            </div>
          </section>

          <PortraitStudio />
          <CustomizationPanel />
        </div>
      </main>
    </PortraitStudioProvider>
  );
}

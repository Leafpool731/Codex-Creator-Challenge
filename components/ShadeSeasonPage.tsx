"use client";

import Link from "next/link";
import { CustomizationPanel } from "@/components/CustomizationPanel";
import { FeatureCard } from "@/components/FeatureCard";
import { PortraitStudio } from "@/components/portrait/PortraitStudio";
import { PortraitStudioProvider } from "@/lib/portraitStudioStore";

export function ShadeSeasonPage() {
  return (
    <PortraitStudioProvider>
      <main className="min-h-screen bg-[linear-gradient(130deg,#fff9f3_0%,#f6ebe2_52%,#ecd9cf_100%)] px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-[94rem] gap-5 xl:grid-cols-[0.82fr_1.34fr_0.98fr]">
          <section className="flex min-h-full flex-col px-1 py-2 sm:px-3 lg:py-5">
            <p className="text-[2rem] font-medium leading-none text-[#2f2723]">
              <span className="[font-family:Georgia,Times,serif]">ShadeSeason</span> *
            </p>
            <p className="mt-3 inline-flex rounded-full border border-[#e2d7ce] bg-[#f5eee8] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#756860]">
              IMAGE-FREE COLOR ANALYSIS
            </p>

            <h1 className="mt-6 text-[2.8rem] leading-[1.02] text-[#2f2723] [font-family:Georgia,Times,serif]">
              Find your most flattering colors.
            </h1>
            <p className="mt-1 text-[2.35rem] italic leading-[1.02] text-[#8f776d] [font-family:Georgia,Times,serif]">
              No selfie required.
            </p>

            <p className="mt-5 max-w-[24rem] text-[15px] leading-7 text-[#6f625a]">
              Customize a realistic model, tune the lighting, and discover your
              16-season palette with transparent, science-backed results.
            </p>

            <div className="mt-6 space-y-2">
              <Link
                href="/studio"
                className="flex w-fit items-center gap-2 rounded-xl bg-[#2f2723] px-5 py-3 text-sm font-semibold text-[#fff8f1] shadow-[0_16px_36px_rgba(47,39,35,0.25)] transition hover:bg-[#463a33]"
              >
                Start analysis <span aria-hidden="true">-&gt;</span>
              </Link>
              <Link
                href="/results"
                className="inline-flex rounded-xl border border-[#ddd2c9] bg-[#f7efe8] px-5 py-3 text-sm font-semibold text-[#3f3530] shadow-sm transition hover:bg-white/80"
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

            <p className="mt-auto pt-8 text-xs text-[#9a8e86]">
              (c) 2026 ShadeSeason
            </p>
          </section>

          <PortraitStudio />
          <CustomizationPanel />
        </div>
      </main>
    </PortraitStudioProvider>
  );
}

"use client";

import Link from "next/link";
import { FeatureCard } from "@/components/FeatureCard";
import { ShadeSeasonStudioLayout } from "@/components/ShadeSeasonStudioLayout";
import { PortraitStudioProvider } from "@/lib/portraitStudioStore";

export function ShadeSeasonPage() {
  return (
    <PortraitStudioProvider>
      <main className="min-h-dvh bg-[linear-gradient(130deg,#fffaf5_0%,#f8eee7_52%,#ecdcd2_100%)] px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto grid w-full min-w-0 max-w-[112rem] gap-8 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)_minmax(0,0.95fr)]">
          <section className="flex min-h-full min-w-0 max-w-xl flex-col px-1 py-2 sm:px-3 lg:py-8">
            <p className="text-3xl font-medium leading-none text-[#2f2723] sm:text-[2.35rem]">
              <span className="[font-family:Georgia,Times,serif]">ShadeSeason</span> *
            </p>
            <p className="mt-6 inline-flex w-fit rounded-full border border-[#e2d7ce] bg-[#f5eee8] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#756860]">
              IMAGE-FREE COLOR ANALYSIS
            </p>

            <h1 className="mt-8 text-3xl leading-tight text-[#2f2723] [font-family:Georgia,Times,serif] sm:mt-12 sm:text-4xl lg:text-5xl">
              Find your most flattering colors.
              <span className="block italic text-[#8f776d]">No selfie required.</span>
            </h1>

            <p className="mt-8 max-w-xl text-base leading-relaxed text-[#6f625a]">
              Choose a photorealistic model anchor, refine your skin profile, and
              discover a 16-season palette with transparent rule-based scoring.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Link
                href="/studio"
                className="flex w-fit items-center gap-3 rounded-2xl bg-[#2f2723] px-6 py-4 text-base font-semibold text-[#fff8f1] shadow-[0_16px_36px_rgba(47,39,35,0.25)] transition hover:bg-[#463a33]"
              >
                Start analysis <span aria-hidden="true">-&gt;</span>
              </Link>
              <Link
                href="/results"
                className="inline-flex w-fit rounded-2xl border border-[#ddd2c9] bg-[#f7efe8] px-6 py-4 text-base font-semibold text-[#3f3530] shadow-sm transition hover:bg-white/80"
              >
                View sample result
              </Link>
            </div>

            <div className="mt-12 grid gap-4">
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

            <p className="mt-auto pt-16 text-xs text-[#9a8e86]">
              (c) 2026 ShadeSeason
            </p>
          </section>

          <div className="min-w-0 xl:contents">
            <ShadeSeasonStudioLayout />
          </div>
        </div>
      </main>
    </PortraitStudioProvider>
  );
}

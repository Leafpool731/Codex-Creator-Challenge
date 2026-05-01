import Link from "next/link";
import type { ReactNode } from "react";
import type { SeasonScore } from "@/lib/types";
import { PaletteSwatches } from "@/components/PaletteSwatches";
import { SeasonPaletteGrid } from "@/components/SeasonPaletteGrid";
import {
  describeConfidenceBand,
  formatConfidenceDisclaimer
} from "@/lib/engines/seasonScoringEngine";

interface SeasonResultsProps {
  topMatch: SeasonScore;
  alternateMatches: SeasonScore[];
  explanation: string;
  studioQuery: string;
  portraitSlot?: ReactNode;
}

export function SeasonResults({
  topMatch,
  alternateMatches,
  explanation,
  studioQuery,
  portraitSlot
}: SeasonResultsProps) {
  return (
    <div className="space-y-8">
      <section className="glass-panel rounded-2xl p-5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-teal">
              Top season match
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-normal text-ink sm:text-5xl">
              {topMatch.season.name}
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-ink/70">
              {topMatch.season.headline}
            </p>
            <p className="mt-4 text-sm leading-7 text-ink/60">{formatConfidenceDisclaimer()}</p>
            <p className="mt-2 text-sm font-medium text-ink/75">
              {describeConfidenceBand(topMatch.percent)}
            </p>
          </div>
          <div className="rounded-xl border border-ink/10 bg-white px-5 py-4 text-center shadow-sm">
            <p className="text-3xl font-semibold text-ink">{topMatch.percent}%</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-normal text-ink/50">
              Rule fit
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          {portraitSlot ? <div>{portraitSlot}</div> : null}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-ink">Color palette</h2>
              <div className="mt-3">
                <PaletteSwatches palette={topMatch.season.palette} />
              </div>
            </div>
            <div className="rounded-xl border border-ink/10 bg-white/75 p-4">
              <h2 className="text-lg font-semibold text-ink">Why this result</h2>
              <p className="mt-3 text-sm leading-7 text-ink/70">{explanation}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-2xl p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-ink">Alternate seasons</h2>
        <div className="mt-4 grid gap-3">
          {alternateMatches.map((match) => (
            <article
              key={match.season.id}
              className="rounded-xl border border-ink/10 bg-white/80 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-ink">{match.season.name}</h3>
                  <p className="mt-1 text-sm leading-6 text-ink/60">{match.season.headline}</p>
                </div>
                <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-paper">
                  {match.percent}%
                </span>
              </div>
              <div className="mt-3">
                <PaletteSwatches palette={match.season.palette.slice(0, 4)} compact />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="glass-panel rounded-2xl p-5 sm:p-6">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-ink">Full cosmetic grid</h2>
            <p className="mt-1 text-sm text-ink/60">
              Contour browns, blush and lips, eyeshadow, and bold accents (64 swatches).
            </p>
          </div>
          <Link
            href={`/studio?${studioQuery}`}
            className="inline-flex items-center justify-center rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm transition hover:border-teal/40"
          >
            Refine model
          </Link>
        </div>
        <SeasonPaletteGrid seasonName={topMatch.season.name} />
      </section>
    </div>
  );
}

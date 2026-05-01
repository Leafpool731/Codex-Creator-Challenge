import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { CosmeticPalette } from "@/components/CosmeticPalette";
import { PaletteSwatches } from "@/components/PaletteSwatches";
import { ResultPortraitPreview } from "@/components/ResultPortraitPreview";
import { SeasonScoringEngine } from "@/components/SeasonScoringEngine";
import {
  getSelectionLabels,
  normalizeSelections
} from "@/lib/attributes";
import {
  modelStateFromSearchParams,
  modelStateToSearchParams,
  modelStateToSelections
} from "@/lib/modelState";
import { formatConfidenceDisclaimer } from "@/lib/engines/seasonScoringEngine";
import { buildResultExplanation, getSeasonMatches } from "@/lib/scoring";
import type { AttributeKey } from "@/lib/types";

interface ResultsPageProps {
  searchParams: Promise<Partial<Record<AttributeKey, string | string[] | undefined>>>;
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const resolvedSearchParams = await searchParams;
  const modelState = modelStateFromSearchParams(resolvedSearchParams);
  const selections = normalizeSelections({
    ...resolvedSearchParams,
    ...modelStateToSelections(modelState)
  });
  const [topMatch, ...alternateMatches] = getSeasonMatches(selections, 3);
  const query = modelStateToSearchParams(modelState);
  return (
    <main className="min-h-dvh bg-paper pb-[max(2rem,env(safe-area-inset-bottom))]">
      <AppHeader />

      <section className="mx-auto max-w-7xl px-4 pb-14 pt-5 sm:px-8 sm:pb-20 sm:pt-8">
        <div className="grid min-w-0 gap-10 lg:grid-cols-[1fr_0.82fr] lg:gap-12">
          <div className="glass-panel min-w-0 rounded-2xl p-5 sm:p-8 lg:p-10">
            <div className="flex min-w-0 flex-col gap-8 sm:flex-row sm:items-start sm:justify-between sm:gap-10">
              <div className="min-w-0 space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-teal sm:text-sm">
                  Top season match
                </p>
                <h1 className="pt-2 text-3xl font-semibold leading-[1.15] tracking-tight text-ink sm:text-4xl lg:text-5xl">
                  {topMatch.season.name}
                </h1>
                <p className="max-w-2xl pt-4 text-base leading-relaxed text-ink/70 sm:text-lg sm:leading-8">
                  {topMatch.season.headline}
                </p>
              </div>
              <div className="shrink-0 rounded-2xl border border-ink/10 bg-white px-5 py-5 text-center shadow-sm sm:min-w-[10.5rem] sm:px-6 sm:py-6">
                <p className="text-3xl font-semibold tabular-nums tracking-tight text-ink sm:text-4xl">
                  {topMatch.percent}%
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-ink/50">
                  Rule fit
                </p>
                <p className="mt-4 max-w-[15rem] text-left text-xs leading-relaxed text-ink/55">
                  {formatConfidenceDisclaimer()}
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
              <div className="min-w-0">
                <ResultPortraitPreview state={modelState} />
              </div>
              <div className="flex min-w-0 flex-col gap-10">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">
                    Color palette
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-ink/55">
                    Signature hues for your season.
                  </p>
                  <div className="mt-6">
                    <PaletteSwatches palette={topMatch.season.palette} />
                  </div>
                </div>
                <div className="rounded-2xl border border-ink/10 bg-white/80 p-5 sm:p-6">
                  <h2 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">
                    Why this season
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-ink/70 sm:text-base sm:leading-7">
                    {buildResultExplanation(topMatch)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-8">
            <div className="glass-panel rounded-2xl p-6 sm:p-8">
              <h2 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">
                Alternate seasons
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-ink/55">
                Close runners-up from the same analysis.
              </p>
              <div className="mt-6 flex flex-col gap-5">
                {alternateMatches.map((match) => (
                  <article
                    key={match.season.id}
                    className="rounded-2xl border border-ink/10 bg-white/85 p-5 shadow-[0_2px_16px_rgba(23,19,19,0.05)] sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 space-y-2">
                        <h3 className="font-semibold leading-snug text-ink">{match.season.name}</h3>
                        <p className="text-sm leading-relaxed text-ink/60">
                          {match.season.headline}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-ink px-3.5 py-1.5 text-xs font-semibold tabular-nums text-paper">
                        {match.percent}%
                      </span>
                    </div>
                    <div className="mt-5">
                      <PaletteSwatches palette={match.season.palette.slice(0, 4)} compact />
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6 sm:p-8">
              <h2 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">Makeup</h2>
              <div className="mt-6 flex flex-col gap-6">
                {[
                  ["Lips", topMatch.season.makeup.lips],
                  ["Cheeks", topMatch.season.makeup.cheeks],
                  ["Eyes", topMatch.season.makeup.eyes],
                  ["Avoid", topMatch.season.makeup.avoid]
                ].map(([label, items]) => (
                  <div key={label as string} className="border-t border-ink/10 pt-6 first:border-t-0 first:pt-0">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-ink/45">
                      {label as string}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-ink/75 sm:text-[15px] sm:leading-7">
                      {(items as string[]).join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6 sm:p-8">
              <h2 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">Jewelry</h2>
              <p className="mt-4 text-sm leading-relaxed text-ink/70 sm:text-base sm:leading-7">
                {topMatch.season.jewelry}
              </p>
            </div>
          </aside>
        </div>

        <section className="glass-panel mt-10 rounded-2xl p-6 sm:mt-12 sm:p-8">
          <CosmeticPalette seasonName={topMatch.season.name} />
        </section>

        <div className="mt-10 grid gap-8 sm:mt-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
          <section className="glass-panel rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">
              Selected attributes
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-ink/55">
              Values passed into the scoring engine.
            </p>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {getSelectionLabels(selections).map((item) => (
                <div
                  key={item.key}
                  className="rounded-xl border border-ink/10 bg-white/80 px-4 py-4 sm:px-5 sm:py-5"
                >
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink/45">
                    {item.label}
                  </dt>
                  <dd className="mt-2 text-sm font-semibold leading-snug text-ink sm:text-[15px]">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="glass-panel rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">
                  Score detail
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-ink/60">
                  The same engine scored all 16 seasonal profiles.
                </p>
              </div>
              <Link
                href={`/studio?${query}`}
                className="inline-flex shrink-0 items-center justify-center rounded-full border border-ink/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink shadow-sm transition hover:border-teal/40"
              >
                Refine model
              </Link>
            </div>
            <div className="mt-8 border-t border-ink/10 pt-8">
              <SeasonScoringEngine items={topMatch.breakdown} />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

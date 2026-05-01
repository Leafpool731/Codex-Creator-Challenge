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
    <main className="min-h-screen bg-paper">
      <AppHeader />

      <section className="mx-auto max-w-7xl px-5 pb-16 pt-6 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.82fr]">
          <div className="glass-panel rounded-2xl p-5 sm:p-7">
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
              </div>
              <div className="rounded-xl border border-ink/10 bg-white px-5 py-4 text-center shadow-sm">
                <p className="text-3xl font-semibold text-ink">{topMatch.percent}%</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-normal text-ink/50">
                  Rule fit
                </p>
                <p className="mt-3 max-w-[14rem] text-left text-[11px] leading-5 text-ink/55">
                  {formatConfidenceDisclaimer()}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div>
                <ResultPortraitPreview state={modelState} />
              </div>
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-ink">Color palette</h2>
                  <div className="mt-3">
                    <PaletteSwatches palette={topMatch.season.palette} />
                  </div>
                </div>
                <div className="rounded-xl border border-ink/10 bg-white/75 p-4">
                  <h2 className="text-lg font-semibold text-ink">Why this season</h2>
                  <p className="mt-3 text-sm leading-7 text-ink/70">
                    {buildResultExplanation(topMatch)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="glass-panel rounded-2xl p-5 sm:p-6">
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
                        <p className="mt-1 text-sm leading-6 text-ink/60">
                          {match.season.headline}
                        </p>
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
            </div>

            <div className="glass-panel rounded-2xl p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-ink">Makeup</h2>
              <div className="mt-4 grid gap-4">
                {[
                  ["Lips", topMatch.season.makeup.lips],
                  ["Cheeks", topMatch.season.makeup.cheeks],
                  ["Eyes", topMatch.season.makeup.eyes],
                  ["Avoid", topMatch.season.makeup.avoid]
                ].map(([label, items]) => (
                  <div key={label as string}>
                    <h3 className="text-sm font-semibold uppercase tracking-normal text-ink/50">
                      {label as string}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-ink/70">
                      {(items as string[]).join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-ink">Jewelry</h2>
              <p className="mt-3 text-sm leading-7 text-ink/70">
                {topMatch.season.jewelry}
              </p>
            </div>
          </aside>
        </div>

        <section className="glass-panel mt-8 rounded-2xl p-5 sm:p-6">
          <CosmeticPalette seasonName={topMatch.season.name} />
        </section>

        <div className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="glass-panel rounded-2xl p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-ink">Selected attributes</h2>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {getSelectionLabels(selections).map((item) => (
                <div
                  key={item.key}
                  className="rounded-lg border border-ink/10 bg-white/75 p-3"
                >
                  <dt className="text-xs font-semibold uppercase tracking-normal text-ink/50">
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-ink">{item.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="glass-panel rounded-2xl p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-ink">Score detail</h2>
                <p className="mt-2 text-sm leading-6 text-ink/60">
                  The same engine scored all 16 seasonal profiles.
                </p>
              </div>
              <Link
                href={`/studio?${query}`}
                className="inline-flex items-center justify-center rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm transition hover:border-teal/40"
              >
                Refine model
              </Link>
            </div>
            <div className="mt-5">
              <SeasonScoringEngine items={topMatch.breakdown} />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AppHeader } from "@/components/AppHeader";
import { CosmeticPalette } from "@/components/CosmeticPalette";
import { PaletteSwatches } from "@/components/PaletteSwatches";
import { ResultPortraitPreview } from "@/components/ResultPortraitPreview";
import { SeasonScoringEngine } from "@/components/SeasonScoringEngine";
import {
  attributeOrder,
  getAttributeGroup,
  getAttributeOption,
  normalizeSelections
} from "@/lib/attributes";
import {
  modelStateFromSearchParams,
  modelStateToSearchParams,
  modelStateToSelections
} from "@/lib/modelState";
import { buildResultExplanation, getSeasonMatches } from "@/lib/scoring";
import type { AttributeKey } from "@/lib/types";
import { Link } from "@/i18n/navigation";
import { buildLanguageAlternates, canonicalUrl } from "@/lib/seo/alternates";

interface ResultsPageProps {
  searchParams: Promise<Partial<Record<AttributeKey, string | string[] | undefined>>>;
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const canonical = canonicalUrl(locale, "/results");

  return {
    title: t("resultsTitle"),
    description: t("resultsDescription"),
    robots: {
      index: false,
      follow: true,
      googleBot: { index: false, follow: true }
    },
    alternates: {
      canonical,
      languages: buildLanguageAlternates("/results").languages
    },
    openGraph: {
      title: t("resultsTitle"),
      description: t("resultsDescription"),
      url: canonical,
      type: "website"
    },
    twitter: {
      title: t("resultsTitle"),
      description: t("resultsDescription")
    }
  };
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations("results");
  const tAttr = await getTranslations("attributes");
  const tScoring = await getTranslations("scoring");

  const modelState = modelStateFromSearchParams(resolvedSearchParams);
  const selections = normalizeSelections({
    ...resolvedSearchParams,
    ...modelStateToSelections(modelState)
  });
  const [topMatch, ...alternateMatches] = getSeasonMatches(selections, 3);
  const query = modelStateToSearchParams(modelState);

  const selectionRows = attributeOrder.map((key) => {
    const optionId = selections[key];
    const fallbackLabel = getAttributeGroup(key).label;
    const fallbackValue = getAttributeOption(key, optionId).label;
    return {
      key,
      label: tAttr(`${key}.label`, { defaultMessage: fallbackLabel }),
      value: tAttr(`${key}.options.${optionId}`, { defaultMessage: fallbackValue })
    };
  });

  return (
    <main className="min-h-dvh bg-paper pb-[max(2rem,env(safe-area-inset-bottom))]">
      <AppHeader />

      <section className="mx-auto max-w-7xl px-4 pb-14 pt-5 sm:px-8 sm:pb-20 sm:pt-8">
        <div className="grid min-w-0 gap-10 lg:grid-cols-[1fr_0.82fr] lg:gap-12">
          <div className="glass-panel min-w-0 rounded-2xl p-5 sm:p-8 lg:p-10">
            <div className="flex min-w-0 flex-col gap-8 sm:flex-row sm:items-start sm:justify-between sm:gap-10">
              <div className="min-w-0 space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-teal sm:text-sm">
                  {t("topMatch")}
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
                  {t("ruleFit")}
                </p>
                <p className="mt-4 max-w-[15rem] text-left text-xs leading-relaxed text-ink/55">
                  {t("disclaimer")}
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-12 lg:mt-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
              <div className="min-w-0">
                <ResultPortraitPreview state={modelState} />
              </div>
              <div className="flex min-w-0 flex-col gap-10 lg:gap-12">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-ink">
                    {t("colorPalette")}
                  </h2>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-ink/50">
                    {t("colorPaletteSub")}
                  </p>
                  <div className="mt-8">
                    <PaletteSwatches palette={topMatch.season.palette} />
                  </div>
                </div>
                <div className="rounded-2xl border border-ink/10 bg-white/80 p-5 sm:p-6">
                  <h2 className="text-2xl font-semibold tracking-tight text-ink">
                    {t("whySeason")}
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
                {t("alternate")}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-ink/55">{t("alternateSub")}</p>
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
              <h2 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">
                {t("makeup")}
              </h2>
              <div className="mt-6 flex flex-col gap-6">
                {(
                  [
                    ["makeupLips", topMatch.season.makeup.lips],
                    ["makeupCheeks", topMatch.season.makeup.cheeks],
                    ["makeupEyes", topMatch.season.makeup.eyes],
                    ["makeupAvoid", topMatch.season.makeup.avoid]
                  ] as const
                ).map(([labelKey, items]) => (
                  <div
                    key={labelKey}
                    className="border-t border-ink/10 pt-6 first:border-t-0 first:pt-0"
                  >
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-ink/45">
                      {t(labelKey)}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-ink/75 sm:text-[15px] sm:leading-7">
                      {items.join(", ")}
                    </p>
                  </div>
                ))}
                <div className="border-t border-ink/10 pt-6">
                  <p className="text-sm leading-relaxed text-ink/70">{t("makeupLookbookIntro")}</p>
                  <Link
                    href="/makeup-looks"
                    className="mt-3 inline-flex items-center justify-center rounded-full border border-teal/25 bg-teal/[0.08] px-4 py-2 text-sm font-semibold text-ink transition hover:border-teal/45 hover:bg-teal/[0.12]"
                  >
                    {t("viewMakeupLooks")}
                  </Link>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6 sm:p-8">
              <h2 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">
                {t("jewelry")}
              </h2>
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
              {t("selectedAttrs")}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-ink/55">{t("selectedAttrsSub")}</p>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {selectionRows.map((item) => (
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
                  {t("scoreDetail")}
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-ink/60">{t("scoreDetailSub")}</p>
              </div>
              <Link
                href={`/studio?${query}`}
                className="inline-flex shrink-0 items-center justify-center rounded-full border border-ink/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink shadow-sm transition hover:border-teal/40"
              >
                {t("refineModel")}
              </Link>
            </div>
            <div className="mt-8 border-t border-ink/10 pt-8">
              <SeasonScoringEngine items={topMatch.breakdown} intro={tScoring("intro")} />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

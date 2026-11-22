import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AppHeader } from "@/components/AppHeader";
import { ResultsView } from "@/components/results/ResultsView";
import { buildLanguageAlternates, canonicalUrl } from "@/lib/seo/alternates";
import { hasProfileParams, profileForModel, profileFromSearchParams } from "@/lib/profile";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const canonical = canonicalUrl(locale, "/results");
  return {
    title: t("resultsTitle"),
    description: t("resultsDescription"),
    robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
    alternates: { canonical, languages: buildLanguageAlternates("/results").languages },
    openGraph: { title: t("resultsTitle"), description: t("resultsDescription"), url: canonical, type: "website" }
  };
}

/** Shown from "See an example result" when no profile is in the URL. */
const EXAMPLE_MODEL = "model-04";

export default async function ResultsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const example = !hasProfileParams(sp);
  const profile = example ? profileForModel(EXAMPLE_MODEL) : profileFromSearchParams(sp);

  return (
    <main className="min-h-dvh">
      <AppHeader />
      <ResultsView profile={profile} example={example} />
    </main>
  );
}

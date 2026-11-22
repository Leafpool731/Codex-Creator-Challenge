import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AppHeader } from "@/components/AppHeader";
import { Studio } from "@/components/studio/Studio";
import { SiteFooter } from "@/components/SiteFooter";
import { buildLanguageAlternates, canonicalUrl } from "@/lib/seo/alternates";
import { defaultProfile, hasProfileParams, profileFromSearchParams } from "@/lib/profile";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const canonical = canonicalUrl(locale, "/studio");
  return {
    title: t("studioTitle"),
    description: t("studioDescription"),
    alternates: { canonical, languages: buildLanguageAlternates("/studio").languages },
    openGraph: {
      title: t("studioTitle"),
      description: t("studioDescription"),
      url: canonical,
      type: "website",
      images: [{ url: `/${locale}/opengraph-image`, width: 1200, height: 630, alt: t("ogImageAlt") }]
    }
  };
}

export default async function StudioPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const initial = hasProfileParams(sp) ? profileFromSearchParams(sp) : defaultProfile;

  return (
    <main className="min-h-dvh">
      <AppHeader />
      <Studio initial={initial} />
      <div className="pb-20 lg:pb-0">
        <SiteFooter />
      </div>
    </main>
  );
}

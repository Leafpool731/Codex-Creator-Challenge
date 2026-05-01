import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ChromiPage } from "@/components/ChromiPage";
import { buildLanguageAlternates, canonicalUrl } from "@/lib/seo/alternates";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const canonical = canonicalUrl(locale, "");
  const keywords = t("keywords")
    .split(/[,，]/)
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    title: t("homeTitle"),
    description: t("homeDescription"),
    keywords,
    alternates: {
      canonical,
      languages: buildLanguageAlternates("").languages
    },
    openGraph: {
      title: t("homeTitle"),
      description: t("homeDescription"),
      url: canonical,
      type: "website",
      images: [
        {
          url: `/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: t("ogImageAlt")
        }
      ]
    },
    twitter: {
      title: t("homeTitle"),
      description: t("homeDescription")
    }
  };
}

export default function LandingPage() {
  return <ChromiPage />;
}

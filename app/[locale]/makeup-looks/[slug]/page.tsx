import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AppHeader } from "@/components/AppHeader";
import {
  isMakeupLookSlug,
  makeupLookImages,
  makeupLookMessageKey,
  makeupLookSlugs
} from "@/data/makeupLooks";
import { Link } from "@/i18n/navigation";
import { buildLanguageAlternates, canonicalUrl } from "@/lib/seo/alternates";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return makeupLookSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isMakeupLookSlug(slug)) {
    return {};
  }
  const key = makeupLookMessageKey(slug);
  if (!key) return {};

  const tLook = await getTranslations({ locale, namespace: "makeupLooks" });
  const pageTitle = tLook(`${key}.title`);
  const description = tLook(`${key}.description`);
  const canonical = canonicalUrl(locale, `/makeup-looks/${slug}`);
  const tMeta = await getTranslations({ locale, namespace: "metadata" });
  const keywords = tMeta("keywords")
    .split(/[,，]/)
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    description,
    keywords,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(`/makeup-looks/${slug}`).languages
    },
    openGraph: {
      title: pageTitle,
      description,
      url: canonical,
      type: "article",
      images: [
        {
          url: makeupLookImages[slug],
          width: 1200,
          height: 1800,
          alt: tLook(`${key}.imageAlt`)
        }
      ]
    },
    twitter: {
      title: pageTitle,
      description
    }
  };
}

export default async function MakeupLookDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isMakeupLookSlug(slug)) {
    notFound();
  }
  setRequestLocale(locale);
  const key = makeupLookMessageKey(slug);
  if (!key) notFound();

  const t = await getTranslations("makeupLooks");

  return (
    <main className="min-h-dvh bg-paper pb-[max(2rem,env(safe-area-inset-bottom))]">
      <AppHeader />

      <article className="mx-auto max-w-5xl px-4 pb-14 pt-5 sm:px-8 sm:pb-20 sm:pt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal">
              {t("pageTitle")}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {t(`${key}.title`)}
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-ink/65 sm:text-base">
              {t(`${key}.description`)}
            </p>
          </div>
          <Link
            href="/makeup-looks"
            className="inline-flex shrink-0 items-center justify-center rounded-full border border-ink/10 bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-sm transition hover:border-teal/40 sm:self-start"
          >
            {t("backToAll")}
          </Link>
        </div>

        <div className="glass-panel mt-8 overflow-hidden rounded-2xl p-3 sm:mt-10 sm:p-4">
          <div className="relative w-full">
            <Image
              src={makeupLookImages[slug]}
              alt={t(`${key}.imageAlt`)}
              width={1200}
              height={1800}
              className="h-auto w-full rounded-xl"
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
            />
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-relaxed text-ink/50 sm:text-sm">
          {t("detailDisclaimer")}
        </p>
      </article>
    </main>
  );
}

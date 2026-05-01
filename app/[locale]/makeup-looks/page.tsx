import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AppHeader } from "@/components/AppHeader";
import {
  makeupLookImages,
  makeupLookMessageKey,
  makeupLookSlugs
} from "@/data/makeupLooks";
import { Link } from "@/i18n/navigation";
import { buildLanguageAlternates, canonicalUrl } from "@/lib/seo/alternates";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const canonical = canonicalUrl(locale, "/makeup-looks");
  const title = t("makeupLooksIndexTitle");
  const description = t("makeupLooksIndexDescription");
  const keywords = t("keywords")
    .split(/[,，]/)
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages: buildLanguageAlternates("/makeup-looks").languages
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website"
    },
    twitter: {
      title,
      description
    }
  };
}

export default async function MakeupLooksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("makeupLooks");

  return (
    <main className="min-h-dvh bg-paper pb-[max(2rem,env(safe-area-inset-bottom))]">
      <AppHeader />

      <section className="mx-auto max-w-7xl px-4 pb-14 pt-5 sm:px-8 sm:pb-20 sm:pt-8">
        <header className="max-w-2xl space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {t("pageTitle")}
          </h1>
          <p className="text-base leading-relaxed text-ink/65 sm:text-lg">
            {t("pageSubtitle")}
          </p>
        </header>

        <ul className="mt-10 grid gap-8 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {makeupLookSlugs.map((slug, index) => {
            const key = makeupLookMessageKey(slug);
            if (!key) return null;
            return (
              <li key={slug}>
                <article className="glass-panel flex h-full flex-col overflow-hidden rounded-2xl">
                  <Link
                    href={`/makeup-looks/${slug}`}
                    className="group relative block aspect-[3/4] w-full overflow-hidden bg-ink/[0.04]"
                  >
                    <Image
                      src={makeupLookImages[slug]}
                      alt={t(`${key}.imageAlt`)}
                      fill
                      className="object-cover object-top transition duration-300 group-hover:scale-[1.02]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority={index === 0}
                    />
                  </Link>
                  <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
                    <h2 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">
                      <Link
                        href={`/makeup-looks/${slug}`}
                        className="transition hover:text-teal"
                      >
                        {t(`${key}.title`)}
                      </Link>
                    </h2>
                    <p className="flex-1 text-sm leading-relaxed text-ink/65">
                      {t(`${key}.description`)}
                    </p>
                    <Link
                      href={`/makeup-looks/${slug}`}
                      className="inline-flex w-fit items-center rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm transition hover:border-teal/40"
                    >
                      {t("viewFullGuide")}
                    </Link>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}

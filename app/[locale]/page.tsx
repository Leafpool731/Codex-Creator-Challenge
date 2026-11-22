import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AppHeader, Logo } from "@/components/AppHeader";
import { HeroPortraits } from "@/components/landing/HeroPortraits";
import { SeasonGrid } from "@/components/landing/SeasonGrid";
import { Link } from "@/i18n/navigation";
import { buildLanguageAlternates, canonicalUrl } from "@/lib/seo/alternates";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const canonical = canonicalUrl(locale, "");
  const keywords = t("keywords")
    .split(/[,，]/)
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    description: t("homeDescription"),
    keywords,
    alternates: { canonical, languages: buildLanguageAlternates("").languages },
    openGraph: {
      title: t("homeTitle"),
      description: t("homeDescription"),
      url: canonical,
      type: "website",
      images: [{ url: `/${locale}/opengraph-image`, width: 1200, height: 630, alt: t("ogImageAlt") }]
    },
    twitter: { title: t("homeTitle"), description: t("homeDescription") }
  };
}

export default async function LandingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("landing");

  const steps = [
    { n: "01", title: t("step1Title"), desc: t("step1Desc") },
    { n: "02", title: t("step2Title"), desc: t("step2Desc") },
    { n: "03", title: t("step3Title"), desc: t("step3Desc") }
  ];

  return (
    <main className="min-h-dvh">
      <AppHeader />

      <section className="mx-auto grid w-full max-w-[1280px] items-center gap-12 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16 lg:px-8 lg:pb-28 lg:pt-20">
        <div className="max-w-xl">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h1 className="mt-5 font-serif text-[44px] leading-[1.02] tracking-tight sm:text-6xl lg:text-[76px]">
            {t("title")}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">{t("intro")}</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/studio" className="btn-primary px-7 py-3.5 text-[15px]">
              {t("ctaPrimary")} <span aria-hidden="true">→</span>
            </Link>
            <Link href="/results" className="btn-secondary px-6 py-3.5 text-[15px]">
              {t("ctaSecondary")}
            </Link>
          </div>
          <p className="mt-6 flex items-center gap-2 text-xs text-muted">
            <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3" y="7" width="10" height="7" rx="1.5" />
              <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
            </svg>
            {t("privacy")}
          </p>
        </div>
        <HeroPortraits caption={t("drapeCaption")} />
      </section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto w-full max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <p className="eyebrow">{t("howEyebrow")}</p>
          <h2 className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl">{t("howTitle")}</h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {steps.map((s) => (
              <li key={s.n} className="border-t border-ink pt-5">
                <span className="font-serif text-xl text-faint">{s.n}</span>
                <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow">{t("seasonsEyebrow")}</p>
          <h2 className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl">{t("seasonsTitle")}</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">{t("seasonsDesc")}</p>
        </div>
        <div className="mt-12">
          <SeasonGrid />
        </div>
        <div className="mt-14">
          <Link href="/studio" className="btn-primary px-7 py-3.5 text-[15px]">
            {t("ctaPrimary")} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-4 px-4 py-8 text-xs text-muted sm:px-6 lg:px-8">
          <Logo />
          <p>{t("footer")}</p>
        </div>
      </footer>
    </main>
  );
}

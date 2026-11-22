import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { AppHeader } from "@/components/AppHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { LEGAL_UPDATED, legalContent, legalStrings, type LegalPageId } from "@/lib/legal";
import { buildLanguageAlternates, canonicalUrl } from "@/lib/seo/alternates";
import { getContactEmail, isAmazonAssociate } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export function legalMetadata(id: LegalPageId) {
  return async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const c = legalContent(locale, id);
    const canonical = canonicalUrl(locale, `/${id}`);
    return {
      title: c.title,
      description: c.description,
      alternates: { canonical, languages: buildLanguageAlternates(`/${id}`).languages },
      openGraph: { title: c.title, description: c.description, url: canonical, type: "website" }
    };
  };
}

export function legalPage(id: LegalPageId) {
  return async function LegalRoute({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const c = legalContent(locale, id);
    const s = legalStrings[locale === "zh" ? "zh" : "en"];
    const email = getContactEmail();
    const updated = new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", { dateStyle: "long" }).format(
      new Date(`${LEGAL_UPDATED}T12:00:00Z`)
    );

    const renderText = (text: string) => {
      if (text === "{AMAZON}") return isAmazonAssociate() ? s.amazon : s.amazonNone;
      if (!text.includes("{CONTACT}")) return text;
      const [before, after] = text.split("{CONTACT}");
      return (
        <>
          {before}
          {email ? (
            <a href={`mailto:${email}`} className="font-medium text-ink underline underline-offset-4">
              {email}
            </a>
          ) : (
            <span className="italic">{s.contactPending}</span>
          )}
          {after}
        </>
      );
    };

    return (
      <main className="min-h-dvh">
        <AppHeader />
        <article className="mx-auto w-full max-w-2xl px-4 pb-20 pt-10 sm:px-6 lg:pt-16">
          <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">{c.title}</h1>
          {id !== "about" && (
            <p className="mt-3 text-xs text-faint">
              {s.updated}: <time dateTime={LEGAL_UPDATED}>{updated}</time>
            </p>
          )}
          <p className="mt-6 text-lg leading-relaxed text-ink/85">{c.intro}</p>
          {c.sections.map((section) => (
            <section key={section.heading} className="mt-10">
              <h2 className="text-lg font-semibold">{section.heading}</h2>
              {section.body.map((para, i) => (
                <p key={i} className="mt-3 text-[15px] leading-relaxed text-muted">
                  {renderText(para)}
                </p>
              ))}
            </section>
          ))}
        </article>
        <SiteFooter />
      </main>
    );
  };
}

import { routing } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/site";

/** Path after locale, e.g. "" or "/studio" or "/results" */
export function buildLanguageAlternates(pathAfterLocale: string) {
  const base = getSiteUrl();
  const normalized =
    pathAfterLocale === "" ? "" : pathAfterLocale.startsWith("/") ? pathAfterLocale : `/${pathAfterLocale}`;

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    const hreflang = loc === "zh" ? "zh-CN" : "en";
    languages[hreflang] = `${base}/${loc}${normalized}`;
  }
  languages["x-default"] = `${base}/${routing.defaultLocale}${normalized}`;

  return { languages };
}

export function canonicalUrl(locale: string, pathAfterLocale: string): string {
  const base = getSiteUrl();
  const normalized =
    pathAfterLocale === "" ? "" : pathAfterLocale.startsWith("/") ? pathAfterLocale : `/${pathAfterLocale}`;
  return `${base}/${locale}${normalized}`;
}

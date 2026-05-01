"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("lang");

  const other = locale === "en" ? "zh" : "en";
  const label = locale === "en" ? t("switchToZh") : t("switchToEn");

  return (
    <Link
      href={pathname}
      locale={other}
      className={`inline-flex items-center rounded-full border border-ink/15 bg-white/90 px-3 py-1.5 text-xs font-semibold text-ink shadow-sm transition hover:border-teal/40 hover:bg-white ${className}`}
      prefetch
    >
      {label}
    </Link>
  );
}

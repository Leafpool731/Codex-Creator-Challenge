"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

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
      className={`inline-flex items-center rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-ink/30 ${className}`}
    >
      {label}
    </Link>
  );
}

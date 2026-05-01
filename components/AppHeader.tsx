"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function AppHeader() {
  const t = useTranslations("nav");

  return (
    <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-8 sm:py-5">
      <Link
        href="/"
        className="group inline-flex items-center gap-3 rounded-full text-ink"
        aria-label={t("homeAria")}
      >
        <span className="grid h-10 w-10 place-items-center rounded-full border border-ink/10 bg-paper shadow-sm transition group-hover:border-teal/40">
          <span
            className="h-5 w-5 rounded-full bg-[conic-gradient(from_180deg,#ead6cf,#caa291,#80665e,#ead6cf)]"
            aria-hidden="true"
          />
        </span>
        <span className="text-base font-semibold tracking-normal">Chromi</span>
      </Link>

      <nav
        aria-label="Primary navigation"
        className="flex items-center gap-2 sm:gap-3"
      >
        <LanguageSwitcher />
        <Link
          href="/makeup-looks"
          className="rounded-full border border-ink/10 bg-paper/80 px-3 py-2 text-sm font-semibold text-ink shadow-sm transition hover:border-teal/40 hover:bg-white sm:px-4"
        >
          {t("makeupLooks")}
        </Link>
        <Link
          href="/studio"
          className="rounded-full border border-ink/10 bg-paper/80 px-4 py-2 text-sm font-semibold text-ink shadow-sm transition hover:border-teal/40 hover:bg-white"
        >
          {t("studio")}
        </Link>
      </nav>
    </header>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className="h-6 w-6 rounded-full bg-[conic-gradient(from_200deg,#c7563f,#e2a64a,#6f9a5a,#3f7fa0,#7a5a9e,#c24d76,#c7563f)] shadow-[inset_0_0_0_3px_rgba(255,253,251,0.9)] ring-1 ring-ink/10"
      />
      <span className="font-serif text-[26px] leading-none tracking-tight">Chromi</span>
    </span>
  );
}

export function AppHeader() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const navLink = (href: string, label: string) => {
    const active = pathname.startsWith(href);
    return (
      <Link
        href={href}
        className={`rounded-full px-3 py-2 text-sm font-medium transition ${
          active ? "text-ink" : "text-muted hover:text-ink"
        }`}
        aria-current={active ? "page" : undefined}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label={t("homeAria")} className="rounded-full">
          <Logo />
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2">
          <span className="hidden sm:contents">
            {navLink("/studio", t("studio"))}
            {navLink("/makeup-looks", t("makeupLooks"))}
          </span>
          <LanguageSwitcher />
          <Link href="/studio" className="btn-primary ml-1 hidden px-4 py-2 md:inline-flex">
            {t("start")}
          </Link>
        </nav>
      </div>
    </header>
  );
}

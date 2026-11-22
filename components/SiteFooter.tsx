"use client";

import { useTranslations } from "next-intl";
import { Logo } from "@/components/AppHeader";
import { Link } from "@/i18n/navigation";

export function SiteFooter() {
  const t = useTranslations("nav");
  const tl = useTranslations("landing");
  const links: [string, string][] = [
    ["/about", t("about")],
    ["/privacy", t("privacy")],
    ["/disclosure", t("disclosure")]
  ];
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-x-6 gap-y-4 px-4 py-8 text-xs text-muted sm:px-6 lg:px-8">
        <Logo />
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="transition hover:text-ink">
              {label}
            </Link>
          ))}
        </nav>
        <p>{tl("footer")}</p>
      </div>
    </footer>
  );
}

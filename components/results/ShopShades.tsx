"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import {
  matchProducts,
  products,
  shadeCloseness,
  type ProductCategory,
  type ProductMatch
} from "@/lib/products";
import type { Season } from "@/lib/seasons";

interface ShopShadesProps {
  season: Season;
  activeLip: string | null;
  onTryLip: (hex: string) => void;
}

const tabs: { id: ProductCategory; label: "lips" | "cheeks" | "eyeMakeup" }[] = [
  { id: "lips", label: "lips" },
  { id: "cheeks", label: "cheeks" },
  { id: "eyes", label: "eyeMakeup" }
];

export function ShopShades({ season, activeLip, onTryLip }: ShopShadesProps) {
  const t = useTranslations("results");
  const [tab, setTab] = useState<ProductCategory>("lips");
  const matches = useMemo(() => matchProducts(season, tab), [season, tab]);
  const showingSamples = products.some((p) => p.sample);

  return (
    <section className="rounded-3xl border border-line bg-surface p-6 sm:p-8" aria-labelledby="shop-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl">
          <h2 id="shop-title" className="font-serif text-3xl leading-tight">
            {t("shopTitle")}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{t("shopHint")}</p>
          <p className="mt-3 rounded-xl bg-paper px-3 py-2 text-xs leading-relaxed text-muted">{t("disclosure")}</p>
        </div>
        <div className="inline-flex rounded-full border border-line bg-paper p-1 text-xs font-semibold" role="tablist">
          {tabs.map((x) => (
            <button
              key={x.id}
              type="button"
              role="tab"
              aria-selected={tab === x.id}
              onClick={() => setTab(x.id)}
              className={`rounded-full px-4 py-1.5 transition ${tab === x.id ? "bg-ink text-paper" : "text-muted hover:text-ink"}`}
            >
              {t(x.label)}
            </button>
          ))}
        </div>
      </div>

      {matches.length === 0 ? (
        <p className="mt-8 rounded-2xl bg-paper p-6 text-center text-sm text-muted">{t("noMatches")}</p>
      ) : (
        <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((m) => (
            <ProductCard
              key={m.product.id}
              match={m}
              trying={tab === "lips" && activeLip === m.product.hex}
              onTry={tab === "lips" ? () => onTryLip(m.product.hex) : undefined}
            />
          ))}
        </ul>
      )}

      <div className="mt-6 space-y-1.5 border-t border-line pt-4 text-xs leading-relaxed text-faint">
        {showingSamples && <p>{t("sampleNote")}</p>}
        <p>{t("screenNote")}</p>
      </div>
    </section>
  );
}

function ProductCard({ match, trying, onTry }: { match: ProductMatch; trying: boolean; onTry?: () => void }) {
  const t = useTranslations("results");
  const { product, distance, target } = match;
  const affiliate = product.affiliate !== false;
  return (
    <li className="flex gap-4 rounded-2xl border border-line p-4 transition hover:border-ink/25">
      <span
        className="h-16 w-16 shrink-0 rounded-2xl shadow-[inset_0_0_0_1px_rgba(26,23,21,0.1),inset_0_-10px_16px_rgba(0,0,0,0.12),inset_0_6px_10px_rgba(255,255,255,0.18)]"
        style={{ backgroundColor: product.hex }}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold uppercase tracking-wide text-muted">{product.brand}</p>
            <p className="truncate font-medium leading-snug">{product.name}</p>
            <p className="truncate text-sm text-muted">
              {product.shade}
              {product.finish ? ` · ${product.finish}` : ""}
            </p>
          </div>
          {product.sample && (
            <span className="shrink-0 rounded-full bg-sunk px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
              {t("sample")}
            </span>
          )}
        </div>

        <p className="mt-2 text-xs font-semibold">{t(`shade_${shadeCloseness(distance)}`)}</p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
          <span className="h-2.5 w-2.5 rounded-full ring-1 ring-ink/10" style={{ backgroundColor: target.hex }} />
          {t("closeTo", { name: target.name })}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {onTry && (
            <button
              type="button"
              onClick={onTry}
              aria-pressed={trying}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                trying ? "bg-ink text-paper" : "border border-line hover:border-ink/30"
              }`}
            >
              {trying ? t("tryingOn") : t("tryOnProduct")}
            </button>
          )}
          {product.url ? (
            <>
              <a
                href={product.url}
                target="_blank"
                rel={affiliate ? "sponsored nofollow noopener noreferrer" : "noopener noreferrer"}
                className="rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-paper transition hover:bg-[#3a332e]"
              >
                {affiliate
                  ? product.retailer
                    ? t("shopAt", { retailer: product.retailer })
                    : t("shop")
                  : t("viewProduct")}{" "}
                ↗
              </a>
              {affiliate && <span className="self-center text-[10px] font-medium text-faint">{t("affiliateTag")}</span>}
            </>
          ) : (
            <span className="rounded-full border border-dashed border-line px-3 py-1.5 text-xs font-medium text-faint">
              {t("linkSoon")}
            </span>
          )}
        </div>
      </div>
    </li>
  );
}

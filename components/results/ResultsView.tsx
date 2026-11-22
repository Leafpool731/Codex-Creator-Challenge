"use client";

import { useTranslations } from "next-intl";
import { useMemo, useRef, useState } from "react";
import { AxisChart } from "@/components/AxisChart";
import { PortraitCanvas } from "@/components/portrait/PortraitCanvas";
import { ShopShades } from "@/components/results/ShopShades";
import { Link } from "@/i18n/navigation";
import { analyse, fitLevel } from "@/lib/analysis";
import { readableTextOn } from "@/lib/color/oklab";
import { avoidPalette, cosmeticsForSeason, paletteForSeason, type Swatch } from "@/lib/palette";
import { profileToSearchParams, type Profile } from "@/lib/profile";

type DrapeSet = "best" | "avoid";

function Card({ title, hint, children, className = "" }: { title: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-3xl border border-line bg-surface p-6 sm:p-7 ${className}`}>
      <h2 className="font-serif text-2xl leading-tight">{title}</h2>
      {hint && <p className="mt-1.5 text-sm leading-relaxed text-muted">{hint}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function SwatchButton({
  swatch,
  active,
  onClick,
  size = "md"
}: {
  swatch: Swatch;
  active: boolean;
  onClick: () => void;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "h-9 w-9" : "h-11 w-11";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={`${swatch.name} ${swatch.hex.toUpperCase()}`}
      aria-label={swatch.name}
      className={`${dim} shrink-0 rounded-full shadow-[inset_0_0_0_1px_rgba(26,23,21,0.12)] transition ${
        active ? "ring-2 ring-ink ring-offset-2 ring-offset-surface" : "hover:scale-110"
      }`}
      style={{ backgroundColor: swatch.hex }}
    />
  );
}

function PaletteTile({ swatch }: { swatch: Swatch }) {
  const [copied, setCopied] = useState(false);
  const t = useTranslations("results");
  const text = readableTextOn(swatch.hex);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(swatch.hex.toUpperCase()).catch(() => undefined);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1200);
      }}
      className="group relative flex aspect-square flex-col justify-end overflow-hidden rounded-2xl p-2.5 text-left shadow-[inset_0_0_0_1px_rgba(26,23,21,0.08)] transition hover:-translate-y-0.5"
      style={{ backgroundColor: swatch.hex, color: text }}
    >
      <span className="text-[13px] font-semibold leading-tight">{swatch.name}</span>
      <span className="mt-0.5 font-mono text-[11px] uppercase opacity-0 transition group-hover:opacity-80 group-focus-visible:opacity-80">
        {copied ? t("copied") : swatch.hex}
      </span>
    </button>
  );
}

const metalStyles: Record<string, string> = {
  gold: "linear-gradient(135deg,#f6e3a1,#c99a35 45%,#f1d77e 60%,#a87a22)",
  bronze: "linear-gradient(135deg,#e6b98a,#9c6634 50%,#d4a06a 65%,#7c4b22)",
  copper: "linear-gradient(135deg,#f2b493,#b8623c 50%,#e59a73 65%,#8e4426)",
  rose: "linear-gradient(135deg,#f6d2c4,#c98b78 50%,#efc0ae 65%,#a8695a)",
  silver: "linear-gradient(135deg,#f4f5f7,#a9adb4 45%,#e6e8eb 60%,#868b93)",
  platinum: "linear-gradient(135deg,#fafbfc,#c7cbd1 45%,#eef0f2 60%,#a3a8b0)",
  pewter: "linear-gradient(135deg,#d9d9d6,#8f908c 50%,#c3c3bf 65%,#6e6f6b)"
};

function metalsFor(temperature: number, chroma: number): string[] {
  if (temperature > 0.45) return chroma < 0.3 ? ["bronze", "gold", "copper"] : ["gold", "copper", "bronze"];
  if (temperature > 0.1) return ["gold", "rose", "bronze"];
  if (temperature > -0.1) return ["rose", "gold", "silver"];
  if (temperature > -0.45) return chroma < 0.3 ? ["pewter", "silver", "rose"] : ["silver", "rose", "platinum"];
  return chroma < 0.3 ? ["silver", "pewter", "platinum"] : ["platinum", "silver", "pewter"];
}

export function ResultsView({ profile, example = false }: { profile: Profile; example?: boolean }) {
  const t = useTranslations("results");
  const analysis = useMemo(() => analyse(profile), [profile]);
  const { top } = analysis;
  const season = top.season;
  const palette = paletteForSeason(season);
  const avoid = avoidPalette(season);
  const cosmetics = cosmeticsForSeason(season);

  const [set, setSet] = useState<DrapeSet>("best");
  const [drapeIndex, setDrapeIndex] = useState(0);
  const [compare, setCompare] = useState(false);
  const [lip, setLip] = useState<string | null>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

  const drapes = palette.drapes;
  const bestDrape = drapes[drapeIndex % drapes.length]?.hex ?? null;
  const avoidDrape = avoid[drapeIndex % avoid.length]?.hex ?? null;
  const activeDrape = set === "best" ? bestDrape : avoidDrape;
  const query = profileToSearchParams(profile);
  const alternates = analysis.matches.slice(1, 4);
  const metals = metalsFor(season.coordinates.temperature, season.coordinates.chroma);

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 pb-20 pt-6 sm:px-6 lg:px-8 lg:pt-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-12">
        {/* Drape test */}
        <div ref={portraitRef} className="min-w-0 scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
          <div className={`grid gap-3 ${compare ? "grid-cols-2" : "grid-cols-1"}`}>
            {(compare ? (["best", "avoid"] as const) : ([set] as const)).map((which) => (
              <figure key={which} className="relative overflow-hidden rounded-[28px] border border-line bg-sunk shadow-lift">
                <PortraitCanvas
                  profile={profile}
                  drapeHex={which === "best" ? bestDrape : avoidDrape}
                  lipHex={lip}
                  alt={`${season.name} — ${t("drapeTitle")}`}
                  className="aspect-[4/5] w-full"
                  focus="50% 30%"
                />
                <figcaption className="absolute left-3 top-3 chip border-line/70 bg-surface/85 backdrop-blur">
                  <span
                    className="h-3 w-3 rounded-full ring-1 ring-ink/10"
                    style={{ backgroundColor: (which === "best" ? bestDrape : avoidDrape) ?? undefined }}
                  />
                  {which === "best" ? t("best") : t("avoid")}
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-5 rounded-3xl border border-line bg-surface p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold">{t("drapeTitle")}</h2>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">{t("drapeHint")}</p>
              </div>
              <button
                type="button"
                onClick={() => setCompare((c) => !c)}
                aria-pressed={compare}
                className="btn-secondary px-4 py-2 text-xs"
              >
                {compare ? t("single") : t("compare")}
              </button>
            </div>

            {!compare && (
              <div className="mt-4 inline-flex rounded-full border border-line bg-paper p-1 text-xs font-semibold">
                {(["best", "avoid"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSet(s)}
                    aria-pressed={set === s}
                    className={`rounded-full px-3 py-1.5 transition ${set === s ? "bg-ink text-paper" : "text-muted hover:text-ink"}`}
                  >
                    {s === "best" ? t("best") : t("avoid")}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2.5">
              {(compare || set === "best" ? drapes : avoid).map((s, i) => (
                <SwatchButton
                  key={`${s.family}-${s.hex}`}
                  swatch={s}
                  active={i === drapeIndex % (compare || set === "best" ? drapes.length : avoid.length)}
                  onClick={() => setDrapeIndex(i)}
                />
              ))}
            </div>
            {(compare || set === "avoid") && (
              <p className="mt-3 text-xs leading-relaxed text-muted">{t("avoidHint")}</p>
            )}
          </div>
          <p className="sr-only" aria-live="polite">
            {activeDrape}
          </p>
        </div>

        {/* Season summary */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="eyebrow">{example ? t("example") : t("eyebrow")}</p>
            <span className="chip">{season.family}</span>
          </div>
          <h1 className="mt-3 font-serif text-5xl leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">{season.name}</h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">{season.headline}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper">
              {t(`fit_${fitLevel(top.match)}`)}
            </span>
            <span className="chip py-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  analysis.confidence === "strong" ? "bg-[#4d8a5b]" : analysis.confidence === "moderate" ? "bg-[#c79a3a]" : "bg-[#c0623f]"
                }`}
              />
              {t(`confidence_${analysis.confidence}`)}
            </span>
          </div>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink/80">{season.rationale}</p>
          <p className="mt-3 max-w-xl text-xs leading-relaxed text-muted">{t("startingPoint")}</p>

          <div className="mt-10">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="font-serif text-3xl">{t("palette")}</h2>
                <p className="mt-1 text-sm text-muted">{t("paletteHint")}</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-2.5">
              {palette.colours.map((s) => (
                <PaletteTile key={s.family} swatch={s} />
              ))}
            </div>
            <h3 className="eyebrow mt-7">{t("neutrals")}</h3>
            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6 sm:gap-2.5">
              {palette.neutrals.map((s) => (
                <PaletteTile key={s.name + s.hex} swatch={s} />
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={`/studio?${query}`} className="btn-primary">
              {t("refine")}
            </Link>
            <Link href="/studio" className="btn-secondary">
              {t("restart")}
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <ShopShades
          season={season}
          activeLip={lip}
          onTryLip={(hex) => {
            setLip(hex);
            const el = portraitRef.current;
            if (el && el.getBoundingClientRect().bottom < 80) {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}
        />
      </div>

      {/* Detail cards */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title={t("makeup")} hint={t("tryOn")}>
          <div className="space-y-6">
            <div>
              <h3 className="eyebrow">{t("lips")}</h3>
              <div className="mt-3 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setLip(null)}
                  aria-pressed={lip === null}
                  className={`grid h-11 w-11 place-items-center rounded-full border border-dashed border-ink/30 text-[10px] font-semibold text-muted transition ${
                    lip === null ? "ring-2 ring-ink ring-offset-2 ring-offset-surface" : ""
                  }`}
                  aria-label={t("noDrape")}
                >
                  —
                </button>
                {cosmetics.lips.map((s) => (
                  <SwatchButton key={s.hex} swatch={s} active={lip === s.hex} onClick={() => setLip(s.hex)} />
                ))}
              </div>
              <p className="mt-3 text-sm text-muted">{season.makeup.lips.join(" · ")}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="eyebrow">{t("cheeks")}</h3>
                <div className="mt-3 flex gap-2">
                  {cosmetics.cheeks.map((s) => (
                    <span key={s.hex} title={s.name} className="h-9 w-9 rounded-full shadow-[inset_0_0_0_1px_rgba(26,23,21,0.1)]" style={{ backgroundColor: s.hex }} />
                  ))}
                </div>
                <p className="mt-3 text-sm text-muted">{season.makeup.cheeks.join(" · ")}</p>
              </div>
              <div>
                <h3 className="eyebrow">{t("eyeMakeup")}</h3>
                <div className="mt-3 flex gap-2">
                  {cosmetics.eyes.map((s) => (
                    <span key={s.hex} title={s.name} className="h-9 w-9 rounded-full shadow-[inset_0_0_0_1px_rgba(26,23,21,0.1)]" style={{ backgroundColor: s.hex }} />
                  ))}
                </div>
                <p className="mt-3 text-sm text-muted">{season.makeup.eyes.join(" · ")}</p>
              </div>
            </div>
            <div className="rounded-2xl bg-paper p-4">
              <h3 className="eyebrow">{t("avoidList")}</h3>
              <p className="mt-2 text-sm text-ink/80">{season.makeup.avoid.join(" · ")}</p>
            </div>
          </div>
        </Card>

        <Card title={t("why")} hint={t("whyHint")}>
          <AxisChart profile={analysis.coordinates} season={season.coordinates} />
        </Card>

        <Card title={t("jewelry")}>
          <div className="flex gap-3">
            {metals.map((m) => (
              <span key={m} className="h-14 w-14 rounded-full shadow-[inset_0_0_0_1px_rgba(26,23,21,0.12),0_6px_14px_-6px_rgba(26,23,21,0.35)]" style={{ background: metalStyles[m] }} />
            ))}
          </div>
          <p className="mt-5 text-[15px] leading-relaxed text-ink/80">{season.jewelry}</p>
        </Card>

        <Card title={t("alternates")}>
          <ul className="divide-y divide-line">
            {alternates.map((m) => {
              const p = paletteForSeason(m.season);
              return (
                <li key={m.season.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="flex h-10 w-24 shrink-0 overflow-hidden rounded-xl ring-1 ring-ink/5">
                    {p.colours.slice(0, 6).map((s) => (
                      <span key={s.family} className="flex-1" style={{ backgroundColor: s.hex }} />
                    ))}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold leading-tight">{m.season.name}</p>
                    <p className="truncate text-sm text-muted">{m.season.headline}</p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-muted">{t(`fit_${fitLevel(m.match)}`)}</span>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <p className="mx-auto mt-12 max-w-2xl text-center text-xs leading-relaxed text-faint">{t("disclaimer")}</p>
    </div>
  );
}

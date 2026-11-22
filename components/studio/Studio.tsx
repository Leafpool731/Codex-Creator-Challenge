"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { AxisChart } from "@/components/AxisChart";
import { PortraitCanvas } from "@/components/portrait/PortraitCanvas";
import { Questionnaire } from "@/components/studio/Questionnaire";
import { RangeField } from "@/components/ui/RangeField";
import { SwatchPicker } from "@/components/ui/SwatchPicker";
import { Link } from "@/i18n/navigation";
import { analyse, fitLevel } from "@/lib/analysis";
import { paletteForSeason } from "@/lib/palette";
import {
  eyeOptions,
  hairOptions,
  portraitModels,
  profileForModel,
  profileToSearchParams,
  skinHex,
  withClosestPortrait,
  type Profile
} from "@/lib/profile";

function gradient(stops: string[]): string {
  return `linear-gradient(90deg, ${stops.join(", ")})`;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-6 first:border-t-0 first:pt-0">
      <h2 className="eyebrow mb-5">{title}</h2>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

export function Studio({ initial }: { initial: Profile }) {
  const t = useTranslations("studio");
  const tr = useTranslations("results");
  const [profile, setProfile] = useState<Profile>(initial);
  const [showOriginal, setShowOriginal] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState(0);
  // Skin changes may hand the preview to a closer real portrait (see closestPortrait).
  const update = (patch: Partial<Profile>) => setProfile((p) => withClosestPortrait({ ...p, ...patch }));

  const query = profileToSearchParams(profile);
  const analysis = useMemo(() => analyse(profile), [profile]);
  const top = analysis.top;
  const palette = paletteForSeason(top.season);

  // Keep the URL shareable without triggering navigations.
  useEffect(() => {
    const id = window.setTimeout(() => {
      const url = `${window.location.pathname}?${query}`;
      window.history.replaceState(window.history.state, "", url);
    }, 250);
    return () => window.clearTimeout(id);
  }, [query]);

  const depthTrack = gradient(
    [0, 20, 40, 60, 80, 100].map((d) => skinHex({ ...profile, skinDepth: d }))
  );
  const undertoneTrack = gradient(
    [-50, -25, 0, 25, 50].map((u) => skinHex({ ...profile, undertone: u, olive: false }))
  );
  const clarityTrack = gradient(["#a8948f", "#c2737f", "#e0335c"]);

  const shownProfile = showOriginal ? profileForModel(profile.modelId) : profile;

  return (
    <div className="mx-auto grid w-full max-w-[1280px] gap-6 px-4 pb-28 pt-6 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10 lg:px-8 lg:pb-16 lg:pt-10">
      {/* Portrait column */}
      <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
        <div className="relative overflow-hidden rounded-[28px] border border-line bg-sunk shadow-lift">
          <PortraitCanvas
            profile={shownProfile}
            alt={t("title")}
            className="aspect-[4/5] max-h-[56vh] w-full lg:max-h-[min(78vh,760px)]"
          />
          <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
            <div className="inline-flex rounded-full border border-line/80 bg-surface/85 p-1 text-xs font-semibold backdrop-blur">
              {[false, true].map((orig) => (
                <button
                  key={String(orig)}
                  type="button"
                  onClick={() => setShowOriginal(orig)}
                  aria-pressed={showOriginal === orig}
                  className={`rounded-full px-3 py-1.5 transition ${
                    showOriginal === orig ? "bg-ink text-paper" : "text-muted hover:text-ink"
                  }`}
                >
                  {orig ? t("showOriginal") : t("showAdjusted")}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setProfile(profileForModel(profile.modelId))}
              className="rounded-full border border-line/80 bg-surface/85 px-3 py-2 text-xs font-semibold text-ink backdrop-blur transition hover:bg-surface"
            >
              {t("reset")}
            </button>
          </div>
          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-line/80 bg-surface/85 py-1.5 pl-1.5 pr-3 text-xs font-medium backdrop-blur">
            <span
              className="h-5 w-5 rounded-full ring-1 ring-ink/10"
              style={{ backgroundColor: skinHex(profile) }}
              aria-hidden="true"
            />
            <span className="tabular-nums text-muted">{skinHex(profile).toUpperCase()}</span>
          </div>
        </div>

        {/* Live reading */}
        <div className="mt-6 hidden rounded-3xl border border-line bg-surface p-6 lg:block">
          <LiveReading analysis={analysis} paletteHexes={palette.colours.slice(0, 8).map((c) => c.hex)} />
        </div>
      </div>

      {/* Controls column */}
      <div className="min-w-0">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h1 className="mt-2 font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl">{t("title")}</h1>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">{t("intro")}</p>

        <div className="mt-8 rounded-3xl border border-line bg-surface p-5 shadow-soft sm:p-7">
          <Section title={t("model")}>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-9 lg:grid-cols-5 xl:grid-cols-9">
              {portraitModels.map((m, i) => {
                const active = m.id === profile.modelId;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setProfile(profileForModel(m.id))}
                    aria-pressed={active}
                    aria-label={`${t("model")} ${i + 1}`}
                    className={`relative aspect-square overflow-hidden rounded-2xl transition ${
                      active ? "ring-2 ring-ink ring-offset-2 ring-offset-surface" : "opacity-80 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={m.src}
                      alt=""
                      fill
                      sizes="72px"
                      className="scale-[1.9] object-cover"
                      style={{ objectPosition: "50% 34%" }}
                    />
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title={t("skin")}>
            {quizOpen ? (
              <Questionnaire
                onCancel={() => setQuizOpen(false)}
                onApply={({ patch, answered }) => {
                  update(patch);
                  setQuizAnswered(answered);
                  setQuizOpen(false);
                }}
              />
            ) : (
              <div>
                <button
                  type="button"
                  onClick={() => setQuizOpen(true)}
                  className="w-full rounded-2xl border border-dashed border-ink/25 px-4 py-3 text-left text-sm font-medium transition hover:border-ink/50 hover:bg-paper"
                >
                  {t("quizCta")} <span aria-hidden="true">→</span>
                </button>
                {quizAnswered > 0 && (
                  <p className="mt-2 text-xs leading-relaxed text-muted" role="status">
                    {t("quizApplied", { count: quizAnswered })}
                  </p>
                )}
              </div>
            )}
            <RangeField
              label={t("depth")}
              value={profile.skinDepth}
              min={0}
              max={100}
              onChange={(skinDepth) => update({ skinDepth })}
              minLabel={t("depthMin")}
              maxLabel={t("depthMax")}
              track={depthTrack}
              thumb={skinHex(profile)}
            />
            <RangeField
              label={t("undertone")}
              value={profile.undertone}
              min={-50}
              max={50}
              onChange={(undertone) => update({ undertone })}
              minLabel={t("undertoneMin")}
              maxLabel={t("undertoneMax")}
              track={undertoneTrack}
              thumb={skinHex(profile)}
              hint={t("undertoneHint")}
            />
            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line p-4 transition hover:border-ink/25">
              <input
                type="checkbox"
                checked={profile.olive}
                onChange={(e) => update({ olive: e.target.checked })}
                className="mt-0.5 h-4 w-4 shrink-0 accent-ink"
              />
              <span>
                <span className="block text-sm font-medium">{t("olive")}</span>
                <span className="mt-1 block text-xs leading-relaxed text-muted">{t("oliveHint")}</span>
              </span>
            </label>
          </Section>

          <Section title={`${t("hair")} · ${t("eyes")}`}>
            <SwatchPicker
              label={t("hair")}
              value={profile.hair}
              onChange={(hair) => update({ hair })}
              options={hairOptions.map((h) => ({ id: h.id, hex: h.hex, label: t(`hairNames.${h.id}`) }))}
            />
            <SwatchPicker
              label={t("eyes")}
              value={profile.eyes}
              onChange={(eyes) => update({ eyes })}
              options={eyeOptions.map((e) => ({ id: e.id, hex: e.hex, label: t(`eyeNames.${e.id}`) }))}
            />
          </Section>

          <Section title={t("clarity")}>
            <RangeField
              label={t("clarity")}
              value={profile.clarity}
              min={0}
              max={100}
              onChange={(clarity) => update({ clarity })}
              minLabel={t("clarityMin")}
              maxLabel={t("clarityMax")}
              track={clarityTrack}
              hint={t("clarityHint")}
            />
          </Section>
        </div>

        <div className="mt-6 rounded-3xl border border-line bg-surface p-6 lg:hidden">
          <LiveReading analysis={analysis} paletteHexes={palette.colours.slice(0, 8).map((c) => c.hex)} />
        </div>

        <div className="mt-6 hidden items-center justify-between gap-4 lg:flex">
          <p className="text-xs text-muted">{t("privacy")}</p>
          <Link href={`/results?${query}`} className="btn-primary px-7 py-3.5">
            {t("cta")} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/90 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] text-muted">{t("leading")}</p>
            <p className="truncate text-sm font-semibold">
              {top.season.name} · {tr(`fit_${fitLevel(top.match)}`)}
            </p>
          </div>
          <Link href={`/results?${query}`} className="btn-primary shrink-0">
            {t("cta")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function LiveReading({
  analysis,
  paletteHexes
}: {
  analysis: ReturnType<typeof analyse>;
  paletteHexes: string[];
}) {
  const t = useTranslations("studio");
  const tr = useTranslations("results");
  const { top } = analysis;
  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{t("leading")}</p>
          <p className="mt-1 font-serif text-3xl leading-tight">{top.season.name}</p>
          <p className="mt-1 text-sm text-muted">{top.season.headline}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold leading-tight">{tr(`fit_${fitLevel(top.match)}`)}</p>
          <p className="text-[11px] text-muted">{tr(`confidence_${analysis.confidence}`)}</p>
        </div>
      </div>
      <div className="mt-4 flex h-8 overflow-hidden rounded-xl ring-1 ring-ink/5">
        {paletteHexes.map((hex) => (
          <span key={hex} className="flex-1" style={{ backgroundColor: hex }} />
        ))}
      </div>
      <div className="mt-6">
        <AxisChart profile={analysis.coordinates} season={top.season.coordinates} compact />
      </div>
    </div>
  );
}

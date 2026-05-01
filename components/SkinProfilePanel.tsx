"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { FineTuneSlider } from "@/components/FineTuneSlider";
import { SegmentedControl } from "@/components/SegmentedControl";
import { SliderControl } from "@/components/SliderControl";
import {
  portraitModels,
  studioStateToSearchParams,
  usePortraitStudio,
  type Undertone
} from "@/lib/portraitStudioStore";

function skinToneIdFromDepth(depth: number): string {
  if (depth < 16) return "porcelain";
  if (depth < 30) return "fair";
  if (depth < 45) return "light";
  if (depth < 58) return "medium";
  if (depth < 72) return "tan";
  if (depth < 86) return "deep";
  return "rich-deep";
}

export function SkinProfilePanel() {
  const t = useTranslations("studio");
  const { state, setState } = usePortraitStudio();
  const [failedIds, setFailedIds] = useState<string[]>([]);
  const resultQuery = useMemo(() => studioStateToSearchParams(state), [state]);

  const undertoneOptions = useMemo(
    () =>
      [
        { id: "cool" as const, label: t("undertoneCool") },
        { id: "neutral" as const, label: t("undertoneNeutral") },
        { id: "warm" as const, label: t("undertoneWarm") },
        { id: "olive" as const, label: t("undertoneOlive") }
      ] satisfies Array<{ id: Undertone; label: string }>,
    [t]
  );

  return (
    <aside className="min-w-0 rounded-2xl border border-[#ddd2c9] bg-[#fcf8f3]/95 p-4 shadow-[0_18px_44px_rgba(85,63,50,0.1)] backdrop-blur sm:p-6 lg:p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[#8a7b72]">
          {t("virtualSetup")}
        </p>
        <h2 className="mt-2 text-2xl font-semibold leading-tight text-[#302823]">{t("skinProfile")}</h2>
        <p className="mt-3 text-base leading-relaxed text-[#766861]">{t("skinProfileIntro")}</p>
      </div>

      <div className="mt-8 space-y-8" role="region" aria-label={t("skinProfile")}>
        <div>
          <p className="mb-4 text-sm font-medium text-[#4f443f]">{t("modelAnchor")}</p>
          <div
            className="grid grid-cols-3 gap-2 sm:gap-3"
            aria-label={t("modelAnchor")}
          >
            {portraitModels.map((model) => {
              const failed = failedIds.includes(model.id);
              const active = model.id === state.modelId;

              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => setState({ modelId: model.id })}
                  aria-label={`${model.label}`}
                  aria-pressed={active}
                  className={`group overflow-hidden rounded-2xl border bg-[#ede2d8] text-left transition ${
                    active
                      ? "border-[#332a25] ring-2 ring-[#d6c7b8]"
                      : "border-[#dfd4ca] hover:border-[#a9917f]"
                  }`}
                >
                  <span className="relative block aspect-[4/5] overflow-hidden">
                    {failed ? (
                      <span className="grid h-full place-items-center px-2 text-center text-xs leading-5 text-[#756961]">
                        {t("addPortrait")}
                      </span>
                    ) : (
                      <Image
                        src={model.src}
                        alt={model.label}
                        fill
                        sizes="(min-width: 1280px) 8vw, 28vw"
                        className="object-cover object-top transition duration-300 group-hover:scale-[1.03]"
                        onError={() =>
                          setFailedIds((current) => [...new Set([...current, model.id])])
                        }
                      />
                    )}
                  </span>
                  <span className="block px-2 py-2 text-center text-xs font-medium leading-tight text-[#3f3530]">
                    {model.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-[#e5dcd4] bg-white/55 p-3">
          <label className="flex cursor-pointer items-start gap-2.5">
            <input
              type="checkbox"
              className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-[#c4b5a8] accent-[#2f2723]"
              checked={state.portraitOverlays}
              onChange={(e) => setState({ portraitOverlays: e.target.checked })}
            />
            <span>
              <span className="block text-xs font-medium text-[#5c524c]">{t("portraitOverlayLabel")}</span>
              <span className="mt-0.5 block text-[11px] leading-snug text-[#8f8178]">
                {t("portraitOverlayHint")}
              </span>
            </span>
          </label>
        </div>

        <SliderControl
          label={t("skinDepth")}
          value={state.depth}
          onChange={(depth) => setState({ depth, skinTone: skinToneIdFromDepth(depth) })}
          minLabel={t("fair")}
          maxLabel={t("dark")}
        />

        <div>
          <p className="mb-3 text-sm font-medium text-[#4f443f]">{t("undertone")}</p>
          <SegmentedControl
            value={state.undertone}
            options={undertoneOptions}
            onChange={(undertone) => setState({ undertone: undertone as Undertone })}
          />
        </div>

        <p className="text-xs leading-relaxed text-[#897c74]">{t("skinToneFineTuneIntro")}</p>

        <FineTuneSlider
          label={t("rosyBlue")}
          minLabel={t("rosyBlueMin")}
          maxLabel={t("rosyBlueMax")}
          value={state.rosyBlue}
          onChange={(rosyBlue) => setState({ rosyBlue })}
        />

        <FineTuneSlider
          label={t("goldenOlive")}
          minLabel={t("goldenOliveMin")}
          maxLabel={t("goldenOliveMax")}
          value={state.goldenOlive}
          onChange={(goldenOlive) => setState({ goldenOlive })}
        />

        <FineTuneSlider
          label={t("mutedClear")}
          minLabel={t("mutedClearMin")}
          maxLabel={t("mutedClearMax")}
          value={state.mutedClear}
          onChange={(mutedClear) => setState({ mutedClear })}
        />

        <FineTuneSlider
          label={t("skinFineDepth")}
          minLabel={t("skinFineDepthMin")}
          maxLabel={t("skinFineDepthMax")}
          value={state.skinFineDepth}
          onChange={(skinFineDepth) => setState({ skinFineDepth })}
        />

        <SliderControl
          label={t("contrast")}
          value={state.contrast}
          onChange={(contrast) => setState({ contrast })}
          minLabel={t("soft")}
          maxLabel={t("defined")}
        />
      </div>

      <div className="mt-10 border-t border-[#e1d7ce] pt-6">
        <Link
          href={`/results?${resultQuery}`}
          className="flex w-full items-center justify-center rounded-2xl bg-[#2f2723] px-6 py-4 text-base font-semibold text-[#fff8f1] shadow-[0_18px_38px_rgba(47,39,35,0.24)] transition hover:bg-[#463a33]"
        >
          {t("analyzeCta")}
        </Link>
        <p className="mt-4 text-center text-sm leading-relaxed text-[#897c74]">{t("privacyNote")}</p>
      </div>
    </aside>
  );
}

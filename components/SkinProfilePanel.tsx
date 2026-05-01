"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { SegmentedControl } from "@/components/SegmentedControl";
import { SliderControl } from "@/components/SliderControl";
import {
  portraitModels,
  studioStateToSearchParams,
  usePortraitStudio,
  type Undertone
} from "@/lib/portraitStudioStore";

const undertoneOptions: Array<{ id: Undertone; label: string }> = [
  { id: "cool", label: "Cool" },
  { id: "neutral", label: "Neutral" },
  { id: "warm", label: "Warm" },
  { id: "olive", label: "Olive" }
];

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
  const { state, setState } = usePortraitStudio();
  const [failedIds, setFailedIds] = useState<string[]>([]);
  const resultQuery = useMemo(() => studioStateToSearchParams(state), [state]);

  return (
    <aside className="min-w-0 rounded-2xl border border-[#ddd2c9] bg-[#fcf8f3]/95 p-4 shadow-[0_18px_44px_rgba(85,63,50,0.1)] backdrop-blur sm:p-6 lg:p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[#8a7b72]">
          Virtual model setup
        </p>
        <h2 className="mt-2 text-2xl font-semibold leading-tight text-[#302823]">
          Skin Profile
        </h2>
        <p className="mt-3 text-base leading-relaxed text-[#766861]">
          Select the closest portrait anchor, then tune depth, undertone, saturation,
          and contrast for the 16-season engine.
        </p>
      </div>

      <div className="mt-8 space-y-8" role="region" aria-label="Skin profile controls">
        <div>
          <p className="mb-4 text-sm font-medium text-[#4f443f]">Model anchor</p>
          <div
            className="grid grid-cols-3 gap-2 sm:gap-3"
            aria-label="Photorealistic model anchors"
          >
            {portraitModels.map((model) => {
              const failed = failedIds.includes(model.id);
              const active = model.id === state.modelId;

              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => setState({ modelId: model.id })}
                  aria-label={`Use ${model.label} model anchor`}
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
                        Add portrait
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

        <SliderControl
          label="Skin depth"
          value={state.depth}
          onChange={(depth) => setState({ depth, skinTone: skinToneIdFromDepth(depth) })}
          minLabel="Fair"
          maxLabel="Dark"
        />

        <div>
          <p className="mb-3 text-sm font-medium text-[#4f443f]">Undertone</p>
          <SegmentedControl
            value={state.undertone}
            options={undertoneOptions}
            onChange={(undertone) => setState({ undertone: undertone as Undertone })}
          />
        </div>

        <SliderControl
          label="Saturation"
          value={state.saturation}
          onChange={(saturation) => setState({ saturation })}
          minLabel="Muted"
          maxLabel="Vibrant"
        />

        <SliderControl
          label="Contrast"
          value={state.contrast}
          onChange={(contrast) => setState({ contrast })}
          minLabel="Soft"
          maxLabel="Defined"
        />
      </div>

      <div className="mt-10 border-t border-[#e1d7ce] pt-6">
        <Link
          href={`/results?${resultQuery}`}
          className="flex w-full items-center justify-center rounded-2xl bg-[#2f2723] px-6 py-4 text-base font-semibold text-[#fff8f1] shadow-[0_18px_38px_rgba(47,39,35,0.24)] transition hover:bg-[#463a33]"
        >
          Analyze My Season
        </Link>
        <p className="mt-4 text-center text-sm leading-relaxed text-[#897c74]">
          Image-free by design. Your choices stay private.
        </p>
      </div>
    </aside>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AttributeControl } from "@/components/AttributeControl";
import { PaletteSwatches } from "@/components/PaletteSwatches";
import { ScoreBreakdown } from "@/components/ScoreBreakdown";
import { VirtualModel } from "@/components/VirtualModel";
import {
  attributeOrder,
  modelAttributes,
  normalizeSelections,
  selectionsToSearchParams
} from "@/lib/attributes";
import { getSeasonMatches } from "@/lib/scoring";
import type { AttributeKey, UserSelections } from "@/lib/types";

export default function StudioClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSelections = useMemo(
    () =>
      normalizeSelections(
        Object.fromEntries(searchParams.entries()) as Partial<
          Record<AttributeKey, string>
        >
      ),
    [searchParams]
  );
  const [selections, setSelections] =
    useState<UserSelections>(initialSelections);

  const matches = useMemo(() => getSeasonMatches(selections, 3), [selections]);
  const topMatch = matches[0];

  function updateSelection(key: AttributeKey, value: string) {
    setSelections((current) => ({
      ...current,
      [key]: value
    }));
  }

  function submitAnalysis() {
    router.push(`/results?${selectionsToSearchParams(selections)}`);
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-16 pt-6 sm:px-8 lg:grid-cols-[0.88fr_1.12fr]">
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <div className="glass-panel overflow-hidden rounded-2xl p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-normal text-teal">
                Live model
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-normal text-ink">
                Custom studio
              </h1>
            </div>
            <span className="rounded-full border border-ink/10 bg-white px-3 py-1 text-xs font-semibold text-ink/60">
              {topMatch.percent}% fit
            </span>
          </div>

          <div className="mt-4">
            <VirtualModel selections={selections} palette={topMatch.season.palette} />
          </div>

          <div className="mt-5 rounded-xl border border-ink/10 bg-white/75 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-normal text-ink/50">
                  Leading match
                </p>
                <h2 className="mt-1 text-xl font-semibold text-ink">
                  {topMatch.season.name}
                </h2>
              </div>
              <span className="rounded-full bg-teal px-3 py-1 text-xs font-semibold text-white">
                {topMatch.season.family}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-ink/70">
              {topMatch.season.headline}
            </p>
            <div className="mt-4">
              <ScoreBreakdown items={topMatch.breakdown} />
            </div>
          </div>
        </div>
      </aside>

      <form
        className="glass-panel rounded-2xl p-5 sm:p-6"
        onSubmit={(event) => {
          event.preventDefault();
          submitAnalysis();
        }}
      >
        <div className="flex flex-col gap-4 border-b border-ink/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-rose">
              Attribute controls
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-normal text-ink">
              Shape the virtual model
            </h2>
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper shadow-soft transition hover:-translate-y-0.5 hover:bg-teal"
          >
            Reveal results
          </button>
        </div>

        <div className="mt-6 grid gap-7">
          {attributeOrder.map((key) => {
            const group = modelAttributes.groups.find((item) => item.id === key);

            if (!group) {
              return null;
            }

            return (
              <AttributeControl
                key={group.id}
                group={group}
                value={selections[group.id]}
                onChange={updateSelection}
              />
            );
          })}
        </div>

        <div className="mt-8 rounded-xl border border-ink/10 bg-white/75 p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="max-w-md">
              <p className="text-xs font-semibold uppercase tracking-normal text-ink/50">
                Palette preview
              </p>
              <h3 className="mt-1 text-lg font-semibold text-ink">
                {topMatch.season.name}
              </h3>
              <p className="mt-2 text-sm leading-6 text-ink/60">
                Alternates: {matches.slice(1).map((match) => match.season.name).join(", ")}
              </p>
            </div>
            <div className="w-full md:w-80">
              <PaletteSwatches palette={topMatch.season.palette.slice(0, 4)} compact />
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

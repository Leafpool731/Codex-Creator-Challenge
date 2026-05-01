"use client";

import {
  getPaletteForSeason,
  paletteCategoryLabels,
  paletteCategoryOrder
} from "@/src/data/seasonPalettes";

interface SeasonPaletteGridProps {
  seasonName: string;
}

export function SeasonPaletteGrid({ seasonName }: SeasonPaletteGridProps) {
  const palette = getPaletteForSeason(seasonName);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {paletteCategoryOrder.map((category) => {
        const colors = palette.colors[category];

        return (
          <section
            key={category}
            className="rounded-xl border border-ink/10 bg-white/75 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-ink">
                {paletteCategoryLabels[category]}
              </h3>
              <span className="text-xs font-semibold text-ink/45">{colors.length}</span>
            </div>
            <div
              className="mt-3 grid grid-cols-8 gap-1.5"
              role="list"
              aria-label={`${paletteCategoryLabels[category]} colors`}
            >
              {colors.map((color, index) => (
                <div
                  key={`${category}-${color}-${index}`}
                  className="h-8 rounded-md border border-black/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
                  style={{ backgroundColor: color }}
                  title={color}
                  role="listitem"
                  aria-label={color}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

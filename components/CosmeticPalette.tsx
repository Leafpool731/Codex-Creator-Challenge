import {
  getPaletteForSeason,
  paletteCategoryLabels,
  paletteCategoryOrder
} from "@/src/data/seasonPalettes";

interface CosmeticPaletteProps {
  seasonName: string;
}

export function CosmeticPalette({ seasonName }: CosmeticPaletteProps) {
  const palette = getPaletteForSeason(seasonName);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-ink">Cosmetic palette</h2>
          <p className="mt-1 text-sm leading-6 text-ink/60">
            64 color references for contour, lips, blush, eyes, and accents.
          </p>
        </div>
        <p className="text-xs font-semibold uppercase tracking-normal text-ink/45">
          {palette.season}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
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
                <span className="text-xs font-semibold text-ink/45">
                  {colors.length}
                </span>
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
    </div>
  );
}

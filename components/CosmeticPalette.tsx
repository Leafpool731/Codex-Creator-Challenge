import { getTranslations } from "next-intl/server";
import {
  getPaletteForSeason,
  paletteCategoryOrder,
  type PaletteCategory
} from "@/src/data/seasonPalettes";

interface CosmeticPaletteProps {
  seasonName: string;
}

export async function CosmeticPalette({ seasonName }: CosmeticPaletteProps) {
  const palette = getPaletteForSeason(seasonName);
  const t = await getTranslations("cosmetic");

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">
            {t("title")}
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-ink/60">{t("subtitle")}</p>
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-ink/45">
          {palette.season}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        {paletteCategoryOrder.map((category: PaletteCategory) => {
          const colors = palette.colors[category];
          const categoryTitle = t(`categories.${category}`);

          return (
            <section
              key={category}
              className="rounded-2xl border border-ink/10 bg-white/80 p-5 shadow-[0_2px_16px_rgba(23,19,19,0.05)] sm:p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold tracking-tight text-ink sm:text-base">
                  {categoryTitle}
                </h3>
                <span className="tabular-nums text-xs font-semibold text-ink/45">
                  {colors.length}
                </span>
              </div>
              <div
                className="mt-5 grid grid-cols-4 gap-2 min-[380px]:grid-cols-6 sm:grid-cols-8 sm:gap-2.5"
                role="list"
                aria-label={categoryTitle}
              >
                {colors.map((color, index) => (
                  <div
                    key={`${category}-${color}-${index}`}
                    className="aspect-square min-h-7 rounded-md border border-black/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] sm:h-8 sm:min-h-0 sm:aspect-auto"
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

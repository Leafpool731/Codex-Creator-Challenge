import type { PaletteColor } from "@/lib/types";

interface PaletteSwatchesProps {
  palette: PaletteColor[];
  compact?: boolean;
}

export function PaletteSwatches({ palette, compact = false }: PaletteSwatchesProps) {
  return (
    <div
      className={`grid ${compact ? "grid-cols-4 gap-3" : "grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-4"}`}
      role="list"
      aria-label="Season color palette"
    >
      {palette.map((color) => (
        <div
          key={color.name}
          className="overflow-hidden rounded-xl border border-ink/10 bg-white shadow-[0_2px_12px_rgba(23,19,19,0.06)]"
          role="listitem"
        >
          <div
            className={compact ? "h-14 sm:h-16" : "h-24 sm:h-28"}
            style={{ backgroundColor: color.hex }}
            aria-hidden="true"
          />
          {!compact && (
            <div className="space-y-1 px-4 py-3.5">
              <p className="truncate text-sm font-semibold leading-snug text-ink">{color.name}</p>
              <p className="text-[11px] font-medium uppercase tracking-wider text-ink/45">
                {color.hex}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

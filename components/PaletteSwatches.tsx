import type { PaletteColor } from "@/lib/types";

interface PaletteSwatchesProps {
  palette: PaletteColor[];
  compact?: boolean;
}

export function PaletteSwatches({ palette, compact = false }: PaletteSwatchesProps) {
  return (
    <div
      className={`grid ${compact ? "grid-cols-4 gap-2" : "grid-cols-2 gap-3 sm:grid-cols-4"}`}
      role="list"
      aria-label="Season color palette"
    >
      {palette.map((color) => (
        <div
          key={color.name}
          className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm"
          role="listitem"
        >
          <div
            className={compact ? "h-12" : "h-20"}
            style={{ backgroundColor: color.hex }}
            aria-hidden="true"
          />
          {!compact && (
            <div className="px-3 py-2">
              <p className="truncate text-sm font-semibold text-ink">{color.name}</p>
              <p className="text-xs uppercase tracking-normal text-ink/50">{color.hex}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

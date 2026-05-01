import type { PaletteColor } from "@/lib/types";

interface PaletteSwatchesProps {
  palette: PaletteColor[];
  compact?: boolean;
}

export function PaletteSwatches({ palette, compact = false }: PaletteSwatchesProps) {
  if (compact) {
    return (
      <div
        className="grid grid-cols-4 gap-3 sm:gap-4"
        role="list"
        aria-label="Season color palette"
      >
        {palette.map((color) => (
          <div
            key={color.name}
            className="min-w-0 overflow-hidden rounded-xl border border-ink/10 bg-white shadow-sm"
            role="listitem"
            title={`${color.name} ${color.hex}`}
          >
            <div
              className="aspect-square w-full"
              style={{ backgroundColor: color.hex }}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-4 gap-4"
      role="list"
      aria-label="Season color palette"
    >
      {palette.map((color) => (
        <div
          key={color.name}
          className="min-w-0 overflow-hidden rounded-xl border border-ink/10 bg-white shadow-sm"
          role="listitem"
        >
          <div
            className="aspect-square w-full"
            style={{ backgroundColor: color.hex }}
            aria-hidden="true"
          />
          <div className="border-t border-ink/5 p-3 text-center">
            <div className="line-clamp-2 text-sm font-medium leading-snug text-ink">{color.name}</div>
            <div className="mt-1 text-xs font-medium tabular-nums tracking-wide text-ink/50">
              {color.hex}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

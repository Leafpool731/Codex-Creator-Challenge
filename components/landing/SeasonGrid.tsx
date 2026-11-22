import { paletteForSeason } from "@/lib/palette";
import { seasons, type SeasonFamily } from "@/lib/seasons";

const families: SeasonFamily[] = ["Spring", "Summer", "Autumn", "Winter"];

export function SeasonGrid() {
  return (
    <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {families.map((family) => (
        <div key={family}>
          <h3 className="font-serif text-2xl">{family}</h3>
          <ul className="mt-4 space-y-4">
            {seasons
              .filter((s) => s.family === family)
              .map((s) => {
                const p = paletteForSeason(s);
                return (
                  <li key={s.id}>
                    <div className="flex h-9 overflow-hidden rounded-xl ring-1 ring-ink/5">
                      {[...p.colours.slice(0, 9), ...p.neutrals.slice(1, 4)].map((c) => (
                        <span key={c.name + c.hex} className="flex-1" style={{ backgroundColor: c.hex }} title={c.name} />
                      ))}
                    </div>
                    <p className="mt-2 text-sm font-medium leading-tight">{s.name}</p>
                    <p className="mt-0.5 truncate text-xs text-faint" title={s.headline}>
                      {s.headline}
                    </p>
                  </li>
                );
              })}
          </ul>
        </div>
      ))}
    </div>
  );
}

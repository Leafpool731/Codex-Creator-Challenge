"use client";

import { PortraitCanvas } from "@/components/portrait/PortraitCanvas";
import { paletteForSeason } from "@/lib/palette";
import { profileForModel } from "@/lib/profile";
import { getSeason } from "@/lib/seasons";

const looks = [
  { model: "model-02", season: "light-spring", family: "pink" },
  { model: "model-08", season: "dark-winter", family: "blue" },
  { model: "model-05", season: "soft-autumn", family: "green" }
];

export function HeroPortraits({ caption }: { caption: string }) {
  return (
    <figure>
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {looks.map((look, i) => {
          const season = getSeason(look.season);
          if (!season) return null;
          const swatch = paletteForSeason(season).colours.find((c) => c.family === look.family);
          return (
            <div key={look.model} className={i === 1 ? "translate-y-6" : ""}>
              <div className="overflow-hidden rounded-[22px] border border-line shadow-lift">
                <PortraitCanvas
                  profile={profileForModel(look.model)}
                  drapeHex={swatch?.hex}
                  alt={`${season.name}, ${swatch?.name}`}
                  className="aspect-[3/4] w-full"
                  focus="50% 28%"
                />
              </div>
              <p className="mt-3 text-center text-xs font-medium text-muted">
                <span
                  className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full align-[-1px] ring-1 ring-ink/10"
                  style={{ backgroundColor: swatch?.hex }}
                />
                {season.name}
              </p>
            </div>
          );
        })}
      </div>
      <figcaption className="mt-10 text-center text-xs text-faint">{caption}</figcaption>
    </figure>
  );
}

import seasonData from "@/data/seasons.json";
import type { Coordinates } from "@/lib/profile";

export type SeasonFamily = "Spring" | "Summer" | "Autumn" | "Winter";

/** Which characteristic dominates the season (12/16-season "flow" logic). */
export type SeasonStyle = "light" | "true" | "bright" | "soft" | "deep";

export interface Season {
  id: string;
  name: string;
  family: SeasonFamily;
  headline: string;
  coordinates: Coordinates;
  makeup: {
    lips: string[];
    cheeks: string[];
    eyes: string[];
    avoid: string[];
  };
  jewelry: string;
  rationale: string;
}

export const seasons = seasonData as Season[];

export function getSeason(id: string): Season | undefined {
  return seasons.find((s) => s.id === id);
}

export function seasonStyle(season: Season): SeasonStyle {
  const prefix = season.id.split("-")[0];
  switch (prefix) {
    case "light":
      return "light";
    case "bright":
      return "bright";
    case "soft":
      return "soft";
    case "dark":
      return "deep";
    default:
      return "true";
  }
}

/** Style for arbitrary coordinates (used for the "avoid" palette). */
export function styleForCoordinates(c: Coordinates): SeasonStyle {
  if (c.value < 0.25) return "light";
  if (c.value > 0.8) return "deep";
  if (c.chroma > 0.88) return "bright";
  if (c.chroma < 0.18) return "soft";
  return "true";
}

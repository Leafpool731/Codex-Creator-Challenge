/**
 * Season matching: every season is a point in a continuous 4-axis colour space
 * (temperature, value, chroma, contrast). The profile is projected into the same space
 * and seasons are ranked by weighted distance. Continuous inputs mean results don't tie,
 * and confidence comes from how clearly the winner beats the runner-up.
 */

import { profileCoordinates, type Coordinates, type Profile } from "@/lib/profile";
import { seasons, type Season } from "@/lib/seasons";

export type Axis = keyof Coordinates;

export const axes: Axis[] = ["temperature", "value", "chroma", "contrast"];

/** Temperature spans −1…1, so its unit range is 2. */
const axisRange: Record<Axis, number> = { temperature: 2, value: 1, chroma: 1, contrast: 1 };

/** Temperature is the primary split in seasonal analysis; contrast the most forgiving. */
const axisWeight: Record<Axis, number> = { temperature: 1.35, value: 1, chroma: 1.05, contrast: 0.7 };

const SIGMA = 0.24;

export interface AxisFit {
  axis: Axis;
  profile: number;
  season: number;
  /** 0–1 closeness on this axis */
  fit: number;
}

export interface SeasonMatch {
  season: Season;
  distance: number;
  /** 0–100 similarity between profile and season centre */
  match: number;
  axes: AxisFit[];
}

export interface Analysis {
  coordinates: Coordinates;
  matches: SeasonMatch[];
  top: SeasonMatch;
  confidence: "strong" | "moderate" | "close";
  /** Distance gap between #1 and #2 relative to #1 — larger is more decisive. */
  margin: number;
}

function normalisedDelta(axis: Axis, a: number, b: number): number {
  return Math.abs(a - b) / axisRange[axis];
}

export function matchSeason(coords: Coordinates, season: Season): SeasonMatch {
  let sum = 0;
  let weightTotal = 0;
  const fits: AxisFit[] = axes.map((axis) => {
    const delta = normalisedDelta(axis, coords[axis], season.coordinates[axis]);
    sum += axisWeight[axis] * delta * delta;
    weightTotal += axisWeight[axis];
    return {
      axis,
      profile: coords[axis],
      season: season.coordinates[axis],
      fit: Math.max(0, 1 - delta / 0.5)
    };
  });
  const distance = Math.sqrt(sum / weightTotal);
  return {
    season,
    distance,
    match: Math.round(100 * Math.exp(-(distance * distance) / (2 * SIGMA * SIGMA))),
    axes: fits
  };
}

export function analyse(profile: Profile): Analysis {
  const coordinates = profileCoordinates(profile);
  const matches = seasons
    .map((season) => matchSeason(coordinates, season))
    .sort((a, b) => a.distance - b.distance);
  const [top, second] = matches;
  const margin = (second.distance - top.distance) / Math.max(top.distance, 0.02);
  const confidence = margin > 0.35 ? "strong" : margin > 0.12 ? "moderate" : "close";
  return { coordinates, matches, top, confidence, margin };
}

export type FitLevel = "strong" | "good" | "possible" | "weak";

/**
 * Words instead of percentages: the inputs are self-reported and the model isn't yet
 * validated against professional analysts, so a number like "87%" would overstate
 * precision. The underlying match value is still used for ranking.
 */
export function fitLevel(match: number): FitLevel {
  if (match >= 85) return "strong";
  if (match >= 70) return "good";
  if (match >= 55) return "possible";
  return "weak";
}

/** Human-readable position on each axis, for result copy. */
export function describeAxis(axis: Axis, value: number): string {
  switch (axis) {
    case "temperature":
      return value <= -0.55 ? "cool" : value <= -0.15 ? "cool-neutral" : value < 0.15 ? "neutral" : value < 0.55 ? "warm-neutral" : "warm";
    case "value":
      return value < 0.3 ? "light" : value < 0.6 ? "medium" : value < 0.8 ? "medium-deep" : "deep";
    case "chroma":
      return value < 0.3 ? "soft" : value < 0.6 ? "balanced" : value < 0.85 ? "clear" : "vivid";
    case "contrast":
      return value < 0.35 ? "low" : value < 0.65 ? "medium" : "high";
  }
}

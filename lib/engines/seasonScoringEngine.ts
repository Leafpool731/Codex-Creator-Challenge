import {
  buildResultExplanation,
  getSeasonMatches,
  scoreSeason,
  seasons
} from "@/lib/scoring";
import type { Season, SeasonScore, UserSelections } from "@/lib/types";

export { buildResultExplanation, getSeasonMatches, scoreSeason, seasons };

export function formatConfidenceDisclaimer(): string {
  return "This is a transparent rule-based fit, not a clinical or genetic diagnosis. Use it as a styling compass alongside what you see in the mirror.";
}

export function describeConfidenceBand(percent: number): string {
  if (percent >= 78) {
    return "Strong agreement across depth, undertone, chroma, and contrast signals.";
  }

  if (percent >= 64) {
    return "Solid agreement with a few softer signals—alternates stay plausible.";
  }

  return "Several seasons remain close; small tweaks to depth or undertone may shift the leader.";
}

import seasonData from "@/data/seasons.json";
import {
  getAttributeOption,
  getSelectionLabels,
  normalizeSelections
} from "@/lib/attributes";
import type {
  ChromaValue,
  ContrastValue,
  ModelOption,
  Season,
  SeasonProfile,
  SeasonScore,
  Temperature,
  UserSelections
} from "@/lib/types";

export const seasons = seasonData as Season[];

const temperatureAxis: Record<Temperature, number> = {
  cool: -2,
  "neutral-cool": -1,
  neutral: 0,
  "neutral-warm": 1,
  warm: 2
};

const chromaAxis: Record<ChromaValue, number> = {
  soft: 0,
  medium: 1,
  bright: 2
};

const contrastAxis: Record<ContrastValue, number> = {
  low: 0,
  medium: 1,
  high: 2
};

const maxScore = {
  skinDepth: 18,
  undertone: 28,
  chroma: 20,
  contrast: 18,
  eyes: 10,
  hair: 14
};

const totalMaxScore = Object.values(maxScore).reduce(
  (total, value) => total + value,
  0
);

function roundScore(value: number): number {
  return Math.round(value * 10) / 10;
}

function clampScore(value: number, max: number): number {
  return Math.max(0, Math.min(max, value));
}

function depthScore(
  selectedDepth: number,
  range: [number, number],
  idealDepth: number,
  max: number
): number {
  const [minimum, maximum] = range;
  const outsideDistance =
    selectedDepth < minimum
      ? minimum - selectedDepth
      : selectedDepth > maximum
        ? selectedDepth - maximum
        : 0;

  if (outsideDistance > 0) {
    return roundScore(clampScore(max - outsideDistance * 5.5, max));
  }

  const idealDistance = Math.abs(selectedDepth - idealDepth);
  return roundScore(clampScore(max - idealDistance * 1.45, max));
}

function axisScore<T extends string>(
  selected: T | undefined,
  target: T,
  axis: Record<T, number>,
  max: number
): number {
  if (!selected) {
    return max * 0.35;
  }

  const distance = Math.abs(axis[selected] - axis[target]);

  if (distance === 0) {
    return max;
  }

  if (distance === 1) {
    return roundScore(max * 0.58);
  }

  return roundScore(max * 0.18);
}

function temperatureScore(
  selectedTemperature: Temperature | undefined,
  targetTemperature: Temperature,
  max: number
): number {
  if (!selectedTemperature) {
    return max * 0.35;
  }

  const distance = Math.abs(
    temperatureAxis[selectedTemperature] - temperatureAxis[targetTemperature]
  );

  const multipliers = [1, 0.82, 0.56, 0.28, 0.08];
  return roundScore(max * (multipliers[distance] ?? 0.08));
}

function undertoneScore(
  selectedUndertone: ModelOption,
  profile: SeasonProfile
): number {
  if (profile.undertones.includes(selectedUndertone.id)) {
    return maxScore.undertone;
  }

  const temperaturePoints = temperatureScore(
    selectedUndertone.temperature,
    profile.temperature,
    maxScore.undertone
  );

  return roundScore(temperaturePoints * 0.92);
}

function describeTemperature(temperature: Temperature): string {
  const labels: Record<Temperature, string> = {
    cool: "cool",
    "neutral-cool": "cool-neutral",
    neutral: "neutral",
    "neutral-warm": "warm-neutral",
    warm: "warm"
  };

  return labels[temperature];
}

function strongestReasons(
  season: Season,
  selections: UserSelections,
  breakdown: SeasonScore["breakdown"]
): string[] {
  const labels = Object.fromEntries(
    getSelectionLabels(selections).map((item) => [item.key, item.value])
  ) as Record<keyof UserSelections, string>;

  const ranked = [...breakdown]
    .map((item) => ({
      ...item,
      ratio: item.value / item.max
    }))
    .sort((a, b) => b.ratio - a.ratio)
    .slice(0, 3);

  const reasonMap: Record<string, string> = {
    "Skin depth": `${labels.skinDepth} skin depth sits inside the ${season.name} value range.`,
    Undertone: `${labels.undertone} undertone aligns with ${describeTemperature(
      season.profile.temperature
    )} seasonal temperature.`,
    Chroma: `${labels.chroma} chroma supports the ${season.profile.chroma} clarity expected for ${season.name}.`,
    Contrast: `${labels.contrast} contrast matches the season's ${season.profile.contrast} contrast pattern.`,
    Eyes: `${labels.eyeColor} eyes reinforce the season's depth and color temperature.`,
    Hair: `${labels.hairColor} hair keeps the overall depth and temperature in range.`
  };

  return ranked.map((item) => reasonMap[item.label]);
}

export function scoreSeason(
  selectionsInput?: Partial<Record<keyof UserSelections, string | string[] | undefined>>,
  season?: Season
): SeasonScore {
  const selections = normalizeSelections(selectionsInput);
  const targetSeason = season ?? seasons[0];
  const skinDepth = getAttributeOption("skinDepth", selections.skinDepth);
  const undertone = getAttributeOption("undertone", selections.undertone);
  const chroma = getAttributeOption("chroma", selections.chroma);
  const contrast = getAttributeOption("contrast", selections.contrast);
  const eyes = getAttributeOption("eyeColor", selections.eyeColor);
  const hair = getAttributeOption("hairColor", selections.hairColor);

  const skinDepthValue = skinDepth.depthValue ?? targetSeason.profile.idealDepth;
  const eyeDepthValue = eyes.depthValue ?? targetSeason.profile.idealDepth;
  const hairDepthValue = hair.depthValue ?? targetSeason.profile.idealDepth;

  const skinDepthPoints = depthScore(
    skinDepthValue,
    targetSeason.profile.depthRange,
    targetSeason.profile.idealDepth,
    maxScore.skinDepth
  );
  const undertonePoints = undertoneScore(undertone, targetSeason.profile);
  const chromaPoints = axisScore(
    chroma.chroma,
    targetSeason.profile.chroma,
    chromaAxis,
    maxScore.chroma
  );
  const contrastPoints = axisScore(
    contrast.contrast,
    targetSeason.profile.contrast,
    contrastAxis,
    maxScore.contrast
  );

  const eyePoints = roundScore(
    depthScore(
      eyeDepthValue,
      targetSeason.profile.eyeDepthRange,
      targetSeason.profile.idealDepth,
      4.5
    ) +
      temperatureScore(eyes.temperature, targetSeason.profile.temperature, 3.5) +
      axisScore(eyes.chroma, targetSeason.profile.chroma, chromaAxis, 2)
  );

  const hairPoints = roundScore(
    depthScore(
      hairDepthValue,
      targetSeason.profile.hairDepthRange,
      targetSeason.profile.idealDepth,
      6
    ) +
      temperatureScore(hair.temperature, targetSeason.profile.temperature, 5) +
      axisScore(hair.chroma, targetSeason.profile.chroma, chromaAxis, 3)
  );

  const breakdown = [
    { label: "Skin depth", value: skinDepthPoints, max: maxScore.skinDepth },
    { label: "Undertone", value: undertonePoints, max: maxScore.undertone },
    { label: "Chroma", value: chromaPoints, max: maxScore.chroma },
    { label: "Contrast", value: contrastPoints, max: maxScore.contrast },
    { label: "Eyes", value: eyePoints, max: maxScore.eyes },
    { label: "Hair", value: hairPoints, max: maxScore.hair }
  ];

  const score = roundScore(
    breakdown.reduce((total, item) => total + item.value, 0)
  );
  const percent = Math.round((score / totalMaxScore) * 100);

  return {
    season: targetSeason,
    score,
    percent,
    reasons: strongestReasons(targetSeason, selections, breakdown),
    breakdown
  };
}

export function getSeasonMatches(
  selectionsInput?: Partial<Record<keyof UserSelections, string | string[] | undefined>>,
  limit = 3
): SeasonScore[] {
  return seasons
    .map((season) => scoreSeason(selectionsInput, season))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function buildResultExplanation(match: SeasonScore): string {
  const signals = match.reasons
    .map((reason) => reason.replace(/\.$/, ""))
    .map((reason) => reason.charAt(0).toLowerCase() + reason.slice(1))
    .join("; ");

  return `${match.season.rationale} The top scoring signals were ${signals}.`;
}

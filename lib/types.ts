export type AttributeKey =
  | "skinDepth"
  | "undertone"
  | "chroma"
  | "contrast";

export type Temperature =
  | "cool"
  | "neutral-cool"
  | "neutral"
  | "neutral-warm"
  | "warm";

export type ChromaValue = "soft" | "medium" | "bright";
export type ContrastValue = "low" | "medium" | "high";

export type UserSelections = Record<AttributeKey, string>;

export interface ModelOption {
  id: string;
  label: string;
  description: string;
  hex?: string;
  value?: string;
  depthValue?: number;
  temperature?: Temperature;
  chroma?: ChromaValue;
  contrast?: ContrastValue;
}

export interface ModelAttributeGroup {
  id: AttributeKey;
  label: string;
  helper: string;
  defaultOption: string;
  options: ModelOption[];
}

export interface ModelAttributeData {
  groups: ModelAttributeGroup[];
}

export interface SeasonProfile {
  temperature: Temperature;
  undertones: string[];
  depthRange: [number, number];
  idealDepth: number;
  hairDepthRange: [number, number];
  eyeDepthRange: [number, number];
  chroma: ChromaValue;
  contrast: ContrastValue;
}

export interface PaletteColor {
  name: string;
  hex: string;
}

export interface Season {
  id: string;
  name: string;
  family: "Spring" | "Summer" | "Autumn" | "Winter";
  headline: string;
  profile: SeasonProfile;
  palette: PaletteColor[];
  makeup: {
    lips: string[];
    cheeks: string[];
    eyes: string[];
    avoid: string[];
  };
  jewelry: string;
  rationale: string;
}

export interface ScoreBreakdownItem {
  label: string;
  value: number;
  max: number;
}

export interface SeasonScore {
  season: Season;
  score: number;
  percent: number;
  reasons: string[];
  breakdown: ScoreBreakdownItem[];
}

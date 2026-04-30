import type { CSSProperties } from "react";

export type Undertone = "cool" | "neutral" | "warm" | "olive";
export type LightingPreset = "daylight" | "warm" | "cool" | "soft" | "evening";

export interface FeatureMaskRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const FEATURE_MASKS = {
  hair: { x: 50, y: 23, width: 58, height: 42 },
  hairLeft: { x: 29, y: 33, width: 22, height: 40 },
  hairRight: { x: 71, y: 33, width: 22, height: 40 },
  hairCrown: { x: 50, y: 12, width: 44, height: 20 },
  leftIris: { x: 44.5, y: 39.5, width: 2.4, height: 2.2 },
  rightIris: { x: 55.5, y: 39.5, width: 2.4, height: 2.2 },
  lips: { x: 50, y: 58, width: 17, height: 4.5 },
  leftCheek: { x: 37, y: 49, width: 30, height: 14 },
  rightCheek: { x: 63, y: 49, width: 30, height: 14 },
  freckles: { x: 50, y: 46.5, width: 42, height: 18 }
} satisfies Record<string, FeatureMaskRegion>;

export const FEATURE_SHAPES = {
  hair:
    "radial-gradient(ellipse 52% 62% at 50% 47%, #000 0%, #000 62%, transparent 78%)",
  sideHair:
    "radial-gradient(ellipse 55% 62% at 50% 45%, #000 0%, #000 55%, transparent 78%)",
  crown:
    "radial-gradient(ellipse 48% 50% at 50% 58%, #000 0%, #000 60%, transparent 82%)",
  iris:
    "radial-gradient(ellipse 52% 52% at 50% 50%, #000 0%, #000 58%, transparent 80%)",
  lips:
    "radial-gradient(ellipse 52% 50% at 50% 50%, #000 0%, #000 56%, transparent 82%)",
  cheek:
    "radial-gradient(ellipse 50% 52% at 50% 50%, #000 0%, #000 42%, transparent 78%)",
  freckles:
    "radial-gradient(ellipse 50% 50% at 50% 50%, #000 0%, #000 68%, transparent 100%)"
};

export function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

export function maskStyle(maskImage: string): CSSProperties {
  return {
    WebkitMaskImage: maskImage,
    maskImage,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskSize: "100% 100%",
    maskSize: "100% 100%"
  };
}

export function regionStyle(region: FeatureMaskRegion): CSSProperties {
  return {
    left: `${region.x}%`,
    top: `${region.y}%`,
    width: `${region.width}%`,
    height: `${region.height}%`,
    transform: "translate(-50%, -50%)"
  };
}

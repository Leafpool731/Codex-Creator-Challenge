import type { CSSProperties } from "react";
import { MASK_REGIONS } from "@/lib/segmentation/maskRegions";

export type Undertone = "cool" | "neutral" | "warm" | "olive";
export type LightingPreset = "daylight" | "warm" | "cool" | "soft" | "evening";

export type FeatureMaskRegion = import("@/lib/segmentation/maskRegions").MaskRegion;

export const FEATURE_MASKS = MASK_REGIONS;

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

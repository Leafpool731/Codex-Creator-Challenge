"use client";

import { BlushOverlay } from "@/components/portrait/BlushOverlay";
import { EyeColorOverlay } from "@/components/portrait/EyeColorOverlay";
import { FrecklesOverlay } from "@/components/portrait/FrecklesOverlay";
import { HairColorOverlay } from "@/components/portrait/HairColorOverlay";
import { LightingOverlay, getLightingOverlay } from "@/components/portrait/LightingOverlay";
import { LipTintOverlay } from "@/components/portrait/LipTintOverlay";
import { SkinToneOverlay } from "@/components/portrait/SkinToneOverlay";
import {
  FEATURE_MASKS,
  FEATURE_SHAPES,
  clamp,
  maskStyle,
  regionStyle,
  type LightingPreset,
  type Undertone
} from "@/components/portrait/featureMasks";
import type { PortraitEditType } from "@/lib/cache/cacheKey";

export type { LightingPreset, Undertone } from "@/components/portrait/featureMasks";

export interface PortraitOverlaysProps {
  skinTone: string;
  undertone: Undertone;
  depth: number;
  saturation: number;
  blush: number;
  freckles: number;
  hairColor?: string;
  hairIntensity?: number;
  eyeColor?: string;
  lipColor?: string;
  lipTint?: number;
  lightingPreset: LightingPreset;
  lightIntensity: number;
  environment: number;
  warmth: number;
  showMasks?: boolean;
  refinedEditType?: PortraitEditType;
}

export function getPortraitFilter(settings: Pick<
  PortraitOverlaysProps,
  "depth" | "saturation" | "lightingPreset"
>): string {
  const depth = clamp(settings.depth);
  const saturation = clamp(settings.saturation);
  const depthBrightness = 1.08 - depth * 0.0035;
  const depthContrast = 0.96 + depth * 0.004;
  const saturationValue = 0.75 + saturation * 0.008;
  const presetFilter =
    settings.lightingPreset === "warm"
      ? "sepia(0.08)"
      : settings.lightingPreset === "cool"
        ? "sepia(0.02)"
        : settings.lightingPreset === "soft"
          ? "contrast(0.98)"
          : "sepia(0)";

  return [
    `brightness(${depthBrightness.toFixed(3)})`,
    `contrast(${depthContrast.toFixed(3)})`,
    `saturate(${saturationValue.toFixed(3)})`,
    presetFilter
  ].join(" ");
}

function FeatureMaskDebug() {
  return (
    <>
      <div
        className="pointer-events-none absolute"
        style={{
          ...regionStyle(FEATURE_MASKS.hair),
          ...maskStyle(FEATURE_SHAPES.hair),
          backgroundColor: "rgba(0, 100, 255, 0.42)"
        }}
      />
      {[FEATURE_MASKS.leftIris, FEATURE_MASKS.rightIris].map((region, index) => (
        <div
          key={index === 0 ? "left-iris" : "right-iris"}
          className="pointer-events-none absolute"
          style={{
            ...regionStyle(region),
            ...maskStyle(FEATURE_SHAPES.iris),
            backgroundColor: "rgba(0, 180, 90, 0.68)"
          }}
        />
      ))}
      <div
        className="pointer-events-none absolute"
        style={{
          ...regionStyle(FEATURE_MASKS.lips),
          ...maskStyle(FEATURE_SHAPES.lips),
          backgroundColor: "rgba(255, 0, 0, 0.52)"
        }}
      />
      {[FEATURE_MASKS.leftCheek, FEATURE_MASKS.rightCheek].map((region, index) => (
        <div
          key={index === 0 ? "left-cheek" : "right-cheek"}
          className="pointer-events-none absolute"
          style={{
            ...regionStyle(region),
            ...maskStyle(FEATURE_SHAPES.cheek),
            backgroundColor: "rgba(255, 105, 180, 0.45)"
          }}
        />
      ))}
      <div
        className="pointer-events-none absolute"
        style={{
          ...regionStyle(FEATURE_MASKS.freckles),
          ...maskStyle(FEATURE_SHAPES.freckles),
          backgroundColor: "rgba(255, 140, 0, 0.42)"
        }}
      />
    </>
  );
}

export function PortraitOverlays(props: PortraitOverlaysProps) {
  const depth = clamp(props.depth);
  const lighting = getLightingOverlay(
    props.lightingPreset,
    props.lightIntensity,
    props.environment,
    props.warmth
  );
  const depthOverlayOpacity = 0.04 + depth * 0.002;
  const skinAlpha = Math.max(0.08, Math.min(0.34, 0.15 + depthOverlayOpacity * 0.45));

  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ borderRadius: "inherit" }}
    >
      <SkinToneOverlay
        skinTone={props.skinTone}
        undertone={props.undertone}
        opacity={skinAlpha}
      />
      {props.refinedEditType !== "blush" ? <BlushOverlay blush={props.blush} /> : null}
      {props.refinedEditType !== "freckles" ? (
        <FrecklesOverlay freckles={props.freckles} />
      ) : null}
      {props.refinedEditType !== "hair" ? (
        <HairColorOverlay
          color={props.hairColor ?? "#2A211D"}
          intensity={props.hairIntensity}
        />
      ) : null}
      {props.refinedEditType !== "eyes" ? (
        <EyeColorOverlay color={props.eyeColor ?? "#5A3825"} />
      ) : null}
      {props.refinedEditType !== "lips" ? (
        <LipTintOverlay color={props.lipColor ?? "#9E484E"} tint={props.lipTint} />
      ) : null}
      <LightingOverlay lighting={lighting} />
      {props.showMasks ? <FeatureMaskDebug /> : null}
    </div>
  );
}

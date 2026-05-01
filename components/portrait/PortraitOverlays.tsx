"use client";

import { LightingOverlay, getLightingOverlay } from "@/components/portrait/LightingOverlay";
import { SkinToneOverlay } from "@/components/portrait/SkinToneOverlay";
import { clamp, type LightingPreset, type Undertone } from "@/components/portrait/featureMasks";
import type { SkinToneAdjustments } from "@/lib/skinTone/adjustSkinTone";

export type { LightingPreset, Undertone } from "@/components/portrait/featureMasks";

export interface PortraitOverlaysProps {
  skinToneHex: string;
  undertone: Undertone;
  depth: number;
  skinAdjustments: SkinToneAdjustments;
  lightingPreset: LightingPreset;
  lightIntensity: number;
  environment: number;
  warmth: number;
}

export function PortraitOverlays(props: PortraitOverlaysProps) {
  const lighting = getLightingOverlay(
    props.lightingPreset,
    props.lightIntensity,
    props.environment,
    props.warmth
  );

  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ borderRadius: "inherit" }}
    >
      <SkinToneOverlay
        skinToneHex={props.skinToneHex}
        undertone={props.undertone}
        depth={clamp(props.depth)}
        skinAdjustments={props.skinAdjustments}
      />
      <LightingOverlay lighting={lighting} />
    </div>
  );
}

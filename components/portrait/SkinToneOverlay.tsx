"use client";

import {
  compositeSkinColor,
  skinToneLayerOpacity
} from "@/lib/skinTone/compositeSkinColor";
import type { Undertone } from "@/components/portrait/featureMasks";
import type { SkinToneAdjustments } from "@/lib/skinTone/adjustSkinTone";

/** Elliptical mask: face only; hair/background stay out of the skin tint. */
const FACE_MASK =
  "radial-gradient(ellipse 68% 76% at 50% 44%, #000 0%, #000 52%, transparent 74%)";

interface SkinToneOverlayProps {
  /** Matrix-driven base hex (see data/skinDepthHex.json) */
  skinToneHex: string;
  undertone: Undertone;
  /** Fine depth tuning 0–100 */
  depth: number;
  skinAdjustments: SkinToneAdjustments;
}

export function SkinToneOverlay({
  skinToneHex,
  undertone,
  depth,
  skinAdjustments
}: SkinToneOverlayProps) {
  const fill = compositeSkinColor(skinToneHex, undertone, depth, skinAdjustments);
  const opacity = skinToneLayerOpacity(depth);

  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        borderRadius: "inherit",
        WebkitMaskImage: FACE_MASK,
        maskImage: FACE_MASK,
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        backgroundColor: fill,
        opacity,
        mixBlendMode: "color"
      }}
    />
  );
}

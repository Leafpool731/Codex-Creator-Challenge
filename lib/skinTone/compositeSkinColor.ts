import type { Undertone } from "@/components/portrait/featureMasks";
import { getRealisticSkinTone } from "@/src/lib/color/skinToneMixer";
import {
  adjustSkinTone,
  type SkinToneAdjustments
} from "@/lib/skinTone/adjustSkinTone";

export function compositeSkinColor(
  baseHex: string,
  undertone: Undertone,
  depth: number,
  adjustments: SkinToneAdjustments
): string {
  const base = getRealisticSkinTone({
    baseToneHex: baseHex,
    depthValue: depth,
    undertone,
    rosyBlue: adjustments.rosyBlue,
    goldenOlive: adjustments.goldenOlive,
    mutedClear: adjustments.mutedClear
  });
  return adjustSkinTone(base, adjustments);
}

/**
 * Preview blend strength (face mask only). Not tied to depth — depth drives hue in {@link getRealisticSkinTone}.
 */
export function skinToneLayerOpacity(mutedClear: number): number {
  const t = (Math.max(-50, Math.min(50, mutedClear)) + 50) / 100;
  return 0.48 + t * 0.14;
}

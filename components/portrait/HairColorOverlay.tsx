import type { CSSProperties } from "react";
import {
  FEATURE_MASKS,
  FEATURE_SHAPES,
  clamp,
  maskStyle,
  regionStyle
} from "@/components/portrait/featureMasks";

interface HairColorOverlayProps {
  color: string;
  intensity?: number;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : clean;

  return {
    r: Number.parseInt(full.slice(0, 2), 16),
    g: Number.parseInt(full.slice(2, 4), 16),
    b: Number.parseInt(full.slice(4, 6), 16)
  };
}

function luminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function layerStyle(
  color: string,
  opacity: number,
  mixBlendMode: CSSProperties["mixBlendMode"]
): CSSProperties {
  return {
    backgroundColor: color,
    opacity,
    mixBlendMode
  };
}

export function HairColorOverlay({
  color,
  intensity = 75
}: HairColorOverlayProps) {
  const strength = clamp(intensity) / 100;
  const lightness = luminance(color);
  const isDark = lightness < 92;
  const isLight = lightness > 160;
  const colorOpacity = 0.35 + strength * 0.25;
  const shadowOpacity = isDark ? 0.18 + strength * 0.24 : 0.05 + strength * 0.08;
  const shineOpacity = isLight ? 0.12 + strength * 0.2 : 0.05 + strength * 0.08;

  return (
    <>
      <div
        className="pointer-events-none absolute"
        style={{
          ...regionStyle(FEATURE_MASKS.hair),
          ...maskStyle(FEATURE_SHAPES.hair),
          borderRadius: "48% 48% 42% 42%",
          ...layerStyle(color, colorOpacity, "color")
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          ...regionStyle(FEATURE_MASKS.hair),
          ...maskStyle(FEATURE_SHAPES.hair),
          borderRadius: "48% 48% 42% 42%",
          ...layerStyle(color, shadowOpacity, isDark ? "multiply" : "soft-light")
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          ...regionStyle(FEATURE_MASKS.hairLeft),
          ...maskStyle(FEATURE_SHAPES.sideHair),
          ...layerStyle(color, colorOpacity * 0.88, isDark ? "multiply" : "color")
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          ...regionStyle(FEATURE_MASKS.hairRight),
          ...maskStyle(FEATURE_SHAPES.sideHair),
          ...layerStyle(color, colorOpacity * 0.88, isDark ? "multiply" : "color")
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          ...regionStyle(FEATURE_MASKS.hairCrown),
          ...maskStyle(FEATURE_SHAPES.crown),
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.46) 48%, transparent 100%)",
          opacity: shineOpacity,
          mixBlendMode: isLight ? "screen" : "soft-light"
        }}
      />
    </>
  );
}

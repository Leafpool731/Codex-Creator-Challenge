import type { CSSProperties } from "react";
import { clamp, type LightingPreset } from "@/components/portrait/featureMasks";

export function getLightingOverlay(
  lightingPreset: LightingPreset,
  lightIntensity: number,
  environment: number,
  warmth: number
): {
  gradient: string;
  tint: string;
  blendMode: CSSProperties["mixBlendMode"];
  overlayOpacity: number;
  vignette: string;
} {
  const intensity = clamp(lightIntensity) / 100;
  const ambient = clamp(environment) / 100;
  const warmScale = (clamp(warmth) - 50) / 50;
  const warmthTint =
    warmScale >= 0
      ? `rgba(255, 206, 152, ${(Math.abs(warmScale) * 0.14).toFixed(3)})`
      : `rgba(183, 204, 236, ${(Math.abs(warmScale) * 0.14).toFixed(3)})`;

  const base = {
    gradient:
      "radial-gradient(circle at 45% 20%, rgba(255,255,245,.22), transparent 38%)",
    tint: warmthTint,
    blendMode: "soft-light" as const,
    overlayOpacity: 0.45 + intensity * 0.35,
    vignette: `inset 0 -120px 140px rgba(36, 28, 23, ${(0.14 - ambient * 0.08).toFixed(3)})`
  };

  if (lightingPreset === "warm") {
    return {
      ...base,
      tint: "rgba(255, 202, 150, 0.18)",
      gradient:
        "radial-gradient(circle at 43% 18%, rgba(255,238,208,0.28), transparent 40%)"
    };
  }

  if (lightingPreset === "cool") {
    return {
      ...base,
      tint: "rgba(185, 205, 235, 0.16)",
      gradient:
        "radial-gradient(circle at 47% 20%, rgba(233,244,255,0.22), transparent 40%)"
    };
  }

  if (lightingPreset === "soft") {
    return {
      ...base,
      tint: "rgba(255, 240, 225, 0.14)",
      gradient:
        "radial-gradient(circle at 45% 24%, rgba(255,250,242,0.24), transparent 44%)"
    };
  }

  if (lightingPreset === "evening") {
    return {
      ...base,
      tint: "rgba(130, 95, 125, 0.16)",
      gradient:
        "radial-gradient(circle at 50% 22%, rgba(242,220,206,0.18), transparent 46%)",
      vignette: `inset 0 0 90px rgba(42, 27, 38, ${(0.2 + (1 - ambient) * 0.16).toFixed(3)})`
    };
  }

  return base;
}

interface LightingOverlayProps {
  lighting: ReturnType<typeof getLightingOverlay>;
}

export function LightingOverlay({ lighting }: LightingOverlayProps) {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: "inherit",
          backgroundImage: lighting.gradient,
          opacity: lighting.overlayOpacity,
          mixBlendMode: lighting.blendMode,
          boxShadow: lighting.vignette
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: "inherit",
          backgroundColor: lighting.tint,
          mixBlendMode: "soft-light",
          opacity: 0.92
        }}
      />
    </>
  );
}

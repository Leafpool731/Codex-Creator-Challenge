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
      ? `rgba(255, 213, 178, ${(Math.abs(warmScale) * 0.075).toFixed(3)})`
      : `rgba(210, 225, 248, ${(Math.abs(warmScale) * 0.075).toFixed(3)})`;

  const base = {
    gradient:
      "radial-gradient(circle at 50% 20%, rgba(255,255,240,0.18), transparent 40%)",
    tint: warmthTint,
    blendMode: "soft-light" as const,
    overlayOpacity: 0.34 + intensity * 0.24,
    vignette: `inset 0 0 120px rgba(55, 42, 36, ${(0.055 - ambient * 0.03).toFixed(3)})`
  };

  if (lightingPreset === "warm") {
    return {
      ...base,
      tint: "rgba(255, 218, 184, 0.09)",
      gradient:
        "radial-gradient(circle at 45% 25%, rgba(255,220,180,0.18), transparent 45%)"
    };
  }

  if (lightingPreset === "cool") {
    return {
      ...base,
      tint: "rgba(220, 235, 255, 0.08)",
      gradient:
        "radial-gradient(circle at 50% 20%, rgba(220,235,255,0.16), transparent 45%)"
    };
  }

  if (lightingPreset === "soft") {
    return {
      ...base,
      tint: "rgba(255, 246, 236, 0.06)",
      gradient: "radial-gradient(circle at 50% 22%, rgba(255,255,248,0.1), transparent 52%)",
      overlayOpacity: 0.2 + intensity * 0.14,
      vignette: `inset 0 0 95px rgba(70, 54, 48, ${(0.035 - ambient * 0.02).toFixed(3)})`
    };
  }

  if (lightingPreset === "evening") {
    return {
      ...base,
      tint: "rgba(110, 78, 94, 0.06)",
      gradient:
        "radial-gradient(circle at center, transparent 60%, rgba(40,25,30,0.18) 100%)",
      overlayOpacity: 0.26 + intensity * 0.18,
      vignette: "none"
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

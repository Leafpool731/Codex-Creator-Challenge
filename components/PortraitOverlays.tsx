"use client";

import type { CSSProperties } from "react";

export type Undertone = "cool" | "neutral" | "warm" | "olive";

export interface PortraitOverlaysProps {
  skinTone: string;
  undertone: Undertone;
  depth: number;
  saturation: number;
  blush: number;
  freckles: number;
  hairColor?: string;
  eyeColor?: string;
  lipColor?: string;
  lipTint?: number;
  lightingPreset: "daylight" | "warm" | "cool" | "soft" | "evening";
  lightIntensity: number;
  environment: number;
  warmth: number;
  showMasks?: boolean;
}

type FeatureMaskKey = "hair" | "leftEye" | "rightEye" | "lips";

interface FeatureMaskRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const FEATURE_MASKS = {
  hair: { x: 50, y: 20, width: 52, height: 34 },
  leftEye: { x: 43, y: 43, width: 2.6, height: 2.4 },
  rightEye: { x: 57, y: 43, width: 2.6, height: 2.4 },
  lips: { x: 50, y: 58, width: 17, height: 4.5 }
} satisfies Record<FeatureMaskKey, FeatureMaskRegion>;

const FEATURE_SHAPES = {
  hair:
    "radial-gradient(ellipse 52% 62% at 50% 47%, #000 0%, #000 58%, transparent 76%)",
  iris:
    "radial-gradient(ellipse 52% 52% at 50% 50%, #000 0%, #000 58%, transparent 80%)",
  lips:
    "radial-gradient(ellipse 52% 50% at 50% 50%, #000 0%, #000 56%, transparent 82%)"
};

const EYE_MASKS: Array<[string, FeatureMaskRegion]> = [
  ["left", FEATURE_MASKS.leftEye],
  ["right", FEATURE_MASKS.rightEye]
];

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function maskStyle(maskImage: string): CSSProperties {
  return {
    WebkitMaskImage: maskImage,
    maskImage,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskSize: "100% 100%",
    maskSize: "100% 100%"
  };
}

function regionStyle(region: FeatureMaskRegion): CSSProperties {
  return {
    left: `${region.x}%`,
    top: `${region.y}%`,
    width: `${region.width}%`,
    height: `${region.height}%`,
    transform: "translate(-50%, -50%)"
  };
}

export function getUndertoneOverlay(undertone: Undertone): {
  primary: string;
  secondary: string;
  filter: string;
} {
  if (undertone === "cool") {
    return {
      primary: "rgba(214, 164, 178, 0.18)",
      secondary: "rgba(180, 200, 235, 0.10)",
      filter: "hue-rotate(-4deg)"
    };
  }

  if (undertone === "warm") {
    return {
      primary: "rgba(226, 174, 104, 0.18)",
      secondary: "rgba(255, 210, 145, 0.10)",
      filter: "hue-rotate(4deg)"
    };
  }

  if (undertone === "olive") {
    return {
      primary: "rgba(166, 155, 105, 0.18)",
      secondary: "rgba(120, 125, 95, 0.10)",
      filter: "hue-rotate(8deg) saturate(0.88) sepia(0.08)"
    };
  }

  return {
    primary: "rgba(214, 184, 160, 0.10)",
    secondary: "rgba(214, 184, 160, 0.05)",
    filter: "hue-rotate(0deg)"
  };
}

export function getLightingOverlay(
  lightingPreset: PortraitOverlaysProps["lightingPreset"],
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

export function getPortraitFilter(settings: Pick<
  PortraitOverlaysProps,
  "depth" | "saturation" | "undertone" | "lightingPreset"
>): string {
  const depth = clamp(settings.depth);
  const saturation = clamp(settings.saturation);
  const depthBrightness = 1.08 - depth * 0.0035;
  const depthContrast = 0.96 + depth * 0.004;
  const saturationValue = 0.75 + saturation * 0.008;
  const undertoneFilter = getUndertoneOverlay(settings.undertone).filter;
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
    undertoneFilter,
    presetFilter
  ].join(" ");
}

function SkinOverlay({
  skinTone,
  undertone,
  skinAlpha
}: {
  skinTone: string;
  undertone: ReturnType<typeof getUndertoneOverlay>;
  skinAlpha: number;
}) {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: "inherit",
          backgroundColor: skinTone,
          opacity: skinAlpha,
          mixBlendMode: "color"
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: "inherit",
          backgroundColor: undertone.primary,
          mixBlendMode: "soft-light"
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: "inherit",
          backgroundColor: undertone.secondary,
          mixBlendMode: "overlay"
        }}
      />
    </>
  );
}

function HairOverlay({
  color,
  opacity
}: {
  color: string;
  opacity: number;
}) {
  return (
    <div
      className="pointer-events-none absolute"
      style={{
        ...regionStyle(FEATURE_MASKS.hair),
        ...maskStyle(FEATURE_SHAPES.hair),
        backgroundColor: color,
        borderRadius: "48% 48% 42% 42%",
        opacity,
        mixBlendMode: "color"
      }}
    />
  );
}

function EyeOverlay({
  color,
  opacity
}: {
  color: string;
  opacity: number;
}) {
  return (
    <>
      {EYE_MASKS.map(([key, region]) => (
        <div
          key={key}
          className="pointer-events-none absolute"
          style={{
            ...regionStyle(region),
            ...maskStyle(FEATURE_SHAPES.iris),
            backgroundColor: color,
            borderRadius: "999px",
            opacity,
            mixBlendMode: "color"
          }}
        />
      ))}
    </>
  );
}

function LipOverlay({
  color,
  opacity
}: {
  color: string;
  opacity: number;
}) {
  return (
    <div
      className="pointer-events-none absolute"
      style={{
        ...regionStyle(FEATURE_MASKS.lips),
        ...maskStyle(FEATURE_SHAPES.lips),
        backgroundColor: color,
        borderRadius: "999px",
        filter: "blur(1px)",
        opacity,
        mixBlendMode: "multiply"
      }}
    />
  );
}

function BlushOverlay({ opacity }: { opacity: number }) {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        borderRadius: "inherit",
        backgroundColor: "rgba(211, 105, 105, 1)",
        opacity,
        mixBlendMode: "soft-light",
        filter: "blur(18px)",
        ...maskStyle(
          "radial-gradient(ellipse 18% 8.5% at 38% 52%, #000 0%, #000 44%, transparent 76%), radial-gradient(ellipse 18% 8.5% at 62% 52%, #000 0%, #000 44%, transparent 76%)"
        )
      }}
    />
  );
}

function FrecklesOverlay({ opacity }: { opacity: number }) {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        borderRadius: "inherit",
        backgroundImage:
          "radial-gradient(circle, rgba(90, 55, 35, 0.45) 0.9px, transparent 1.5px)",
        backgroundSize: "14px 12px",
        backgroundPosition: "center center",
        opacity,
        mixBlendMode: "multiply",
        ...maskStyle(
          "radial-gradient(ellipse 34% 15% at 50% 47%, #000 0%, #000 58%, transparent 100%)"
        )
      }}
    />
  );
}

function LightingOverlay({
  lighting
}: {
  lighting: ReturnType<typeof getLightingOverlay>;
}) {
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

function FeatureMaskDebug() {
  return (
    <>
      <div
        className="pointer-events-none absolute"
        style={{
          ...regionStyle(FEATURE_MASKS.hair),
          ...maskStyle(FEATURE_SHAPES.hair),
          backgroundColor: "rgba(255, 0, 0, 0.34)"
        }}
      />
      {EYE_MASKS.map(([key, region]) => (
        <div
          key={key}
          className="pointer-events-none absolute"
          style={{
            ...regionStyle(region),
            ...maskStyle(FEATURE_SHAPES.iris),
            backgroundColor: "rgba(0, 100, 255, 0.6)"
          }}
        />
      ))}
      <div
        className="pointer-events-none absolute"
        style={{
          ...regionStyle(FEATURE_MASKS.lips),
          ...maskStyle(FEATURE_SHAPES.lips),
          backgroundColor: "rgba(0, 190, 95, 0.48)"
        }}
      />
    </>
  );
}

export function PortraitOverlays(props: PortraitOverlaysProps) {
  const depth = clamp(props.depth);
  const saturation = clamp(props.saturation);
  const blush = clamp(props.blush);
  const freckles = clamp(props.freckles);
  const undertone = getUndertoneOverlay(props.undertone);
  const lighting = getLightingOverlay(
    props.lightingPreset,
    props.lightIntensity,
    props.environment,
    props.warmth
  );
  const depthOverlayOpacity = 0.04 + depth * 0.002;
  const blushOpacity = (blush / 100) * 0.22;
  const freckleOpacity = (freckles / 100) * 0.25;
  const lipOpacity = 0.18 + (clamp(props.lipTint ?? 44) / 100) * 0.17;
  const hairOpacity = 0.35 + (saturation / 100) * 0.2;
  const eyeOpacity = 0.45 + (saturation / 100) * 0.3;
  const skinAlpha = Math.max(0.08, Math.min(0.34, 0.15 + depthOverlayOpacity * 0.45));

  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ borderRadius: "inherit" }}
    >
      <SkinOverlay
        skinTone={props.skinTone}
        undertone={undertone}
        skinAlpha={skinAlpha}
      />
      <BlushOverlay opacity={blushOpacity} />
      <FrecklesOverlay opacity={freckleOpacity} />
      <HairOverlay
        color={props.hairColor ?? "rgba(40, 29, 24, 0.32)"}
        opacity={hairOpacity}
      />
      <EyeOverlay
        color={props.eyeColor ?? "rgba(74, 48, 31, 0.34)"}
        opacity={eyeOpacity}
      />
      <LipOverlay
        color={props.lipColor ?? "rgba(158, 72, 78, 0.22)"}
        opacity={lipOpacity}
      />
      <LightingOverlay lighting={lighting} />
      {props.showMasks ? <FeatureMaskDebug /> : null}
    </div>
  );
}

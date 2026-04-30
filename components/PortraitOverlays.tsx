"use client";

import type { CSSProperties } from "react";
import { usePortraitStudio } from "@/lib/portraitStudioStore";

function undertoneColor(undertone: string): string {
  if (undertone === "cool") {
    return "rgba(170, 158, 188, 0.22)";
  }
  if (undertone === "warm") {
    return "rgba(233, 189, 131, 0.2)";
  }
  if (undertone === "olive") {
    return "rgba(156, 162, 126, 0.2)";
  }
  return "rgba(203, 188, 176, 0.18)";
}

const lightingGradients: Record<string, string> = {
  daylight:
    "radial-gradient(circle at 38% 18%, rgba(255,255,255,0.38), transparent 42%)",
  warm:
    "radial-gradient(circle at 32% 14%, rgba(255,210,165,0.35), transparent 44%)",
  cool: "radial-gradient(circle at 36% 14%, rgba(204,223,255,0.32), transparent 44%)",
  soft: "radial-gradient(circle at 42% 22%, rgba(255,243,229,0.33), transparent 52%)",
  evening:
    "radial-gradient(circle at 50% 18%, rgba(255,206,158,0.3), transparent 54%)"
};

export function PortraitOverlays() {
  const { state, skinTones } = usePortraitStudio();
  const tone = skinTones.find((item) => item.id === state.skinTone) ?? skinTones[2];

  const filter = [
    `brightness(${0.88 + state.depth / 250})`,
    `contrast(${0.9 + state.depth / 200})`,
    `saturate(${0.7 + state.saturation / 100})`
  ].join(" ");

  const baseWarmth = (state.warmth - 50) / 220;
  const warmthTint =
    baseWarmth >= 0
      ? `rgba(255, 205, 156, ${Math.abs(baseWarmth)})`
      : `rgba(173, 196, 235, ${Math.abs(baseWarmth)})`;

  const frecklesBackground =
    "radial-gradient(circle at 25% 20%, rgba(126,78,56,0.22) 0 1px, transparent 1.8px)";

  return (
    <>
      <div className="absolute inset-0" style={{ filter }} />
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: tone.hex,
          opacity: 0.25,
          mixBlendMode: "color"
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: undertoneColor(state.undertone),
          mixBlendMode: "soft-light"
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 33% 57%, rgba(207,116,114,0.85), transparent 22%), radial-gradient(circle at 67% 57%, rgba(207,116,114,0.85), transparent 22%)",
          opacity: state.blush / 180,
          mixBlendMode: "soft-light"
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 50% 65%, rgba(168,79,86,0.95) 0%, rgba(168,79,86,0.1) 55%, transparent 70%)",
          opacity: state.lipTint / 160,
          mixBlendMode: "multiply"
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: frecklesBackground,
          backgroundSize: "22px 18px",
          backgroundPosition: "center 56%",
          opacity: state.freckles / 220,
          mixBlendMode: "multiply"
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={
          {
            backgroundImage: `${lightingGradients[state.lightingPreset]}, linear-gradient(155deg, rgba(255,255,255,0.08), rgba(65,51,44,${0.3 - state.environment / 500}))`,
            opacity: 0.68 + state.lightIntensity / 380,
            boxShadow: `inset 0 -110px 120px rgba(0,0,0,${0.16 - state.environment / 700})`
          } as CSSProperties
        }
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundColor: warmthTint,
          mixBlendMode: "soft-light"
        }}
      />
    </>
  );
}

import type { Undertone } from "@/components/portrait/featureMasks";

export function getUndertoneOverlay(undertone: Undertone): {
  primary: string;
  secondary: string;
} {
  if (undertone === "cool") {
    return {
      primary: "rgba(214, 164, 178, 0.2)",
      secondary: "rgba(180, 200, 235, 0.12)"
    };
  }

  if (undertone === "warm") {
    return {
      primary: "rgba(226, 174, 104, 0.2)",
      secondary: "rgba(255, 210, 145, 0.12)"
    };
  }

  if (undertone === "olive") {
    return {
      primary: "rgba(166, 155, 105, 0.2)",
      secondary: "rgba(120, 125, 95, 0.12)"
    };
  }

  return {
    primary: "rgba(214, 184, 160, 0.11)",
    secondary: "rgba(214, 184, 160, 0.06)"
  };
}

interface SkinToneOverlayProps {
  skinTone: string;
  undertone: Undertone;
  opacity: number;
}

export function SkinToneOverlay({
  skinTone,
  undertone,
  opacity
}: SkinToneOverlayProps) {
  const undertoneOverlay = getUndertoneOverlay(undertone);

  return (
    <>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: "inherit",
          backgroundColor: skinTone,
          opacity,
          mixBlendMode: "color"
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: "inherit",
          backgroundColor: undertoneOverlay.primary,
          mixBlendMode: "soft-light"
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: "inherit",
          backgroundColor: undertoneOverlay.secondary,
          mixBlendMode: "overlay"
        }}
      />
    </>
  );
}

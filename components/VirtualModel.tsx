import type { CSSProperties } from "react";
import { getAttributeOption, getInitialSelections } from "@/lib/attributes";
import type { PaletteColor, UserSelections } from "@/lib/types";

interface VirtualModelProps {
  selections?: UserSelections;
  palette?: PaletteColor[];
  className?: string;
}

function isWarmTemperature(value?: string): boolean {
  return value === "warm" || value === "neutral-warm";
}

function pickLipColor(temperature?: string, chroma?: string): string {
  if (isWarmTemperature(temperature)) {
    return chroma === "bright" ? "#e8674f" : "#c96358";
  }

  if (temperature === "cool" || temperature === "neutral-cool") {
    return chroma === "bright" ? "#c72f72" : "#a95673";
  }

  return "#b96769";
}

export function VirtualModel({
  selections = getInitialSelections(),
  palette,
  className
}: VirtualModelProps) {
  const skin = getAttributeOption("skinDepth", selections.skinDepth);
  const undertone = getAttributeOption("undertone", selections.undertone);
  const chroma = getAttributeOption("chroma", selections.chroma);
  const contrast = getAttributeOption("contrast", selections.contrast);
  const eyes = getAttributeOption("eyeColor", selections.eyeColor);
  const hair = getAttributeOption("hairColor", selections.hairColor);

  const paletteColors =
    palette?.slice(0, 5).map((color) => color.hex) ??
    ["#f8c8b8", "#f4b23f", "#78a95e", "#3fb7b5", "#5d5a91"];

  const hairDepth = hair.depthValue ?? 4;
  const brow =
    hairDepth <= 1
      ? "#7d7063"
      : contrast.value === "high"
        ? "#171313"
        : hair.hex ?? "#4e3026";

  const style = {
    "--skin": skin.hex ?? "#d7a37f",
    "--hair": hair.hex ?? "#5f3a29",
    "--eye": eyes.hex ?? "#6b8a68",
    "--lip": pickLipColor(undertone.temperature, chroma.value),
    "--brow": brow,
    "--accent": paletteColors[1] ?? "#327c83"
  } as CSSProperties & Record<string, string>;

  return (
    <div
      className={`shade-model ${className ?? ""}`}
      style={style}
      role="img"
      aria-label={`Virtual model with ${skin.label.toLowerCase()} skin, ${undertone.label.toLowerCase()} undertone, ${eyes.label.toLowerCase()} eyes, and ${hair.label.toLowerCase()} hair.`}
    >
      <div className="shade-model__aura" aria-hidden="true" />
      <div className="shade-model__neck" aria-hidden="true" />
      <div className="shade-model__shoulders" aria-hidden="true" />
      <div className="shade-model__hair" aria-hidden="true">
        <span className="shade-model__part" />
      </div>
      <div className="shade-model__face" aria-hidden="true">
        <span className="shade-model__fringe" />
        <span className="shade-model__eye shade-model__eye--left" />
        <span className="shade-model__eye shade-model__eye--right" />
        <span className="shade-model__nose" />
        <span className="shade-model__cheek shade-model__cheek--left" />
        <span className="shade-model__cheek shade-model__cheek--right" />
        <span className="shade-model__mouth" />
      </div>
      <div className="shade-model__palette" aria-hidden="true">
        {paletteColors.map((color) => (
          <span key={color} style={{ backgroundColor: color }} />
        ))}
      </div>
    </div>
  );
}

import {
  FEATURE_MASKS,
  FEATURE_SHAPES,
  clamp,
  maskStyle,
  regionStyle
} from "@/components/portrait/featureMasks";

interface LipTintOverlayProps {
  color: string;
  tint?: number;
}

export function LipTintOverlay({ color, tint = 44 }: LipTintOverlayProps) {
  const opacity = 0.18 + (clamp(tint) / 100) * 0.17;

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

import {
  FEATURE_MASKS,
  FEATURE_SHAPES,
  clamp,
  maskStyle,
  regionStyle
} from "@/components/portrait/featureMasks";

interface FrecklesOverlayProps {
  freckles: number;
}

export function FrecklesOverlay({ freckles }: FrecklesOverlayProps) {
  const opacity = (clamp(freckles) / 100) * 0.5;

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        ...regionStyle(FEATURE_MASKS.freckles),
        ...maskStyle(FEATURE_SHAPES.freckles),
        backgroundImage:
          "radial-gradient(circle, rgba(85,50,30,0.72) 0 1.1px, transparent 1.8px), radial-gradient(circle, rgba(85,50,30,0.5) 0 0.8px, transparent 1.6px), radial-gradient(circle, rgba(85,50,30,0.62) 0 0.7px, transparent 1.4px)",
        backgroundPosition: "0 0, 9px 7px, 18px 4px",
        backgroundSize: "18px 16px, 23px 19px, 29px 24px",
        opacity,
        mixBlendMode: "multiply"
      }}
    />
  );
}

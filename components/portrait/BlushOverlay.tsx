import {
  FEATURE_MASKS,
  FEATURE_SHAPES,
  clamp,
  maskStyle,
  regionStyle,
  type FeatureMaskRegion
} from "@/components/portrait/featureMasks";

interface BlushOverlayProps {
  blush: number;
}

const CHEEK_REGIONS: Array<[string, FeatureMaskRegion]> = [
  ["left", FEATURE_MASKS.leftCheek],
  ["right", FEATURE_MASKS.rightCheek]
];

export function BlushOverlay({ blush }: BlushOverlayProps) {
  const opacity = (clamp(blush) / 100) * 0.42;

  return (
    <>
      {CHEEK_REGIONS.map(([key, region]) => (
        <div
          key={key}
          className="pointer-events-none absolute"
          style={{
            ...regionStyle(region),
            ...maskStyle(FEATURE_SHAPES.cheek),
            backgroundColor: "rgba(211, 105, 105, 1)",
            filter: "blur(18px)",
            opacity,
            mixBlendMode: "multiply"
          }}
        />
      ))}
    </>
  );
}

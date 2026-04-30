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
  const opacity = (clamp(blush) / 100) * 0.32;

  return (
    <>
      {CHEEK_REGIONS.map(([key, region]) => (
        <div
          key={key}
          className="pointer-events-none absolute"
          style={{
            ...regionStyle(region),
            ...maskStyle(FEATURE_SHAPES.cheek),
            background:
              "radial-gradient(ellipse at center, rgba(210,105,95,1) 0%, rgba(210,105,95,0.68) 40%, transparent 76%)",
            filter: "blur(24px)",
            opacity,
            mixBlendMode: "soft-light"
          }}
        />
      ))}
    </>
  );
}

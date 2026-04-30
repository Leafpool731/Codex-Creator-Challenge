import {
  FEATURE_MASKS,
  FEATURE_SHAPES,
  maskStyle,
  regionStyle,
  type FeatureMaskRegion
} from "@/components/portrait/featureMasks";

interface EyeColorOverlayProps {
  color: string;
  opacity?: number;
}

const IRIS_REGIONS: Array<[string, FeatureMaskRegion]> = [
  ["left", FEATURE_MASKS.leftIris],
  ["right", FEATURE_MASKS.rightIris]
];

export function EyeColorOverlay({
  color,
  opacity = 0.78
}: EyeColorOverlayProps) {
  return (
    <>
      {IRIS_REGIONS.map(([key, region]) => (
        <div
          key={key}
          className="pointer-events-none absolute"
          style={{
            ...regionStyle(region),
            borderRadius: "999px"
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              ...maskStyle(FEATURE_SHAPES.iris),
              background:
                `radial-gradient(circle at 48% 42%, rgba(255,255,255,0.18), transparent 26%), ${color}`,
              borderRadius: "999px",
              opacity,
              mixBlendMode: "color"
            }}
          />
        </div>
      ))}
    </>
  );
}

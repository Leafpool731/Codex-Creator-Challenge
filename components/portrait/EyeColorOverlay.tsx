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
  opacity = 0.82
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
              backgroundColor: color,
              borderRadius: "999px",
              opacity,
              mixBlendMode: "color"
            }}
          />
          <div
            className="absolute left-1/2 top-1/2 h-[38%] w-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#120c08]"
            style={{ opacity: 0.74, mixBlendMode: "multiply" }}
          />
          <div className="absolute left-[30%] top-[24%] h-[18%] w-[18%] rounded-full bg-white/85 blur-[0.4px]" />
        </div>
      ))}
    </>
  );
}

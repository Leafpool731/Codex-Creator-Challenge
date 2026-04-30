"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  PortraitOverlays,
  getPortraitFilter,
  type LightingPreset,
  type Undertone
} from "@/components/portrait/PortraitOverlays";
import { getPortraitSrc } from "@/lib/portraitStudioStore";

interface PortraitImageProps {
  modelId: string;
  skinTone: string;
  undertone: Undertone;
  depth: number;
  saturation: number;
  blush: number;
  freckles: number;
  hairColor: string;
  hairIntensity?: number;
  eyeColor: string;
  lipColor: string;
  lipTint?: number;
  lightingPreset: LightingPreset;
  lightIntensity: number;
  environment: number;
  warmth: number;
  showMasks?: boolean;
  priority?: boolean;
  fit?: "cover" | "contain";
  minHeightClassName?: string;
}

export function PortraitImage({
  modelId,
  skinTone,
  undertone,
  depth,
  saturation,
  blush,
  freckles,
  hairColor,
  hairIntensity,
  eyeColor,
  lipColor,
  lipTint,
  lightingPreset,
  lightIntensity,
  environment,
  warmth,
  showMasks = false,
  priority = false,
  fit = "cover",
  minHeightClassName = "min-h-[32rem] lg:min-h-[42rem]"
}: PortraitImageProps) {
  const [imageMissing, setImageMissing] = useState(false);
  const portraitSrc = getPortraitSrc(modelId);
  const portraitFilter = getPortraitFilter({
    depth,
    saturation,
    lightingPreset
  });

  useEffect(() => {
    setImageMissing(false);
  }, [portraitSrc]);

  return (
    <div className={`relative aspect-[4/5] ${minHeightClassName}`}>
      {imageMissing ? (
        <div className="grid h-full place-items-center p-8 text-center text-sm leading-6 text-[#6f635c]">
          Add realistic portraits to /public/models to enable the model studio.
        </div>
      ) : (
        <>
          <Image
            src={portraitSrc}
            alt="Photorealistic portrait model"
            fill
            priority={priority}
            sizes="(min-width: 1280px) 48vw, (min-width: 768px) 64vw, 100vw"
            className={fit === "contain" ? "object-contain object-top" : "object-cover object-top"}
            style={{ filter: portraitFilter }}
            onError={() => setImageMissing(true)}
          />
          <PortraitOverlays
            skinTone={skinTone}
            undertone={undertone}
            depth={depth}
            saturation={saturation}
            blush={blush}
            freckles={freckles}
            hairColor={hairColor}
            hairIntensity={hairIntensity}
            eyeColor={eyeColor}
            lipColor={lipColor}
            lipTint={lipTint}
            lightingPreset={lightingPreset}
            lightIntensity={lightIntensity}
            environment={environment}
            warmth={warmth}
            showMasks={showMasks}
          />
        </>
      )}
    </div>
  );
}

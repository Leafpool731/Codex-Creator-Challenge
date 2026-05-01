"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  PortraitOverlays,
  type LightingPreset,
  type Undertone
} from "@/components/portrait/PortraitOverlays";
import { getPortraitSrc } from "@/lib/portraitStudioStore";

interface PortraitImageProps {
  modelId: string;
  skinToneHex: string;
  undertone: Undertone;
  depth: number;
  saturation: number;
  lightingPreset: LightingPreset;
  lightIntensity: number;
  environment: number;
  warmth: number;
  priority?: boolean;
  fit?: "cover" | "contain";
  minHeightClassName?: string;
}

export function PortraitImage({
  modelId,
  skinToneHex,
  undertone,
  depth,
  saturation,
  lightingPreset,
  lightIntensity,
  environment,
  warmth,
  priority = false,
  fit = "cover",
  minHeightClassName = "min-h-[min(52vh,22rem)] sm:min-h-[28rem] lg:min-h-[42rem]"
}: PortraitImageProps) {
  const [imageMissing, setImageMissing] = useState(false);
  const portraitSrc = getPortraitSrc(modelId);

  useEffect(() => {
    setImageMissing(false);
  }, [portraitSrc]);

  const imageFitClass =
    fit === "contain" ? "object-contain object-top" : "object-cover object-top";

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
            className={imageFitClass}
            onError={() => setImageMissing(true)}
          />
          <PortraitOverlays
            skinToneHex={skinToneHex}
            undertone={undertone}
            depth={depth}
            saturation={saturation}
            lightingPreset={lightingPreset}
            lightIntensity={lightIntensity}
            environment={environment}
            warmth={warmth}
          />
        </>
      )}
    </div>
  );
}

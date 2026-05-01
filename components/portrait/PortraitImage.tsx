"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
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
  /** Studio hero vs results card: results uses padded frame + centered contain. */
  variant?: "studio" | "results";
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
  minHeightClassName = "min-h-[min(52vh,22rem)] sm:min-h-[28rem] lg:min-h-[42rem]",
  variant = "studio"
}: PortraitImageProps) {
  const t = useTranslations("portrait");
  const [imageMissing, setImageMissing] = useState(false);
  const portraitSrc = getPortraitSrc(modelId);

  useEffect(() => {
    setImageMissing(false);
  }, [portraitSrc]);

  const imageFitClass =
    fit === "contain"
      ? variant === "results"
        ? "object-contain object-center"
        : "object-contain object-top"
      : "object-cover object-top";

  const missingPlaceholder = (
    <div className="grid w-full place-items-center p-8 text-center text-sm leading-6 text-[#6f635c]">
      {t("missing")}
    </div>
  );

  if (variant === "results") {
    return (
      <div
        className={`relative flex w-full items-center justify-center ${minHeightClassName}`}
      >
        {imageMissing ? (
          missingPlaceholder
        ) : (
          <div className="relative mx-auto aspect-[3/4] w-full max-w-md max-h-[min(72vh,520px)] min-h-[200px] sm:max-h-[520px]">
            <Image
              src={portraitSrc}
              alt={t("alt")}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 28rem, (min-width: 768px) 40vw, 90vw"
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
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative aspect-[4/5] ${minHeightClassName}`}>
      {imageMissing ? (
        <div className="grid h-full place-items-center p-8 text-center text-sm leading-6 text-[#6f635c]">
          {t("missing")}
        </div>
      ) : (
        <>
          <Image
            src={portraitSrc}
            alt={t("alt")}
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

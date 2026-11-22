"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getPortraitModel, skinColor, type Profile } from "@/lib/profile";
import { getRenderer, type PortraitRenderer } from "@/lib/portrait/renderer";

/** Largest OKLab shifts applied to a photo (≈ 20 steps of the depth slider). */
const MAX_DL = 0.11;
const MAX_DAB = 0.035;

interface PortraitCanvasProps {
  profile: Profile;
  drapeHex?: string | null;
  lipHex?: string | null;
  alt: string;
  className?: string;
  /** CSS object-position for the crop. */
  focus?: string;
}

export function PortraitCanvas({
  profile,
  drapeHex = null,
  lipHex = null,
  alt,
  className = "",
  focus = "50% 18%"
}: PortraitCanvasProps) {
  const model = getPortraitModel(profile.modelId);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [renderer, setRenderer] = useState<{ src: string; r: PortraitRenderer } | null>(null);
  const [failed, setFailed] = useState(false);
  const frame = useRef<number | null>(null);
  const imageData = useRef<ImageData | null>(null);

  useEffect(() => {
    let alive = true;
    setFailed(false);
    getRenderer(model.src, model.mask)
      .then((r) => alive && setRenderer({ src: model.src, r }))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [model.src, model.mask]);

  const baseline = useMemo(() => skinColor({ ...model.baseline }), [model]);
  const target = skinColor(profile);
  // Recolouring only stays believable for modest shifts; larger ones are handled by
  // switching to a closer real portrait (closestPortrait). Cap as a safety net.
  const cap = (v: number, max: number) => Math.max(-max, Math.min(max, v));
  const targetSkin = {
    L: model.measuredSkin.L + cap(target.L - baseline.L, MAX_DL),
    a: model.measuredSkin.a + cap(target.a - baseline.a, MAX_DAB),
    b: model.measuredSkin.b + cap(target.b - baseline.b, MAX_DAB)
  };
  const key = `${targetSkin.L.toFixed(4)}|${targetSkin.a.toFixed(4)}|${targetSkin.b.toFixed(4)}|${drapeHex}|${lipHex}`;

  const ready = renderer?.src === model.src;

  useEffect(() => {
    if (!ready || !renderer || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const r = renderer.r;
    if (canvas.width !== r.width || canvas.height !== r.height) {
      canvas.width = r.width;
      canvas.height = r.height;
      imageData.current = null;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // A zero-delay timer (not rAF) so the first frame isn't held back in throttled views;
    // rapid slider input still coalesces to one render per task.
    if (frame.current !== null) window.clearTimeout(frame.current);
    frame.current = window.setTimeout(() => {
      frame.current = null;
      if (!imageData.current) imageData.current = ctx.createImageData(r.width, r.height);
      r.render(imageData.current, {
        measuredSkin: model.measuredSkin,
        targetSkin,
        drapeHex,
        lipHex
      });
      ctx.putImageData(imageData.current, 0, 0);
    }, 0);
    return () => {
      if (frame.current !== null) window.clearTimeout(frame.current);
    };
    // key captures every render input
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, renderer, key]);

  const fit = { objectFit: "cover" as const, objectPosition: focus };

  return (
    <div className={`relative overflow-hidden bg-[#efe9e3] ${className}`}>
      {/* Photo shows immediately; the canvas takes over once masks are decoded. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={model.src}
        alt={alt}
        className="absolute inset-0 h-full w-full"
        style={fit}
        draggable={false}
      />
      {!failed && (
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={alt}
          className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
          style={fit}
        />
      )}
    </div>
  );
}

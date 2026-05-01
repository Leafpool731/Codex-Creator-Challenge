import { NextResponse } from "next/server";
import sharp from "sharp";
import { HairMaskMissingError, loadPortraitBuffer } from "@/lib/image/hairSegmentation";
import { normalizeHairModelId } from "@/lib/cache/hairColorCache";
import { getHairMask } from "@/lib/segmentation/getHairMask";
import { buildIrisMaskPng } from "@/lib/segmentation/getIrisMask";
import { buildLipMaskPng } from "@/lib/segmentation/getLipMask";

export const dynamic = "force-dynamic";

type SegmentFeature = "hair" | "eyes" | "lips";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseBody(value: unknown): { modelId: string; feature: SegmentFeature } | null {
  if (!isRecord(value)) {
    return null;
  }

  const modelId = typeof value.modelId === "string" ? value.modelId : null;
  const feature = typeof value.feature === "string" ? value.feature : null;

  if (!modelId || (feature !== "hair" && feature !== "eyes" && feature !== "lips")) {
    return null;
  }

  return { modelId: normalizeHairModelId(modelId), feature };
}

export async function POST(request: Request) {
  const parsed = parseBody(await request.json().catch(() => null));

  if (!parsed) {
    return NextResponse.json({ message: "Invalid segment-feature request." }, { status: 400 });
  }

  try {
    if (parsed.feature === "hair") {
      const mask = await getHairMask(request, parsed.modelId);
      const meta = await sharp(mask).metadata();

      return NextResponse.json({
        feature: parsed.feature,
        modelId: parsed.modelId,
        width: meta.width,
        height: meta.height,
        mimeType: "image/png",
        dataBase64: mask.toString("base64")
      });
    }

    const portrait = await loadPortraitBuffer(request, parsed.modelId);
    const meta = await sharp(portrait).metadata();
    const width = meta.width ?? 800;
    const height = meta.height ?? 1000;
    const mask =
      parsed.feature === "eyes"
        ? await buildIrisMaskPng(width, height)
        : await buildLipMaskPng(width, height);

    return NextResponse.json({
      feature: parsed.feature,
      modelId: parsed.modelId,
      width,
      height,
      mimeType: "image/png",
      dataBase64: mask.toString("base64")
    });
  } catch (error) {
    if (error instanceof HairMaskMissingError) {
      return NextResponse.json(
        {
          message: error.message,
          feature: parsed.feature,
          modelId: parsed.modelId
        },
        { status: 422 }
      );
    }

    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Segmentation failed."
      },
      { status: 500 }
    );
  }
}

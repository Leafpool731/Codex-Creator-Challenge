import { NextResponse } from "next/server";
import {
  createHairColorCacheKey,
  getGeneratedHairPath,
  getHairRecolorFromMemory,
  normalizeHairModelId,
  publicHairAssetExists,
  saveHairRecolorToPublic,
  setHairRecolorInMemory
} from "@/lib/cache/hairColorCache";
import type { PortraitEditResponse } from "@/lib/cache/cacheKey";
import { HairMaskMissingError, getPortraitPath } from "@/lib/image/hairSegmentation";
import { runMaskedHairRecolor } from "@/lib/portrait/runMaskedHairRecolor";

export const dynamic = "force-dynamic";

interface HairRecolorBody {
  modelId: string;
  valueName: string;
  valueHex: string;
  strength?: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseBody(value: unknown): HairRecolorBody | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    typeof value.modelId !== "string" ||
    typeof value.valueName !== "string" ||
    typeof value.valueHex !== "string"
  ) {
    return null;
  }

  return {
    modelId: value.modelId,
    valueName: value.valueName,
    valueHex: value.valueHex,
    strength: typeof value.strength === "number" ? value.strength : undefined
  };
}

function jsonResponse(response: PortraitEditResponse): NextResponse {
  return NextResponse.json(response, {
    headers: {
      "Cache-Control": response.aiRefined
        ? "public, max-age=31536000, immutable"
        : "no-store"
    }
  });
}

function originalPortraitResponse(
  cacheKey: string,
  modelId: string,
  message: string
): PortraitEditResponse {
  return {
    cacheKey,
    editType: "hair",
    imageUrl: getPortraitPath(modelId),
    status: "fallback",
    source: "original",
    aiRefined: false,
    cacheHit: false,
    message
  };
}

export async function POST(request: Request) {
  const body = parseBody(await request.json().catch(() => null));

  if (!body) {
    return NextResponse.json(
      { message: "Invalid hair recolor request." },
      { status: 400 }
    );
  }

  const modelId = normalizeHairModelId(body.modelId);
  const cacheKey = createHairColorCacheKey({
    modelId,
    colorName: body.valueName,
    colorHex: body.valueHex
  });
  const generatedPath = getGeneratedHairPath(modelId, body.valueName, body.valueHex);
  const memoryHit = getHairRecolorFromMemory(cacheKey);

  if (memoryHit) {
    return jsonResponse({
      ...memoryHit,
      status: memoryHit.aiRefined ? "cached" : "fallback",
      source: "memory",
      cacheHit: true
    });
  }

  if (await publicHairAssetExists(request, generatedPath)) {
    const cached = setHairRecolorInMemory(cacheKey, {
      cacheKey,
      editType: "hair",
      imageUrl: generatedPath,
      status: "precomputed",
      source: "static",
      aiRefined: true,
      cacheHit: true
    });

    return jsonResponse(cached);
  }

  try {
    const image = await runMaskedHairRecolor(
      request,
      modelId,
      body.valueHex,
      body.strength ?? 0.88
    );
    const savedPath = await saveHairRecolorToPublic(generatedPath, image);
    const imageUrl =
      savedPath ?? `data:image/png;base64,${image.toString("base64")}`;
    const generated = setHairRecolorInMemory(cacheKey, {
      cacheKey,
      editType: "hair",
      imageUrl,
      status: "generated",
      source: savedPath ? "static" : "memory",
      aiRefined: true,
      cacheHit: false,
      message: "Hair recolored from the model hair mask."
    });

    return jsonResponse(generated);
  } catch (error) {
    const message =
      error instanceof HairMaskMissingError
        ? "Hair mask needed for realistic recoloring."
        : error instanceof Error
          ? error.message
          : "Hair recoloring failed.";
    const fallback = setHairRecolorInMemory(
      cacheKey,
      originalPortraitResponse(cacheKey, modelId, message)
    );

    return jsonResponse(fallback);
  }
}

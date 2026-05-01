// TODO: Reintroduce AI-based feature editing for:
// - hair (segmentation)
// - eyes (iris mask)
// - lips (cosmetic rendering)
// (Studio UI currently skin-only; endpoints retained for future use.)

import { NextResponse } from "next/server";
import { editPortraitWithAI } from "@/lib/ai/editPortrait";
import {
  PORTRAIT_BASE_IMAGE_VERSION,
  createHairColorCacheKey,
  createPortraitEditCacheKey,
  getGeneratedMaskedFeaturePath,
  normalizePortraitEditDescriptor,
  type PortraitEditDescriptor,
  type PortraitEditResponse,
  type PortraitEditType
} from "@/lib/cache/cacheKey";
import { getCachedFeatureEdit, setCachedFeatureEdit } from "@/lib/cache/featureEditCache";
import {
  getGeneratedHairPath,
  getHairRecolorFromMemory,
  normalizeHairModelId,
  publicHairAssetExists,
  savePublicPng,
  setHairRecolorInMemory
} from "@/lib/cache/hairColorCache";
import {
  getPortraitEditFromMemory,
  setPortraitEditInMemory
} from "@/lib/cache/portraitEditCache";
import {
  HairMaskMissingError,
  getPortraitPath,
  loadPortraitBuffer
} from "@/lib/image/hairSegmentation";
import { recolorMaskedRegion } from "@/lib/image/recolorMaskedRegion";
import { runMaskedHairRecolor } from "@/lib/portrait/runMaskedHairRecolor";
import { getIrisMaskForPortrait } from "@/lib/segmentation/getIrisMask";
import { getLipMaskForPortrait } from "@/lib/segmentation/getLipMask";
import {
  createPortraitStorage,
  type PortraitObjectBucket,
  type PortraitStorage
} from "@/lib/storage/portraitStorage";

export const dynamic = "force-dynamic";

const editTypes: PortraitEditType[] = ["hair", "eyes", "lips", "blush", "freckles"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseDescriptor(value: unknown): PortraitEditDescriptor | null {
  if (!isRecord(value)) {
    return null;
  }

  const feature = value.feature ?? value.editType;
  const editType =
    typeof feature === "string" && editTypes.includes(feature as PortraitEditType)
      ? (feature as PortraitEditType)
      : null;

  if (
    typeof value.modelId !== "string" ||
    typeof value.valueName !== "string" ||
    !editType
  ) {
    return null;
  }

  return {
    modelId: value.modelId,
    baseImageVersion:
      typeof value.baseImageVersion === "string"
        ? value.baseImageVersion
        : PORTRAIT_BASE_IMAGE_VERSION,
    editType,
    valueName: value.valueName,
    valueHex: typeof value.valueHex === "string" ? value.valueHex : undefined,
    intensity: typeof value.intensity === "number" ? value.intensity : undefined,
    lightingPreset:
      typeof value.lightingPreset === "string" ? value.lightingPreset : undefined,
    currentImageUrl:
      typeof value.currentImageUrl === "string" ? value.currentImageUrl : undefined
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

async function getStorage(request: Request): Promise<PortraitStorage> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const context = await getCloudflareContext({ async: true });
    const env = context.env as Record<string, unknown>;
    const bucket = env.PORTRAIT_EDIT_CACHE as PortraitObjectBucket | undefined;

    return createPortraitStorage(request, bucket);
  } catch {
    return createPortraitStorage(request);
  }
}

function originalPortraitResponse(
  cacheKey: string,
  modelId: string,
  editType: PortraitEditType,
  message: string
): PortraitEditResponse {
  return {
    cacheKey,
    editType,
    imageUrl: getPortraitPath(modelId),
    status: "fallback",
    source: "original",
    aiRefined: false,
    cacheHit: false,
    message
  };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const descriptor = parseDescriptor(body);

  if (!descriptor) {
    return NextResponse.json(
      { message: "Invalid edit-feature request. Use feature or editType." },
      { status: 400 }
    );
  }

  const normalized = normalizePortraitEditDescriptor(descriptor);
  const modelId = normalizeHairModelId(normalized.modelId);
  const hairCacheKey = createHairColorCacheKey({
    modelId,
    colorName: descriptor.valueName,
    colorHex: descriptor.valueHex ?? "#000000"
  });
  const portraitCacheKey = createPortraitEditCacheKey(normalized);
  const cacheKey = normalized.editType === "hair" ? hairCacheKey : portraitCacheKey;
  const fallbackUrl =
    descriptor.currentImageUrl ?? `/models/${modelId}.png`;

  const unifiedHit = getCachedFeatureEdit(descriptor);

  if (unifiedHit) {
    return jsonResponse({
      ...unifiedHit,
      status: unifiedHit.aiRefined ? "cached" : "fallback",
      source: unifiedHit.source === "memory" ? "memory" : unifiedHit.source,
      cacheHit: true
    });
  }

  if (normalized.editType === "hair") {
    const memoryHit = getHairRecolorFromMemory(hairCacheKey);

    if (memoryHit) {
      return jsonResponse({
        ...memoryHit,
        status: memoryHit.aiRefined ? "cached" : "fallback",
        source: "memory",
        cacheHit: true
      });
    }

    const generatedPath = getGeneratedHairPath(
      modelId,
      descriptor.valueName,
      descriptor.valueHex ?? "#000000"
    );

    if (await publicHairAssetExists(request, generatedPath)) {
      const cached = setHairRecolorInMemory(hairCacheKey, {
        cacheKey: hairCacheKey,
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
        descriptor.valueHex ?? "#6a3f28",
        Math.max(0, Math.min(1, (descriptor.intensity ?? 88) / 100))
      );
      const savedPath = await savePublicPng(generatedPath, image);
      const imageUrl =
        savedPath ?? `data:image/png;base64,${image.toString("base64")}`;
      const generated = setHairRecolorInMemory(hairCacheKey, {
        cacheKey: hairCacheKey,
        editType: "hair",
        imageUrl,
        status: "generated",
        source: savedPath ? "static" : "memory",
        aiRefined: true,
        cacheHit: false,
        message: "Hair recolored using the hair-region mask."
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
        hairCacheKey,
        originalPortraitResponse(hairCacheKey, modelId, "hair", message)
      );

      return jsonResponse(fallback);
    }
  }

  if (normalized.editType === "eyes" || normalized.editType === "lips") {
    const memoryHit = getPortraitEditFromMemory(portraitCacheKey);

    if (memoryHit) {
      return jsonResponse({
        ...memoryHit,
        status: memoryHit.aiRefined ? "cached" : "fallback",
        source: "memory",
        cacheHit: true
      });
    }

    const generatedPath = getGeneratedMaskedFeaturePath(
      modelId,
      normalized.editType,
      descriptor.valueName,
      descriptor.valueHex ?? "#000000"
    );

    if (await publicHairAssetExists(request, generatedPath)) {
      const cached = setPortraitEditInMemory(portraitCacheKey, {
        cacheKey: portraitCacheKey,
        editType: normalized.editType,
        imageUrl: generatedPath,
        status: "precomputed",
        source: "static",
        aiRefined: true,
        cacheHit: true
      });

      return jsonResponse(cached);
    }

    try {
      const portrait = await loadPortraitBuffer(request, modelId);
      const mask =
        normalized.editType === "eyes"
          ? await getIrisMaskForPortrait(portrait)
          : await getLipMaskForPortrait(portrait);
      const image = await recolorMaskedRegion({
        portrait,
        mask,
        targetColor: descriptor.valueHex ?? "#5a3825",
        strength: Math.max(0.35, Math.min(1, (descriptor.intensity ?? 75) / 100)),
        mode: normalized.editType
      });
      const savedPath = await savePublicPng(generatedPath, image);
      const imageUrl =
        savedPath ?? `data:image/png;base64,${image.toString("base64")}`;
      const generated = setPortraitEditInMemory(portraitCacheKey, {
        cacheKey: portraitCacheKey,
        editType: normalized.editType,
        imageUrl,
        status: "generated",
        source: savedPath ? "static" : "memory",
        aiRefined: true,
        cacheHit: false,
        message:
          normalized.editType === "eyes"
            ? "Iris regions recolored with a calibrated mask."
            : "Lip region recolored with a soft elliptical mask."
      });

      return jsonResponse(generated);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Masked recolor failed.";
      const fallback = setPortraitEditInMemory(
        portraitCacheKey,
        {
          cacheKey: portraitCacheKey,
          editType: normalized.editType,
          imageUrl: fallbackUrl,
          status: "fallback",
          source: "css-preview",
          aiRefined: false,
          cacheHit: false,
          message
        }
      );

      return jsonResponse(fallback);
    }
  }

  const memoryHit = getPortraitEditFromMemory(portraitCacheKey);

  if (memoryHit) {
    return jsonResponse({
      ...memoryHit,
      status: memoryHit.aiRefined ? "cached" : "fallback",
      source: "memory",
      cacheHit: true
    });
  }

  const storage = await getStorage(request);
  const persistentHit = await storage.getPersistentResponse(portraitCacheKey);

  if (persistentHit) {
    const cached = setPortraitEditInMemory(portraitCacheKey, {
      ...persistentHit,
      source: "persistent",
      cacheHit: true
    });

    return jsonResponse(cached);
  }

  const staticUrl = await storage.findStaticVariant(normalized);

  if (staticUrl) {
    const precomputed = setPortraitEditInMemory(portraitCacheKey, {
      cacheKey: portraitCacheKey,
      editType: normalized.editType,
      imageUrl: staticUrl,
      status: "precomputed",
      source: "static",
      aiRefined: true,
      cacheHit: true
    });

    return jsonResponse(precomputed);
  }

  const aiResult = await editPortraitWithAI(normalized, request.signal);

  if (aiResult.status === "generated" && aiResult.imageUrl) {
    const generated = setCachedFeatureEdit(normalized, {
      cacheKey: portraitCacheKey,
      editType: normalized.editType,
      imageUrl: aiResult.imageUrl,
      status: "generated",
      source: "remote",
      aiRefined: true,
      cacheHit: false
    });

    await storage.savePersistentResponse(portraitCacheKey, generated);

    return jsonResponse(generated);
  }

  const fallback = setCachedFeatureEdit(normalized, {
    cacheKey: portraitCacheKey,
    editType: normalized.editType,
    imageUrl: fallbackUrl,
    status: "fallback",
    source: "css-preview",
    aiRefined: false,
    cacheHit: false,
    message:
      aiResult.message ??
      "Using the instant preview while no AI portrait is available."
  });

  return jsonResponse(fallback);
}

// TODO: Reintroduce when AI-based hair / eyes / lips editing returns to the product.

import { NextResponse } from "next/server";
import { editPortraitWithAI } from "@/lib/ai/editPortrait";
import {
  PORTRAIT_BASE_IMAGE_VERSION,
  createPortraitEditCacheKey,
  normalizePortraitEditDescriptor,
  type PortraitEditDescriptor,
  type PortraitEditResponse,
  type PortraitEditType
} from "@/lib/cache/cacheKey";
import {
  getPortraitEditFromMemory,
  setPortraitEditInMemory
} from "@/lib/cache/portraitEditCache";
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

  const editType = value.editType;

  if (
    typeof value.modelId !== "string" ||
    typeof value.valueName !== "string" ||
    typeof editType !== "string" ||
    !editTypes.includes(editType as PortraitEditType)
  ) {
    return null;
  }

  return {
    modelId: value.modelId,
    baseImageVersion:
      typeof value.baseImageVersion === "string"
        ? value.baseImageVersion
        : PORTRAIT_BASE_IMAGE_VERSION,
    editType: editType as PortraitEditType,
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

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const descriptor = parseDescriptor(body);

  if (!descriptor) {
    return NextResponse.json(
      { message: "Invalid portrait edit request." },
      { status: 400 }
    );
  }

  const normalized = normalizePortraitEditDescriptor(descriptor);
  const cacheKey = createPortraitEditCacheKey(normalized);
  const fallbackUrl =
    descriptor.currentImageUrl ?? `/models/${normalized.modelId}.png`;

  const memoryHit = getPortraitEditFromMemory(cacheKey);

  if (memoryHit) {
    return jsonResponse({
      ...memoryHit,
      status: memoryHit.aiRefined ? "cached" : "fallback",
      source: "memory",
      cacheHit: true
    });
  }

  const storage = await getStorage(request);
  const persistentHit = await storage.getPersistentResponse(cacheKey);

  if (persistentHit) {
    const cached = setPortraitEditInMemory(cacheKey, {
      ...persistentHit,
      source: "persistent",
      cacheHit: true
    });

    return jsonResponse(cached);
  }

  const staticUrl = await storage.findStaticVariant(normalized);

  if (staticUrl) {
    const precomputed = setPortraitEditInMemory(cacheKey, {
      cacheKey,
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
    const generated = setPortraitEditInMemory(cacheKey, {
      cacheKey,
      editType: normalized.editType,
      imageUrl: aiResult.imageUrl,
      status: "generated",
      source: "remote",
      aiRefined: true,
      cacheHit: false
    });

    await storage.savePersistentResponse(cacheKey, generated);

    return jsonResponse(generated);
  }

  const fallback = setPortraitEditInMemory(cacheKey, {
    cacheKey,
    editType: normalized.editType,
    imageUrl: fallbackUrl,
    status: "fallback",
    source: "css-preview",
    aiRefined: false,
    cacheHit: false,
    message:
      aiResult.message ??
      "Using the instant CSS preview while no generated portrait is available."
  });

  return jsonResponse(fallback);
}

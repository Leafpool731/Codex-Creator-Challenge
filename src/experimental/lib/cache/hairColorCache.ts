import {
  getHairColorSlug,
  normalizeHairModelId,
  type PortraitEditResponse
} from "@/lib/cache/cacheKey";

export {
  createHairColorCacheKey,
  normalizeHairModelId
} from "@/lib/cache/cacheKey";

const hairColorMemoryCache = new Map<string, PortraitEditResponse>();

export interface HairRecolorRequest {
  modelId: string;
  colorName: string;
  colorHex: string;
  strength?: number;
}

export function getGeneratedHairPath(
  modelId: string,
  colorName: string,
  colorHex: string
): string {
  return `/generated/${normalizeHairModelId(modelId)}/hair/${getHairColorSlug(
    colorName,
    colorHex
  )}.png`;
}

export function getHairRecolorFromMemory(
  cacheKey: string
): PortraitEditResponse | undefined {
  return hairColorMemoryCache.get(cacheKey);
}

export function setHairRecolorInMemory(
  cacheKey: string,
  response: PortraitEditResponse
): PortraitEditResponse {
  const cachedResponse = {
    ...response,
    cacheKey
  };

  hairColorMemoryCache.set(cacheKey, cachedResponse);

  return cachedResponse;
}

export async function publicHairAssetExists(
  request: Request,
  pathname: string
): Promise<boolean> {
  const assetUrl = new URL(pathname, request.url);

  try {
    const head = await fetch(assetUrl, {
      method: "HEAD",
      cache: "force-cache"
    });

    if (head.ok) {
      return true;
    }

    if (head.status !== 405) {
      return false;
    }

    const fallback = await fetch(assetUrl, {
      method: "GET",
      headers: { Range: "bytes=0-0" },
      cache: "force-cache"
    });

    return fallback.ok;
  } catch {
    return false;
  }
}

export async function savePublicPng(
  pathname: string,
  image: Buffer
): Promise<string | null> {
  try {
    const [{ mkdir, writeFile }, path] = await Promise.all([
      import("node:fs/promises"),
      import("node:path")
    ]);
    const publicRoot = path.resolve(process.cwd(), "public");
    const outputPath = path.resolve(publicRoot, pathname.replace(/^\//, ""));

    if (!outputPath.startsWith(publicRoot)) {
      return null;
    }

    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, image);

    return pathname;
  } catch {
    return null;
  }
}

export async function saveHairRecolorToPublic(
  pathname: string,
  image: Buffer
): Promise<string | null> {
  return savePublicPng(pathname, image);
}

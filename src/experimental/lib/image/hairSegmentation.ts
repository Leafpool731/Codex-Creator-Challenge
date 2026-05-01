import { normalizeHairModelId } from "@/lib/cache/hairColorCache";

export interface HairSegmentationAssets {
  modelId: string;
  portraitPath: string;
  maskPath: string;
  portrait: Buffer;
  mask: Buffer;
}

export class HairMaskMissingError extends Error {
  constructor(modelId: string) {
    super(`Hair mask needed for realistic recoloring: ${modelId}`);
    this.name = "HairMaskMissingError";
  }
}

async function fetchAssetBuffer(request: Request, pathname: string): Promise<Buffer> {
  const localAsset = await readPublicAsset(pathname);

  if (localAsset) {
    return localAsset;
  }

  const url = new URL(pathname, request.url);
  const response = await fetch(url, { cache: "force-cache" });

  if (!response.ok) {
    throw new Error(`Could not load asset ${pathname}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

async function readPublicAsset(pathname: string): Promise<Buffer | null> {
  try {
    const [{ readFile }, path] = await Promise.all([
      import("node:fs/promises"),
      import("node:path")
    ]);
    const publicRoot = path.resolve(process.cwd(), "public");
    const assetPath = path.resolve(publicRoot, pathname.replace(/^\//, ""));

    if (!assetPath.startsWith(publicRoot)) {
      return null;
    }

    return await readFile(assetPath);
  } catch {
    return null;
  }
}

export function getPortraitPath(modelId: string): string {
  return `/models/${normalizeHairModelId(modelId)}.png`;
}

export async function loadPortraitBuffer(
  request: Request,
  modelId: string
): Promise<Buffer> {
  const pathname = getPortraitPath(modelId);
  return fetchAssetBuffer(request, pathname);
}

export function getHairMaskPath(modelId: string): string {
  return `/masks/${normalizeHairModelId(modelId)}-hair-mask.png`;
}

export async function loadHairSegmentationAssets(
  request: Request,
  modelId: string
): Promise<HairSegmentationAssets> {
  const normalizedModelId = normalizeHairModelId(modelId);
  const portraitPath = getPortraitPath(normalizedModelId);
  const maskPath = getHairMaskPath(normalizedModelId);
  const portrait = await fetchAssetBuffer(request, portraitPath);

  try {
    const mask = await fetchAssetBuffer(request, maskPath);

    return {
      modelId: normalizedModelId,
      portraitPath,
      maskPath,
      portrait,
      mask
    };
  } catch {
    // TODO: Add automatic segmentation via SAM, MediaPipe Image Segmenter,
    // Replicate hair segmentation, or a masked OpenAI image edit endpoint.
    throw new HairMaskMissingError(normalizedModelId);
  }
}

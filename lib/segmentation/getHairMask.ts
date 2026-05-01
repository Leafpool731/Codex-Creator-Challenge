import {
  HairMaskMissingError,
  loadHairSegmentationAssets,
  type HairSegmentationAssets
} from "@/lib/image/hairSegmentation";

export type { HairSegmentationAssets };

/**
 * Loads the photorealistic hair mask for a model (PNG in /public/masks).
 */
export async function getHairMask(
  request: Request,
  modelId: string
): Promise<Buffer> {
  const assets = await loadHairSegmentationAssets(request, modelId);
  return assets.mask;
}

export async function getHairMaskAssets(
  request: Request,
  modelId: string
): Promise<HairSegmentationAssets> {
  return loadHairSegmentationAssets(request, modelId);
}

export { HairMaskMissingError };

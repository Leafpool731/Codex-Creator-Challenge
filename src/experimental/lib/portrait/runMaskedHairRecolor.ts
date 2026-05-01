import { HairMaskMissingError, loadHairSegmentationAssets } from "@/lib/image/hairSegmentation";
import { recolorHairPixels } from "@/lib/image/recolorHairPixels";

export async function runMaskedHairRecolor(
  request: Request,
  modelId: string,
  valueHex: string,
  strength = 0.88
): Promise<Buffer> {
  const assets = await loadHairSegmentationAssets(request, modelId);
  return recolorHairPixels({
    portrait: assets.portrait,
    mask: assets.mask,
    targetColor: valueHex,
    strength
  });
}

export { HairMaskMissingError };

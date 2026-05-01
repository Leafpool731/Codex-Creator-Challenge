import { recolorMaskedRegion } from "@/lib/image/recolorMaskedRegion";

interface RecolorHairPixelsOptions {
  portrait: Buffer;
  mask: Buffer;
  targetColor: string;
  strength?: number;
}

export async function recolorHairPixels(
  options: RecolorHairPixelsOptions
): Promise<Buffer> {
  return recolorMaskedRegion({ ...options, mode: "hair" });
}

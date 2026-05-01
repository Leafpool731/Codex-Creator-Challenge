import sharp from "sharp";
import { MASK_REGIONS } from "@/lib/segmentation/maskRegions";

export async function buildLipMaskPng(width: number, height: number): Promise<Buffer> {
  const region = MASK_REGIONS.lips;
  const cx = (region.x / 100) * width;
  const cy = (region.y / 100) * height;
  const rx = (region.width / 200) * width;
  const ry = (region.height / 200) * height;
  const shape = `<ellipse cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" rx="${Math.max(
    1,
    rx
  ).toFixed(2)}" ry="${Math.max(0.8, ry).toFixed(2)}" fill="white"/>`;
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="black"/>${shape}</svg>`;

  return sharp(Buffer.from(svg)).ensureAlpha().png().toBuffer();
}

export async function getLipMaskForPortrait(portrait: Buffer): Promise<Buffer> {
  const meta = await sharp(portrait).metadata();
  const width = meta.width ?? 800;
  const height = meta.height ?? 1000;

  return buildLipMaskPng(width, height);
}

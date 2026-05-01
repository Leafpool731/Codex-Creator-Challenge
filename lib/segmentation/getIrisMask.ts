import sharp from "sharp";
import { MASK_REGIONS, type MaskRegion } from "@/lib/segmentation/maskRegions";

function ellipseSvg(region: MaskRegion, width: number, height: number): string {
  const cx = (region.x / 100) * width;
  const cy = (region.y / 100) * height;
  const rx = (region.width / 200) * width;
  const ry = (region.height / 200) * height;

  return `<ellipse cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" rx="${Math.max(
    0.6,
    rx
  ).toFixed(2)}" ry="${Math.max(0.6, ry).toFixed(2)}" fill="white"/>`;
}

export async function buildIrisMaskPng(width: number, height: number): Promise<Buffer> {
  const shapes = [MASK_REGIONS.leftIris, MASK_REGIONS.rightIris]
    .map((region) => ellipseSvg(region, width, height))
    .join("");
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="black"/>${shapes}</svg>`;

  return sharp(Buffer.from(svg)).ensureAlpha().png().toBuffer();
}

export async function getIrisMaskForPortrait(portrait: Buffer): Promise<Buffer> {
  const meta = await sharp(portrait).metadata();
  const width = meta.width ?? 800;
  const height = meta.height ?? 1000;

  return buildIrisMaskPng(width, height);
}

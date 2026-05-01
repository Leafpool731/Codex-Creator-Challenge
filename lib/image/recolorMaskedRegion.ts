import sharp from "sharp";

export type RecolorMaskMode = "hair" | "eyes" | "lips";

interface Rgb {
  r: number;
  g: number;
  b: number;
}

interface Hsl {
  h: number;
  s: number;
  l: number;
}

export interface RecolorMaskedRegionOptions {
  portrait: Buffer;
  mask: Buffer;
  targetColor: string;
  strength?: number;
  mode?: RecolorMaskMode;
}

function clamp(value: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, value));
}

function mix(a: number, b: number, amount: number): number {
  return a + (b - a) * amount;
}

function hexToRgb(hex: string): Rgb {
  const clean = hex.replace("#", "").trim();
  const normalized =
    clean.length === 3
      ? clean
          .split("")
          .map((character) => `${character}${character}`)
          .join("")
      : clean;

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16)
  };
}

function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l: lightness };
  }

  const delta = max - min;
  const saturation =
    lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let hue: number;

  if (max === red) {
    hue = (green - blue) / delta + (green < blue ? 6 : 0);
  } else if (max === green) {
    hue = (blue - red) / delta + 2;
  } else {
    hue = (red - green) / delta + 4;
  }

  return { h: hue / 6, s: saturation, l: lightness };
}

function hueToRgb(p: number, q: number, t: number): number {
  let hue = t;

  if (hue < 0) hue += 1;
  if (hue > 1) hue -= 1;
  if (hue < 1 / 6) return p + (q - p) * 6 * hue;
  if (hue < 1 / 2) return q;
  if (hue < 2 / 3) return p + (q - p) * (2 / 3 - hue) * 6;

  return p;
}

function hslToRgb({ h, s, l }: Hsl): Rgb {
  if (s === 0) {
    const gray = Math.round(l * 255);

    return { r: gray, g: gray, b: gray };
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hueToRgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hueToRgb(p, q, h) * 255),
    b: Math.round(hueToRgb(p, q, h - 1 / 3) * 255)
  };
}

function getMaskAmount(maskData: Buffer, index: number): number {
  const r = maskData[index];
  const g = maskData[index + 1];
  const b = maskData[index + 2];
  const alpha = maskData[index + 3] / 255;
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

  return clamp(luminance * alpha);
}

const modeParams: Record<
  RecolorMaskMode,
  { maskFloor: number; sMix: number; lMix: number; strengthScale: number }
> = {
  hair: { maskFloor: 0.2, sMix: 0.65, lMix: 0.15, strengthScale: 1 },
  eyes: { maskFloor: 0.12, sMix: 0.45, lMix: 0.22, strengthScale: 0.72 },
  lips: { maskFloor: 0.14, sMix: 0.55, lMix: 0.28, strengthScale: 0.78 }
};

/**
 * Recolors only pixels covered by the mask, preserving texture and unmasked areas.
 */
export async function recolorMaskedRegion({
  portrait,
  mask,
  targetColor,
  strength = 0.88,
  mode = "hair"
}: RecolorMaskedRegionOptions): Promise<Buffer> {
  const portraitImage = await sharp(portrait)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = portraitImage.info;
  const maskImage = await sharp(mask)
    .resize(width, height, { fit: "fill" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const output = Buffer.from(portraitImage.data);
  const targetHsl = rgbToHsl(hexToRgb(targetColor));
  const params = modeParams[mode];
  const safeStrength = clamp(strength * params.strengthScale);

  for (let index = 0; index < output.length; index += 4) {
    const maskAmount = getMaskAmount(maskImage.data, index);

    if (maskAmount <= params.maskFloor) {
      continue;
    }

    const original = {
      r: output[index],
      g: output[index + 1],
      b: output[index + 2]
    };
    const originalHsl = rgbToHsl(original);
    const recolored = hslToRgb({
      h: targetHsl.h,
      s: mix(originalHsl.s, targetHsl.s, params.sMix),
      l: originalHsl.l * (1 - params.lMix) + targetHsl.l * params.lMix
    });
    const amount = clamp(maskAmount * safeStrength);

    output[index] = Math.round(mix(original.r, recolored.r, amount));
    output[index + 1] = Math.round(mix(original.g, recolored.g, amount));
    output[index + 2] = Math.round(mix(original.b, recolored.b, amount));
  }

  return sharp(output, {
    raw: {
      width,
      height,
      channels: 4
    }
  })
    .png()
    .toBuffer();
}

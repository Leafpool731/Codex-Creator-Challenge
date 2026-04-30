export type PortraitEditType = "hair" | "eyes" | "lips" | "blush" | "freckles";

export type PortraitEditStatus =
  | "cached"
  | "precomputed"
  | "generated"
  | "fallback"
  | "pending";

export interface PortraitEditDescriptor {
  modelId: string;
  baseImageVersion?: string;
  editType: PortraitEditType;
  valueName: string;
  valueHex?: string;
  intensity?: number;
  lightingPreset?: string;
  currentImageUrl?: string;
}

export interface PortraitEditResponse {
  cacheKey: string;
  editType: PortraitEditType;
  imageUrl: string;
  status: PortraitEditStatus;
  source: "static" | "memory" | "persistent" | "remote" | "css-preview";
  aiRefined: boolean;
  cacheHit: boolean;
  message?: string;
}

export interface PortraitVariantPreset {
  editType: PortraitEditType;
  valueName: string;
  valueHex?: string;
  intensity?: number;
}

export const PORTRAIT_BASE_IMAGE_VERSION = "v1";

const INTENSITY_BUCKETS = [0, 25, 50, 75, 100] as const;
const STATIC_VALUE_SLUG_ALIASES: Partial<
  Record<PortraitEditType, Record<string, string>>
> = {
  lips: {
    "rose-balm": "nude-rose",
    "peach-nude": "nude-rose",
    "berry-veil": "berry",
    "coral-gloss": "coral",
    "clear-red": "red",
    "cocoa-rose": "plum"
  }
};

export function bucketIntensity(value = 75): number {
  const normalized = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 75));

  return INTENSITY_BUCKETS.reduce((nearest, bucket) => {
    return Math.abs(bucket - normalized) < Math.abs(nearest - normalized)
      ? bucket
      : nearest;
  }, INTENSITY_BUCKETS[0]);
}

export function slugifyValue(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/#/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "default";
}

export function normalizeHex(value?: string): string {
  if (!value) {
    return "none";
  }

  return value.trim().toLowerCase();
}

export function normalizePortraitEditDescriptor(
  descriptor: PortraitEditDescriptor
): Required<Omit<PortraitEditDescriptor, "currentImageUrl">> &
  Pick<PortraitEditDescriptor, "currentImageUrl"> {
  return {
    modelId: slugifyValue(descriptor.modelId),
    baseImageVersion: descriptor.baseImageVersion ?? PORTRAIT_BASE_IMAGE_VERSION,
    editType: descriptor.editType,
    valueName: slugifyValue(descriptor.valueName),
    valueHex: normalizeHex(descriptor.valueHex),
    intensity: bucketIntensity(descriptor.intensity),
    lightingPreset: slugifyValue(descriptor.lightingPreset ?? "daylight"),
    currentImageUrl: descriptor.currentImageUrl
  };
}

export function createPortraitEditCacheKey(
  descriptor: PortraitEditDescriptor
): string {
  const normalized = normalizePortraitEditDescriptor(descriptor);

  return [
    normalized.modelId,
    normalized.baseImageVersion,
    normalized.editType,
    normalized.valueName,
    normalized.valueHex,
    normalized.intensity,
    normalized.lightingPreset
  ].join(":");
}

export function getGeneratedVariantSlug(descriptor: PortraitEditDescriptor): string {
  const normalized = normalizePortraitEditDescriptor(descriptor);

  if (normalized.editType === "blush" || normalized.editType === "freckles") {
    return `${normalized.intensity}`;
  }

  return (
    STATIC_VALUE_SLUG_ALIASES[normalized.editType]?.[normalized.valueName] ??
    normalized.valueName
  );
}

export function getGeneratedPortraitPath(descriptor: PortraitEditDescriptor): string {
  const normalized = normalizePortraitEditDescriptor(descriptor);
  const valueSlug = getGeneratedVariantSlug(descriptor);

  return `/generated/${normalized.modelId}/${normalized.editType}/${valueSlug}.png`;
}

export function getGeneratedPortraitObjectKey(
  descriptor: PortraitEditDescriptor
): string {
  return getGeneratedPortraitPath(descriptor).replace(/^\//, "");
}

export const COMMON_PREGENERATED_VARIANTS: PortraitVariantPreset[] = [
  { editType: "hair", valueName: "black", valueHex: "#18110D", intensity: 75 },
  { editType: "hair", valueName: "espresso brown", valueHex: "#3A241A", intensity: 75 },
  { editType: "hair", valueName: "chestnut", valueHex: "#6A3F28", intensity: 75 },
  { editType: "hair", valueName: "auburn", valueHex: "#7A3528", intensity: 75 },
  { editType: "hair", valueName: "copper", valueHex: "#A44E2D", intensity: 75 },
  { editType: "hair", valueName: "golden blonde", valueHex: "#C89A52", intensity: 75 },
  { editType: "hair", valueName: "ash blonde", valueHex: "#B7A78A", intensity: 75 },
  { editType: "eyes", valueName: "brown", valueHex: "#5A3825", intensity: 75 },
  { editType: "eyes", valueName: "hazel", valueHex: "#8A6B35", intensity: 75 },
  { editType: "eyes", valueName: "green", valueHex: "#4F7A55", intensity: 75 },
  { editType: "eyes", valueName: "blue", valueHex: "#527DAA", intensity: 75 },
  { editType: "eyes", valueName: "gray", valueHex: "#8A9296", intensity: 75 },
  { editType: "lips", valueName: "nude rose", valueHex: "#B86A72", intensity: 75 },
  { editType: "lips", valueName: "coral", valueHex: "#D46155", intensity: 75 },
  { editType: "lips", valueName: "berry", valueHex: "#8D4057", intensity: 75 },
  { editType: "lips", valueName: "red", valueHex: "#B9283D", intensity: 75 },
  { editType: "lips", valueName: "plum", valueHex: "#6F2E4A", intensity: 75 },
  { editType: "blush", valueName: "25", valueHex: "#D36969", intensity: 25 },
  { editType: "blush", valueName: "50", valueHex: "#D36969", intensity: 50 },
  { editType: "blush", valueName: "75", valueHex: "#D36969", intensity: 75 },
  { editType: "freckles", valueName: "25", valueHex: "#55321E", intensity: 25 },
  { editType: "freckles", valueName: "50", valueHex: "#55321E", intensity: 50 },
  { editType: "freckles", valueName: "75", valueHex: "#55321E", intensity: 75 }
];

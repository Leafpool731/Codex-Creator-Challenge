import {
  createHairColorCacheKey,
  createPortraitEditCacheKey,
  normalizePortraitEditDescriptor,
  type PortraitEditDescriptor,
  type PortraitEditResponse,
  type PortraitEditType
} from "@/lib/cache/cacheKey";
import { getHairRecolorFromMemory, setHairRecolorInMemory } from "@/lib/cache/hairColorCache";
import {
  getPortraitEditFromMemory,
  setPortraitEditInMemory
} from "@/lib/cache/portraitEditCache";

function isHairEdit(editType: PortraitEditType): boolean {
  return editType === "hair";
}

function resolvedHairHex(descriptor: PortraitEditDescriptor): string {
  const raw = descriptor.valueHex?.trim().toLowerCase();
  if (!raw || raw === "none") {
    return "#000000";
  }

  return descriptor.valueHex!.trim().toLowerCase();
}

export function getFeatureEditCacheKey(descriptor: PortraitEditDescriptor): string {
  if (isHairEdit(descriptor.editType)) {
    return createHairColorCacheKey({
      modelId: descriptor.modelId,
      colorName: descriptor.valueName,
      colorHex: resolvedHairHex(descriptor)
    });
  }

  return createPortraitEditCacheKey(normalizePortraitEditDescriptor(descriptor));
}

export function getCachedFeatureEdit(
  descriptor: PortraitEditDescriptor
): PortraitEditResponse | undefined {
  const key = getFeatureEditCacheKey(descriptor);

  if (isHairEdit(descriptor.editType)) {
    return getHairRecolorFromMemory(key);
  }

  return getPortraitEditFromMemory(key);
}

export function setCachedFeatureEdit(
  descriptor: PortraitEditDescriptor,
  response: PortraitEditResponse
): PortraitEditResponse {
  const key = getFeatureEditCacheKey(descriptor);

  if (isHairEdit(descriptor.editType)) {
    return setHairRecolorInMemory(key, response);
  }

  return setPortraitEditInMemory(key, response);
}

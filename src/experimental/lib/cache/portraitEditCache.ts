import type { PortraitEditResponse } from "@/lib/cache/cacheKey";

const memoryPortraitEditCache = new Map<string, PortraitEditResponse>();

export function getPortraitEditFromMemory(
  cacheKey: string
): PortraitEditResponse | undefined {
  return memoryPortraitEditCache.get(cacheKey);
}

export function setPortraitEditInMemory(
  cacheKey: string,
  response: PortraitEditResponse
): PortraitEditResponse {
  const cachedResponse: PortraitEditResponse = {
    ...response,
    cacheKey
  };

  memoryPortraitEditCache.set(cacheKey, cachedResponse);

  return cachedResponse;
}

export function hasPortraitEditInMemory(cacheKey: string): boolean {
  return memoryPortraitEditCache.has(cacheKey);
}

export function clearPortraitEditMemoryCache(): void {
  memoryPortraitEditCache.clear();
}

import {
  getGeneratedPortraitPath,
  type PortraitEditDescriptor,
  type PortraitEditResponse
} from "@/lib/cache/cacheKey";

interface StoredTextObject {
  text: () => Promise<string>;
}

export interface PortraitObjectBucket {
  get: (key: string) => Promise<StoredTextObject | null>;
  put: (key: string, value: string, options?: unknown) => Promise<unknown>;
}

export interface PortraitStorage {
  findStaticVariant: (descriptor: PortraitEditDescriptor) => Promise<string | null>;
  getPersistentResponse: (cacheKey: string) => Promise<PortraitEditResponse | null>;
  savePersistentResponse: (
    cacheKey: string,
    response: PortraitEditResponse
  ) => Promise<void>;
}

function getResponseKey(cacheKey: string): string {
  return `portrait-edits/${encodeURIComponent(cacheKey)}.json`;
}

async function publicAssetExists(url: URL): Promise<boolean> {
  try {
    const head = await fetch(url, {
      method: "HEAD",
      cache: "force-cache"
    });

    if (head.ok) {
      return true;
    }

    if (head.status !== 405) {
      return false;
    }

    const fallback = await fetch(url, {
      method: "GET",
      headers: { Range: "bytes=0-0" },
      cache: "force-cache"
    });

    return fallback.ok;
  } catch {
    return false;
  }
}

export function createPortraitStorage(
  request: Request,
  bucket?: PortraitObjectBucket
): PortraitStorage {
  return {
    async findStaticVariant(descriptor) {
      const pathname = getGeneratedPortraitPath(descriptor);
      const publicUrl = new URL(pathname, request.url);
      const exists = await publicAssetExists(publicUrl);

      return exists ? pathname : null;
    },

    async getPersistentResponse(cacheKey) {
      if (!bucket) {
        return null;
      }

      const object = await bucket.get(getResponseKey(cacheKey));

      if (!object) {
        return null;
      }

      try {
        return JSON.parse(await object.text()) as PortraitEditResponse;
      } catch {
        return null;
      }
    },

    async savePersistentResponse(cacheKey, response) {
      if (!bucket) {
        return;
      }

      await bucket.put(getResponseKey(cacheKey), JSON.stringify(response), {
        httpMetadata: { contentType: "application/json" }
      });
    }
  };
}

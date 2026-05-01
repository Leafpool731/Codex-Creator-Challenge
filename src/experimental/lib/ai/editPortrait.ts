import {
  normalizePortraitEditDescriptor,
  type PortraitEditDescriptor
} from "@/lib/cache/cacheKey";

export interface AIEditResult {
  imageUrl?: string;
  status: "generated" | "unavailable" | "error";
  message?: string;
}

interface RemoteEditPayload {
  imageUrl?: unknown;
  url?: unknown;
  outputUrl?: unknown;
  error?: unknown;
}

function readEnv(name: string): string | undefined {
  try {
    return process.env[name];
  } catch {
    return undefined;
  }
}

function buildInstruction(descriptor: PortraitEditDescriptor): string {
  const normalized = normalizePortraitEditDescriptor(descriptor);

  if (normalized.editType === "hair") {
    return `Photorealistically recolor only the hair to ${descriptor.valueName}. Preserve skin, eyes, lips, background, lighting, hair texture, and facial identity.`;
  }

  if (normalized.editType === "eyes") {
    return `Photorealistically recolor only the irises to ${descriptor.valueName}. Preserve pupils, catchlights, eyelids, skin, and facial identity.`;
  }

  if (normalized.editType === "lips") {
    return `Apply a realistic ${descriptor.valueName} lip tint only to the lips. Preserve skin, teeth, eyes, hair, background, and facial identity.`;
  }

  if (normalized.editType === "blush") {
    return `Add natural blush to both cheeks at ${normalized.intensity}% intensity. Preserve all other facial features and identity.`;
  }

  return `Add natural freckles across the nose and upper cheeks at ${normalized.intensity}% intensity. Preserve all other facial features and identity.`;
}

export async function editPortraitWithAI(
  descriptor: PortraitEditDescriptor,
  signal?: AbortSignal
): Promise<AIEditResult> {
  const endpoint = readEnv("AI_PORTRAIT_EDIT_ENDPOINT");
  const apiKey = readEnv("AI_PORTRAIT_EDIT_API_KEY");

  if (!endpoint) {
    return {
      status: "unavailable",
      message: "No AI portrait edit endpoint is configured."
    };
  }

  const normalized = normalizePortraitEditDescriptor(descriptor);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
      },
      body: JSON.stringify({
        ...normalized,
        currentImageUrl: descriptor.currentImageUrl,
        instruction: buildInstruction(descriptor)
      }),
      signal
    });

    if (!response.ok) {
      return {
        status: "error",
        message: `AI edit endpoint returned ${response.status}.`
      };
    }

    const payload = (await response.json()) as RemoteEditPayload;
    const imageUrl = payload.imageUrl ?? payload.url ?? payload.outputUrl;

    if (typeof imageUrl !== "string" || imageUrl.length === 0) {
      return {
        status: "error",
        message:
          typeof payload.error === "string"
            ? payload.error
            : "AI edit endpoint did not return an image URL."
      };
    }

    return {
      status: "generated",
      imageUrl
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return {
        status: "error",
        message: "AI portrait edit request was cancelled."
      };
    }

    return {
      status: "error",
      message: error instanceof Error ? error.message : "AI portrait edit failed."
    };
  }
}

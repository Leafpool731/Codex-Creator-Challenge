import { editPortraitWithAI, type AIEditResult } from "@/lib/ai/editPortrait";
import type { PortraitEditDescriptor } from "@/lib/cache/cacheKey";

/**
 * Remote AI refinement for portrait edits. When no endpoint is configured,
 * callers should fall back to deterministic masked recolor.
 */
export async function editMaskedImageWithAI(
  descriptor: PortraitEditDescriptor,
  signal?: AbortSignal
): Promise<AIEditResult> {
  return editPortraitWithAI(descriptor, signal);
}

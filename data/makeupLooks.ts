/** URL segment and message key prefix under `makeupLooks` in messages JSON */
export const makeupLookSlugs = [
  "olive-neutral",
  "purple-radiance",
  "icy-rose",
  "kpop-inspired"
] as const;

export type MakeupLookSlug = (typeof makeupLookSlugs)[number];

export const makeupLookImages: Record<MakeupLookSlug, string> = {
  "olive-neutral": "/makeup-looks/olive-neutral.png",
  "purple-radiance": "/makeup-looks/purple-radiance.png",
  "icy-rose": "/makeup-looks/icy-rose.png",
  "kpop-inspired": "/makeup-looks/kpop-inspired.png"
};

/** CamelCase segment for next-intl nested keys */
export function makeupLookMessageKey(slug: string): string | null {
  const map: Record<string, string> = {
    "olive-neutral": "oliveNeutral",
    "purple-radiance": "purpleRadiance",
    "icy-rose": "icyRose",
    "kpop-inspired": "kpopInspired"
  };
  return map[slug] ?? null;
}

export function isMakeupLookSlug(slug: string): slug is MakeupLookSlug {
  return (makeupLookSlugs as readonly string[]).includes(slug);
}

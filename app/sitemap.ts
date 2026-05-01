import type { MetadataRoute } from "next";
import { makeupLookSlugs } from "@/data/makeupLooks";
import { routing } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const staticPaths = ["", "/studio", "/makeup-looks"];
  const lookPaths = makeupLookSlugs.map((slug) => `/makeup-looks/${slug}`);

  const entries: MetadataRoute.Sitemap = [];

  for (const loc of routing.locales) {
    for (const path of staticPaths) {
      const url = `${base}/${loc}${path}`;
      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: path === "" ? 1 : path === "/studio" ? 0.9 : 0.75
      });
    }
    for (const path of lookPaths) {
      entries.push({
        url: `${base}/${loc}${path}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.65
      });
    }
  }

  return entries;
}

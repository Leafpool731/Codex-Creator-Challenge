import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const staticPaths = ["", "/studio"];

  const entries: MetadataRoute.Sitemap = [];

  for (const loc of routing.locales) {
    for (const path of staticPaths) {
      const url = `${base}/${loc}${path}`;
      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "weekly",
        priority: path === "" ? 1 : 0.9
      });
    }
  }

  return entries;
}

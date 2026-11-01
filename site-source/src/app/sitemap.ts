import type { MetadataRoute } from "next";

import { SITE } from "@/config/site";
import { getPublishedStoryMetas } from "@/lib/content";

/**
 * Static sitemap for both locales: Traditional Chinese at the root and
 * English under /en. trailingSlash is enabled, so canonical URLs end
 * with "/" to match the GitHub Pages directory layout.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const stories = getPublishedStoryMetas();
  const lastModified = stories.reduce(
    (latest, m) => (m.editorial.sourceVerifiedDate > latest ? m.editorial.sourceVerifiedDate : latest),
    "2026-10-23",
  );

  const staticPaths = [
    "",
    "/stories",
    "/theme/peaceful-life",
    "/theme/pure-land",
    "/library",
    "/methodology",
    "/about",
    "/licensing",
  ];
  const storyPaths = stories.map((m) => `/stories/${m.slug}`);
  const allPaths = [...staticPaths, ...storyPaths];

  const urls: MetadataRoute.Sitemap = [];
  for (const p of allPaths) {
    urls.push({
      url: `${SITE.pagesOrigin}${p}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: p === "" ? 1 : 0.7,
    });
    urls.push({
      url: `${SITE.pagesOrigin}/en${p}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: p === "" ? 0.9 : 0.6,
    });
  }
  return urls;
}

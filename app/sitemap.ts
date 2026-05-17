import type { MetadataRoute } from "next"
import { getAllCourseSlugs } from "lib/courses"
import { getAllAreaSlugs } from "lib/areas"
import { getAllTagSlugs } from "lib/tags"

export const dynamic = "force-static"

const BASE_URL = "https://sozoroto.reload.co.jp"

export default function sitemap(): MetadataRoute.Sitemap {
  const courseSlugs = getAllCourseSlugs()
  const areaSlugs = getAllAreaSlugs()
  const tagSlugs = getAllTagSlugs()

  return [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/courses`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/areas`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    ...courseSlugs.map((slug) => ({
      url: `${BASE_URL}/courses/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...areaSlugs.map((slug) => ({
      url: `${BASE_URL}/areas/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...tagSlugs.map((slug) => ({
      url: `${BASE_URL}/tags/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ]
}

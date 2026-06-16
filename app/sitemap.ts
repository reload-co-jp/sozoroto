import type { MetadataRoute } from "next"
import { getAllCourses } from "lib/courses"
import { getAllAreaIds } from "lib/areas"
import { getAllTagIds } from "lib/tags"

export const dynamic = "force-static"

const BASE_URL = "https://sozoroto.reload.co.jp"

export default function sitemap(): MetadataRoute.Sitemap {
  const courses = getAllCourses()
  const areaIds = getAllAreaIds()
  const tagIds = getAllTagIds()

  return [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/courses`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/areas`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    ...courses.map((course) => ({
      url: `${BASE_URL}/courses/${course.id}`,
      lastModified: course.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...areaIds.map((id) => ({
      url: `${BASE_URL}/areas/${id}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...tagIds.map((id) => ({
      url: `${BASE_URL}/tags/${id}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ]
}

import type { MetadataRoute } from "next"
import {
  getAllCourses,
  getCoursesByArea,
  getDurationPageBands,
  getDistancePageBands,
} from "lib/courses"
import { getAllAreas } from "lib/areas"
import { getTagsWithCourseCount } from "lib/tags"
import { pageUrl, MIN_INDEXABLE_COURSES } from "lib/seo"

export const dynamic = "force-static"

// noindexページ（コース0件のエリア・コース数不足のテーマ）は含めない
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: pageUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: pageUrl("/courses"), changeFrequency: "daily", priority: 0.9 },
    { url: pageUrl("/areas"), changeFrequency: "weekly", priority: 0.8 },
    { url: pageUrl("/about"), changeFrequency: "monthly", priority: 0.5 },
    ...getAllCourses().map((course) => ({
      url: pageUrl(`/courses/${course.id}`),
      lastModified: course.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...getAllAreas()
      .filter((a) => getCoursesByArea(a.id).length > 0)
      .map((a) => ({
        url: pageUrl(`/areas/${a.id}`),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ...getTagsWithCourseCount()
      .filter((t) => t.courseCount >= MIN_INDEXABLE_COURSES)
      .map((t) => ({
        url: pageUrl(`/tags/${t.id}`),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ...getDurationPageBands().map((m) => ({
      url: pageUrl(`/duration/${m}`),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...getDistancePageBands().map((k) => ({
      url: pageUrl(`/distance/${k}km`),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ]
}

import type { MetadataRoute } from "next"
import {
  getAllCourses,
  getCoursesByArea,
  getCoursesByTag,
  getCoursesByDuration,
  getCoursesByDistance,
  getDurationPageBands,
  getDistancePageBands,
} from "lib/courses"
import { getAllAreas } from "lib/areas"
import { getSpotPages } from "lib/spots"
import { getTagsWithCourseCount } from "lib/tags"
import { getStationPages } from "lib/stations"
import { pageUrl, MIN_INDEXABLE_COURSES } from "lib/seo"
import type { Course } from "types/course"

export const dynamic = "force-static"

// 一覧ページの更新日 = 掲載コースの最新更新日
const latest = (courses: Course[]) =>
  courses
    .map((c) => c.updatedAt)
    .sort()
    .at(-1)

// noindexページ（コース0件のエリア・コース数不足のテーマ）は含めない
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: pageUrl("/"),
      lastModified: latest(getAllCourses()),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: pageUrl("/courses"),
      lastModified: latest(getAllCourses()),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: pageUrl("/areas"),
      lastModified: latest(getAllCourses()),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: pageUrl("/stations"),
      lastModified: latest(getAllCourses()),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    { url: pageUrl("/about"), changeFrequency: "monthly", priority: 0.5 },
    ...getAllCourses().map((course) => ({
      url: pageUrl(`/courses/${course.id}`),
      lastModified: course.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...getSpotPages().map((s) => ({
      url: pageUrl(`/spots/${s.slug}`),
      lastModified: s.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...getAllAreas()
      .filter((a) => getCoursesByArea(a.id).length > 0)
      .map((a) => ({
        url: pageUrl(`/areas/${a.id}`),
        lastModified: latest(getCoursesByArea(a.id)),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ...getTagsWithCourseCount()
      .filter((t) => t.courseCount >= MIN_INDEXABLE_COURSES)
      .map((t) => ({
        url: pageUrl(`/tags/${t.id}`),
        lastModified: latest(getCoursesByTag(t.slug)),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ...getStationPages().map((s) => ({
      url: pageUrl(`/stations/${s.slug}`),
      lastModified: latest(s.courses),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...getDurationPageBands().map((m) => ({
      url: pageUrl(`/duration/${m}`),
      lastModified: latest(getCoursesByDuration(m)),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...getDistancePageBands().map((k) => ({
      url: pageUrl(`/distance/${k}km`),
      lastModified: latest(getCoursesByDistance(k)),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ]
}

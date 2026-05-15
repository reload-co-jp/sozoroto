import type { Tag } from "types/tag"
import tagsData from "data/tags.json"
import { getCoursesByTag } from "lib/courses"

const tags = tagsData as Tag[]

export function getAllTags(): Tag[] {
  return tags
}

export function getTagBySlug(slug: string): Tag | undefined {
  return tags.find((t) => t.slug === slug)
}

export function getTagsWithCourseCount(): (Tag & { courseCount: number })[] {
  return tags
    .map((tag) => ({
      ...tag,
      courseCount: getCoursesByTag(tag.slug).length,
    }))
    .filter((t) => t.courseCount > 0)
}

export function getAllTagSlugs(): string[] {
  return tags.map((t) => t.slug)
}

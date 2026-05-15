import type { Course, Difficulty } from "types/course"
import coursesData from "data/courses.json"

const courses = coursesData as Course[]

export function getAllCourses(): Course[] {
  return courses.filter((c) => c.status === "published")
}

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug && c.status === "published")
}

export function getCoursesByArea(areaId: string): Course[] {
  return getAllCourses().filter((c) => c.areaId === areaId)
}

export function getCoursesByTag(tagSlug: string): Course[] {
  return getAllCourses().filter((c) => c.tags.includes(tagSlug))
}

export type CourseFilter = {
  q?: string
  areaId?: string
  durationMax?: number
  distanceMax?: number
  difficulty?: Difficulty
  tag?: string
}

export function filterCourses(filter: CourseFilter): Course[] {
  let result = getAllCourses()

  if (filter.q) {
    const q = filter.q.toLowerCase()
    result = result.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.shortDescription.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    )
  }
  if (filter.areaId) {
    result = result.filter((c) => c.areaId === filter.areaId)
  }
  if (filter.durationMax) {
    result = result.filter((c) => c.durationMinutes <= filter.durationMax!)
  }
  if (filter.distanceMax) {
    result = result.filter((c) => c.distanceMeters <= filter.distanceMax!)
  }
  if (filter.difficulty) {
    result = result.filter((c) => c.difficulty === filter.difficulty)
  }
  if (filter.tag) {
    result = result.filter((c) => c.tags.includes(filter.tag!))
  }

  return result
}

export function getAllCourseSlugs(): string[] {
  return getAllCourses().map((c) => c.slug)
}

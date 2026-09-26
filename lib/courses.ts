import type { Course, Difficulty } from "types/course"
import coursesData from "data/courses.json"
import { MIN_INDEXABLE_COURSES } from "lib/seo"

const courses = coursesData as Course[]

export function getAllCourses(): Course[] {
  return courses.filter((c) => c.status === "published")
}

export function getCourseById(id: number): Course | undefined {
  return courses.find((c) => c.id === id && c.status === "published")
}

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug && c.status === "published")
}

export function getCoursesByArea(areaId: number): Course[] {
  return getAllCourses().filter((c) => c.areaId === areaId)
}

export function getCoursesByTag(tagSlug: string): Course[] {
  return getAllCourses().filter((c) => c.tags.includes(tagSlug))
}

export type CourseFilter = {
  q?: string
  areaId?: number
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
  if (filter.areaId !== undefined) {
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

export function getAllCourseIds(): number[] {
  return getAllCourses().map((c) => c.id)
}

// 関連度: 同エリア+5, 共通タグ1つにつき+3, 距離差1km以内+2, 所要時間差15分以内+2
export function getRelatedCourses(course: Course, limit = 4): Course[] {
  return getAllCourses()
    .filter((c) => c.id !== course.id)
    .map((c) => {
      let score = 0
      if (c.areaId === course.areaId) score += 5
      score += 3 * c.tags.filter((t) => course.tags.includes(t)).length
      if (Math.abs(c.distanceMeters - course.distanceMeters) <= 1000) score += 2
      if (Math.abs(c.durationMinutes - course.durationMinutes) <= 15) score += 2
      return { c, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ c }) => c)
}

// 所要時間・距離別ページの区分。各区分は重複しない（同じコース集合のページを作らない）
export const DURATION_BANDS = [30, 60, 90, 120] as const
export const DISTANCE_BANDS_KM = [2, 3, 5, 8] as const

function inBand(value: number, bands: readonly number[], band: number) {
  const i = bands.indexOf(band)
  return i >= 0 && value > (bands[i - 1] ?? 0) && value <= band
}

export function getCoursesByDuration(minutes: number): Course[] {
  return getAllCourses().filter((c) =>
    inBand(c.durationMinutes, DURATION_BANDS, minutes)
  )
}

export function getCoursesByDistance(km: number): Course[] {
  return getAllCourses().filter((c) =>
    inBand(c.distanceMeters / 1000, DISTANCE_BANDS_KM, km)
  )
}

// コース数が十分な区分だけページを生成する（薄いページを作らない）
export function getDurationPageBands(): number[] {
  return DURATION_BANDS.filter(
    (b) => getCoursesByDuration(b).length >= MIN_INDEXABLE_COURSES
  )
}

export function getDistancePageBands(): number[] {
  return DISTANCE_BANDS_KM.filter(
    (b) => getCoursesByDistance(b).length >= MIN_INDEXABLE_COURSES
  )
}

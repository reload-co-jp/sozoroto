import type { Spot, CourseSpot } from "types/spot"
import type { Course } from "types/course"
import { getAllCourses, getCourseById } from "lib/courses"
import spotsData from "data/spots.json"
import courseSpotsData from "data/course_spots.json"

const spots = spotsData as Spot[]
const courseSpots = courseSpotsData as CourseSpot[]

export function getSpotById(id: number): Spot | undefined {
  return spots.find((s) => s.id === id)
}

export type CourseSpotWithSpot = CourseSpot & { spot: Spot }

export function getCourseSpots(courseId: number): CourseSpotWithSpot[] {
  return courseSpots
    .filter((cs) => cs.courseId === courseId)
    .sort((a, b) => a.order - b.order)
    .flatMap((cs) => {
      const spot = spots.find((s) => s.id === cs.spotId)
      if (!spot) return []
      return [{ ...cs, spot }]
    })
}

// 説明が短いスポット（駅など）はページ化しない（薄いページを作らない）
const MIN_SPOT_PAGE_DESCRIPTION = 60

export function getSpotBySlug(slug: string): Spot | undefined {
  return spots.find((s) => s.slug === slug)
}

export function getCoursesBySpot(spotId: number): Course[] {
  const courseIds = new Set(
    courseSpots.filter((cs) => cs.spotId === spotId).map((cs) => cs.courseId)
  )
  return getAllCourses().filter((c) => courseIds.has(c.id))
}

export function hasSpotPage(spot: Spot): boolean {
  return (
    (spot.description?.length ?? 0) >= MIN_SPOT_PAGE_DESCRIPTION &&
    getCoursesBySpot(spot.id).length > 0
  )
}

export function getSpotPages(): Spot[] {
  return spots.filter(hasSpotPage)
}

export function getSpotPagesByArea(areaId: number): Spot[] {
  return getSpotPages().filter((s) => s.areaId === areaId)
}

export function getSpotPagesByTag(tagSlug: string): Spot[] {
  return getSpotPages().filter((s) => s.tags.includes(tagSlug))
}

// コース内の各スポット紹介文（見どころ）
export function getSpotHighlights(spotId: number) {
  return courseSpots.flatMap((cs) => {
    const course = cs.spotId === spotId && getCourseById(cs.courseId)
    return course && cs.description
      ? [{ course, description: cs.description }]
      : []
  })
}

// 周辺スポット: 半径1.5km以内のページがあるスポットを近い順（簡易平面距離）
export function getNearbySpots(spot: Spot, limit = 6): Spot[] {
  const m = (s: Spot) =>
    Math.hypot(
      (s.latitude - spot.latitude) * 111000,
      (s.longitude - spot.longitude) * 91000
    )
  return getSpotPages()
    .filter((s) => s.id !== spot.id && m(s) <= 1500)
    .sort((a, b) => m(a) - m(b))
    .slice(0, limit)
}

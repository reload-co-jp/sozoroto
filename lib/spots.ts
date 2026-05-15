import type { Spot, CourseSpot } from "types/spot"
import spotsData from "data/spots.json"
import courseSpotsData from "data/course_spots.json"

const spots = spotsData as Spot[]
const courseSpots = courseSpotsData as CourseSpot[]

export function getSpotById(id: string): Spot | undefined {
  return spots.find((s) => s.id === id)
}

export type CourseSpotWithSpot = CourseSpot & { spot: Spot }

export function getCourseSpots(courseId: string): CourseSpotWithSpot[] {
  return courseSpots
    .filter((cs) => cs.courseId === courseId)
    .sort((a, b) => a.order - b.order)
    .flatMap((cs) => {
      const spot = spots.find((s) => s.id === cs.spotId)
      if (!spot) return []
      return [{ ...cs, spot }]
    })
}

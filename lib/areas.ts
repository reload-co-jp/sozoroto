import type { Area } from "types/area"
import areasData from "data/areas.json"
import { getCoursesByArea } from "lib/courses"

const areas = areasData as Area[]

export function getAllAreas(): Area[] {
  return areas
}

export function getAreaById(id: string): Area | undefined {
  return areas.find((a) => a.id === id)
}

export function getAreaBySlug(slug: string): Area | undefined {
  return areas.find((a) => a.slug === slug)
}

export function getAreasWithCourseCount(): (Area & { courseCount: number })[] {
  return areas.map((area) => ({
    ...area,
    courseCount: getCoursesByArea(area.id).length,
  }))
}

export function getAllAreaSlugs(): string[] {
  return areas.map((a) => a.slug)
}

import type { Area } from "types/area"
import areasData from "data/areas.json"
import { getCoursesByArea } from "lib/courses"

const areas = areasData as Area[]

export function getAllAreas(): Area[] {
  return areas
}

export function getAreaById(id: number): Area | undefined {
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

export function getAllAreaIds(): number[] {
  return areas.map((a) => a.id)
}

// 周辺エリア: 中心座標の近い順（簡易平面距離）
export function getNearbyAreas(area: Area, limit = 4): Area[] {
  const d = (a: Area) =>
    (a.latitude - area.latitude) ** 2 + (a.longitude - area.longitude) ** 2
  return areas
    .filter((a) => a.id !== area.id)
    .sort((a, b) => d(a) - d(b))
    .slice(0, limit)
}

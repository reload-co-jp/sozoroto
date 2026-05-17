import type { LineString } from "geojson"

export type Difficulty = "very_easy" | "easy" | "normal" | "hard"
export type CourseStatus = "draft" | "published" | "archived"

export type Course = {
  id: string
  slug: string
  title: string
  shortDescription: string
  description: string
  areaId: string
  startPointId: string
  endPointId: string
  distanceMeters: number
  durationMinutes: number
  difficulty: Difficulty
  estimatedSteps?: number
  routeGeoJson: LineString
  routeFetchedAt?: string
  mainImageUrl?: string
  imageUrls: string[]
  recommendedTimeOfDay: string[]
  cautionNotes?: string
  tags: string[]
  status: CourseStatus
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

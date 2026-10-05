import type { LineString } from "geojson"
import type { ImageCredit } from "./spot"

export type Difficulty = "very_easy" | "easy" | "normal" | "hard"
export type CourseStatus = "draft" | "published" | "archived"

export type Course = {
  id: number
  slug: string
  title: string
  shortDescription: string
  description: string
  areaId: number
  startPointId: number
  endPointId: number
  distanceMeters: number
  durationMinutes: number
  difficulty: Difficulty
  estimatedSteps?: number
  routeGeoJson: LineString
  routeFetchedAt?: string
  mainImageUrl?: string
  imageCredit?: ImageCredit
  imageUrls: string[]
  recommendedTimeOfDay: string[]
  cautionNotes?: string
  tags: string[]
  // 未指定時は lib/seo.ts で自動生成
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
  }
  status: CourseStatus
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

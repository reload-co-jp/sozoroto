export const SPOT_CATEGORIES = [
  "神社",
  "寺",
  "歴史",
  "建築",
  "美術館",
  "博物館",
  "庭園",
  "公園",
  "商店街",
  "市場",
  "カフェ",
  "グルメ",
  "川・水辺",
  "橋",
  "街並み",
] as const
export type SpotCategory = (typeof SPOT_CATEGORIES)[number]

// 所属コースは course_spots から引く（lib/spots.ts getCoursesBySpot）
export type Spot = {
  id: number
  slug: string
  name: string
  description?: string
  address?: string
  latitude: number
  longitude: number
  imageUrl?: string
  // CC BY 等の表示義務を満たすための画像出典
  imageCredit?: { author: string; license: string; sourceUrl: string }
  officialUrl?: string
  areaId?: number
  categories: SpotCategory[]
  // tags.json の slug
  tags: string[]
  createdAt: string
  updatedAt: string
}

export type CourseSpot = {
  id: number
  courseId: number
  spotId: number
  order: number
  title?: string
  description?: string
  stayMinutes?: number
}

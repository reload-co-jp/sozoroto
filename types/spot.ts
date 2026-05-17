export type Spot = {
  id: number
  slug: string
  name: string
  description?: string
  address?: string
  latitude: number
  longitude: number
  imageUrl?: string
  officialUrl?: string
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

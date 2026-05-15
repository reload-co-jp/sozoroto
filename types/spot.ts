export type Spot = {
  id: string
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
  id: string
  courseId: string
  spotId: string
  order: number
  title?: string
  description?: string
  stayMinutes?: number
}

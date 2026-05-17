export type Tag = {
  id: number
  slug: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export type CourseTag = {
  courseId: number
  tagId: number
}

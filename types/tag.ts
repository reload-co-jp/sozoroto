export type Tag = {
  id: string
  slug: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export type CourseTag = {
  courseId: string
  tagId: string
}

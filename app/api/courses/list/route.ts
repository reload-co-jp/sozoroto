import { NextResponse } from "next/server"
import { getAllCourses } from "lib/courses"
import { getAreaById } from "lib/areas"

export const dynamic = "force-static"

export function GET() {
  const courses = getAllCourses().map((c) => {
    const area = getAreaById(c.areaId)
    return {
      id: c.id,
      slug: c.slug,
      title: c.title,
      shortDescription: c.shortDescription,
      areaId: c.areaId,
      areaName: area?.name.join("・") ?? null,
      distanceMeters: c.distanceMeters,
      durationMinutes: c.durationMinutes,
      difficulty: c.difficulty,
      mainImageUrl: c.mainImageUrl ?? null,
      tags: c.tags,
    }
  })

  return NextResponse.json(courses)
}

import { NextResponse } from "next/server"
import { getCourseById, getAllCourseIds } from "lib/courses"
import { getAreaById } from "lib/areas"
import { getCourseSpots } from "lib/spots"

export const dynamic = "force-static"

export function generateStaticParams() {
  return getAllCourseIds().map((id) => ({ id: `${id}.json` }))
}

type Props = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Props) {
  const { id } = await params
  const course = getCourseById(Number(id.replace(/\.json$/, "")))
  if (!course) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 })
  }

  const area = getAreaById(course.areaId)
  const spots = getCourseSpots(course.id).map((cs) => ({
    order: cs.order,
    title: cs.title ?? cs.spot.name,
    description: cs.description ?? null,
    stayMinutes: cs.stayMinutes ?? null,
    spot: {
      id: cs.spot.id,
      name: cs.spot.name,
      latitude: cs.spot.latitude,
      longitude: cs.spot.longitude,
      imageUrl: cs.spot.imageUrl ?? null,
    },
  }))

  return NextResponse.json({
    id: course.id,
    slug: course.slug,
    title: course.title,
    shortDescription: course.shortDescription,
    description: course.description,
    areaId: course.areaId,
    areaName: area?.name.join("・") ?? null,
    distanceMeters: course.distanceMeters,
    durationMinutes: course.durationMinutes,
    difficulty: course.difficulty,
    estimatedSteps: course.estimatedSteps ?? null,
    mainImageUrl: course.mainImageUrl ?? null,
    imageUrls: course.imageUrls,
    recommendedTimeOfDay: course.recommendedTimeOfDay,
    cautionNotes: course.cautionNotes ?? null,
    tags: course.tags,
    routeGeoJson: course.routeGeoJson,
    spots,
  })
}

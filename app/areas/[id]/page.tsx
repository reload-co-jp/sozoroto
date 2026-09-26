import { FC } from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import TagList from "components/TagList"
import Breadcrumb from "components/Breadcrumb"
import { CourseGrid, Faq, LinkList, SectionTitle } from "components/SeoSections"
import { getAreaById, getAllAreaIds, getNearbyAreas } from "lib/areas"
import { getCoursesByArea } from "lib/courses"
import { getAllTags } from "lib/tags"
import { areaMetadata } from "lib/seo"
import { colors } from "lib/tokens"

export async function generateStaticParams() {
  return getAllAreaIds().map((id) => ({ id: String(id) }))
}

type Props = { params: Promise<{ id: string }> }

function getAreaData(id: string) {
  const area = getAreaById(Number(id))
  if (!area) return undefined
  const courses = getCoursesByArea(area.id)
  const usedTagSlugs = new Set(courses.flatMap((c) => c.tags))
  const areaTags = getAllTags().filter((t) => usedTagSlugs.has(t.slug))
  return { area, courses, areaTags }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const data = getAreaData(id)
  if (!data) return {}
  return areaMetadata(
    data.area,
    data.courses.length,
    data.areaTags.map((t) => t.name)
  )
}

const AreaDetailPage: FC<Props> = async ({ params }) => {
  const { id } = await params
  const data = getAreaData(id)
  if (!data) notFound()
  const { area, courses, areaTags } = data

  const name = area.name.join("・")
  const nearbyAreas = getNearbyAreas(area)
  const minutes = courses.map((c) => c.durationMinutes)
  const kms = courses.map((c) => Number((c.distanceMeters / 1000).toFixed(1)))
  const range = (xs: number[], unit: string) =>
    Math.min(...xs) === Math.max(...xs)
      ? `約${xs[0]}${unit}`
      : `${Math.min(...xs)}〜${Math.max(...xs)}${unit}`

  const faq =
    courses.length === 0
      ? []
      : [
          {
            q: `${name}の散歩コースはいくつありますか？`,
            a: `現在${courses.length}件です（${courses.map((c) => c.title).join("、")}）。`,
          },
          {
            q: `${name}の散歩は何分くらいかかりますか？`,
            a: `掲載コースの所要時間は${range(minutes, "分")}、距離は${range(kms, "km")}です。`,
          },
          ...(areaTags.length > 0
            ? [
                {
                  q: `${name}ではどんなテーマで歩けますか？`,
                  a: `${areaTags.map((t) => t.name).join("・")}などを楽しめるコースがあります。`,
                },
              ]
            : []),
        ]

  return (
    <div style={{ maxWidth: 1024, margin: "0 auto", padding: "40px 24px" }}>
      <Breadcrumb
        items={[
          { name: "エリア一覧", path: "/areas" },
          { name, path: `/areas/${area.id}` },
        ]}
      />

      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: colors.gray900 }}>
          {name}の散歩コース
        </h1>
        <p style={{ marginTop: 16, color: colors.gray600, lineHeight: 1.7 }}>
          {area.description}
        </p>
        {courses.length > 0 && (
          <p style={{ marginTop: 8, color: colors.gray600, lineHeight: 1.7 }}>
            {name}の散歩コースは{courses.length}件。所要時間
            {range(minutes, "分")}・距離{range(kms, "km")}で歩けます。
          </p>
        )}
        {areaTags.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <TagList tags={areaTags} />
          </div>
        )}
      </div>

      <SectionTitle>
        {name}のおすすめ散歩コース（{courses.length}件）
      </SectionTitle>
      {courses.length === 0 ? (
        <p style={{ color: colors.gray500 }}>現在コースを準備中です。</p>
      ) : (
        <CourseGrid courses={courses} />
      )}

      {nearbyAreas.length > 0 && (
        <section style={{ marginTop: 48 }}>
          <SectionTitle>{name}の周辺エリア</SectionTitle>
          <LinkList
            links={nearbyAreas.map((a) => ({
              href: `/areas/${a.id}`,
              label: a.name.join("・"),
            }))}
          />
        </section>
      )}

      <Faq items={faq} />
    </div>
  )
}

export default AreaDetailPage

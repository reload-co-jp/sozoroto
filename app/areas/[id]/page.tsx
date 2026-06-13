import { FC } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import CourseCard from "components/CourseCard"
import TagList from "components/TagList"
import { getAreaById, getAllAreaIds } from "lib/areas"
import { getCoursesByArea } from "lib/courses"
import { getAllTags } from "lib/tags"
import { areaMetadata, breadcrumbJsonLd } from "lib/seo"
import { colors } from "lib/tokens"

export async function generateStaticParams() {
  return getAllAreaIds().map((id) => ({ id: String(id) }))
}

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const area = getAreaById(Number(id))
  if (!area) return {}
  return areaMetadata(area)
}

const AreaDetailPage: FC<Props> = async ({ params }) => {
  const { id } = await params
  const area = getAreaById(Number(id))
  if (!area) notFound()

  const courses = getCoursesByArea(area.id)
  const allTags = getAllTags()
  const usedTagSlugs = [...new Set(courses.flatMap((c) => c.tags))]
  const areaTags = allTags.filter((t) => usedTagSlugs.includes(t.slug))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "そぞろっと", url: "https://sozoroto.reload.co.jp" },
              { name: "エリア一覧", url: "https://sozoroto.reload.co.jp/areas" },
              { name: area.name.join("・"), url: `https://sozoroto.reload.co.jp/areas/${area.id}` },
            ])
          ),
        }}
      />

      <div style={{ maxWidth: 1024, margin: "0 auto", padding: "40px 24px" }}>
        <nav
          style={{
            display: "flex",
            gap: 8,
            fontSize: 14,
            color: colors.gray400,
            marginBottom: 24,
          }}
        >
          <Link href="/">ホーム</Link>
          <span>/</span>
          <Link href="/areas">エリア一覧</Link>
          <span>/</span>
          <span style={{ color: colors.gray600 }}>{area.name.join("・")}</span>
        </nav>

        <div style={{ marginBottom: 40 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: colors.gray900,
            }}
          >
            {area.name.join("・")}
          </h1>
          <p
            style={{
              marginTop: 16,
              color: colors.gray600,
              lineHeight: 1.7,
            }}
          >
            {area.description}
          </p>
          {areaTags.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <TagList tags={areaTags} />
            </div>
          )}
        </div>

        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: colors.gray900,
            marginBottom: 24,
          }}
        >
          {area.name.join("・")}の散歩コース（{courses.length}件）
        </h2>
        {courses.length === 0 ? (
          <p style={{ color: colors.gray500 }}>現在コースを準備中です。</p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default AreaDetailPage

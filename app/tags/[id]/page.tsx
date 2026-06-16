import { FC } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import CourseCard from "components/CourseCard"
import { getTagById, getAllTagIds } from "lib/tags"
import { getCoursesByTag } from "lib/courses"
import { tagMetadata, breadcrumbJsonLd } from "lib/seo"
import { colors } from "lib/tokens"

export async function generateStaticParams() {
  return getAllTagIds().map((id) => ({ id: String(id) }))
}

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const tag = getTagById(Number(id))
  if (!tag) return {}
  return tagMetadata(tag)
}

const TagPage: FC<Props> = async ({ params }) => {
  const { id } = await params
  const tag = getTagById(Number(id))
  if (!tag) notFound()

  const courses = getCoursesByTag(tag.slug)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "そぞろっと！", url: "https://sozoroto.reload.co.jp" },
              { name: tag.name, url: `https://sozoroto.reload.co.jp/tags/${tag.id}` },
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
          <span style={{ color: colors.gray600 }}>{tag.name}</span>
        </nav>

        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: colors.gray900,
            }}
          >
            「{tag.name}」の散歩コース
          </h1>
          {tag.description && (
            <p style={{ marginTop: 8, color: colors.gray600 }}>
              {tag.description}
            </p>
          )}
        </div>

        {courses.length === 0 ? (
          <p style={{ color: colors.gray500 }}>該当するコースがありません。</p>
        ) : (
          <>
            <p style={{ marginBottom: 24, fontSize: 13, color: colors.gray500 }}>
              {courses.length}件
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default TagPage

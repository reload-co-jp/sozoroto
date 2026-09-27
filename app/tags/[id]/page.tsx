import { FC } from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ListLanding } from "components/SeoSections"
import { getTagById, getAllTagIds, getTagsWithCourseCount } from "lib/tags"
import { getCoursesByTag } from "lib/courses"
import { getSpotPagesByTag } from "lib/spots"
import { tagMetadata, MIN_INDEXABLE_COURSES } from "lib/seo"

export async function generateStaticParams() {
  return getAllTagIds().map((id) => ({ id: String(id) }))
}

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const tag = getTagById(Number(id))
  if (!tag) return {}
  return tagMetadata(tag, getCoursesByTag(tag.slug).length)
}

const TagPage: FC<Props> = async ({ params }) => {
  const { id } = await params
  const tag = getTagById(Number(id))
  if (!tag) notFound()

  const courses = getCoursesByTag(tag.slug)
  const otherTags = getTagsWithCourseCount().filter(
    (t) => t.id !== tag.id && t.courseCount >= MIN_INDEXABLE_COURSES
  )

  return (
    <ListLanding
      breadcrumb={[
        { name: `${tag.name}の散歩コース`, path: `/tags/${tag.id}` },
      ]}
      heading={`東京の${tag.name}散歩コース`}
      lead={
        tag.description ??
        `${tag.name}をテーマに歩ける東京近辺の散歩コースを集めました。`
      }
      courses={courses}
      spotLinksTitle={`${tag.name}を楽しめるスポット`}
      spotLinks={getSpotPagesByTag(tag.slug).map((s) => ({
        href: `/spots/${s.slug}`,
        label: s.name,
      }))}
      otherLinksTitle="ほかのテーマから探す"
      otherLinks={otherTags.map((t) => ({
        href: `/tags/${t.id}`,
        label: `${t.name}（${t.courseCount}）`,
      }))}
    />
  )
}

export default TagPage

import { FC } from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ListLanding } from "components/SeoSections"
import {
  DURATION_BANDS,
  getCoursesByDuration,
  getDurationPageBands,
} from "lib/courses"
import { listMetadata } from "lib/seo"

export const dynamicParams = false

export async function generateStaticParams() {
  return getDurationPageBands().map((m) => ({ minutes: String(m) }))
}

type Props = { params: Promise<{ minutes: string }> }

const label = (m: number) => (m % 60 === 0 ? `${m / 60}時間` : `${m}分`)
const lowerOf = (m: number) =>
  DURATION_BANDS[
    DURATION_BANDS.indexOf(m as (typeof DURATION_BANDS)[number]) - 1
  ] ?? 0

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = Number((await params).minutes)
  const courses = getCoursesByDuration(m)
  return listMetadata(
    `/duration/${m}`,
    `東京の${label(m)}散歩コース｜${m}分で歩ける街歩き`,
    `所要時間${lowerOf(m) + 1}〜${m}分で歩ける東京近辺の散歩コース${courses.length}件。${courses
      .slice(0, 3)
      .map((c) => c.title)
      .join("、")}など。`
  )
}

const DurationPage: FC<Props> = async ({ params }) => {
  const m = Number((await params).minutes)
  if (!getDurationPageBands().includes(m)) notFound()
  const courses = getCoursesByDuration(m)

  return (
    <ListLanding
      breadcrumb={[
        { name: "コース一覧", path: "/courses" },
        { name: `${label(m)}の散歩コース`, path: `/duration/${m}` },
      ]}
      heading={`${label(m)}で歩ける散歩コース`}
      lead={`所要時間が${lowerOf(m) + 1}〜${m}分の散歩コースです。空いた時間に気軽に歩けます。`}
      courses={courses}
      otherLinksTitle="ほかの所要時間から探す"
      otherLinks={getDurationPageBands()
        .filter((b) => b !== m)
        .map((b) => ({
          href: `/duration/${b}`,
          label: `${label(b)}の散歩コース`,
        }))}
    />
  )
}

export default DurationPage

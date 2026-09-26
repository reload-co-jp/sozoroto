import { FC } from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ListLanding } from "components/SeoSections"
import {
  DISTANCE_BANDS_KM,
  getCoursesByDistance,
  getDistancePageBands,
} from "lib/courses"
import { listMetadata } from "lib/seo"

export const dynamicParams = false

export async function generateStaticParams() {
  return getDistancePageBands().map((k) => ({ km: `${k}km` }))
}

type Props = { params: Promise<{ km: string }> }

const lowerOf = (k: number) =>
  DISTANCE_BANDS_KM[
    DISTANCE_BANDS_KM.indexOf(k as (typeof DISTANCE_BANDS_KM)[number]) - 1
  ] ?? 0

const rangeText = (k: number) =>
  lowerOf(k) === 0 ? `${k}km以内` : `${lowerOf(k)}km超〜${k}km`

const parse = async (params: Props["params"]) =>
  Number((await params).km.replace(/km$/, ""))

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const k = await parse(params)
  const courses = getCoursesByDistance(k)
  return listMetadata(
    `/distance/${k}km`,
    `東京の${k}km散歩コース｜約${k}kmで歩ける街歩き`,
    `距離${rangeText(k)}で歩ける東京近辺の散歩コース${courses.length}件。${courses
      .slice(0, 3)
      .map((c) => c.title)
      .join("、")}など。`
  )
}

const DistancePage: FC<Props> = async ({ params }) => {
  const k = await parse(params)
  if (!getDistancePageBands().includes(k)) notFound()
  const courses = getCoursesByDistance(k)

  return (
    <ListLanding
      breadcrumb={[
        { name: "コース一覧", path: "/courses" },
        { name: `${k}kmの散歩コース`, path: `/distance/${k}km` },
      ]}
      heading={`約${k}kmで歩ける散歩コース`}
      lead={`距離が${rangeText(k)}の散歩コースです。`}
      courses={courses}
      otherLinksTitle="ほかの距離から探す"
      otherLinks={getDistancePageBands()
        .filter((b) => b !== k)
        .map((b) => ({
          href: `/distance/${b}km`,
          label: `${b}kmの散歩コース`,
        }))}
    />
  )
}

export default DistancePage

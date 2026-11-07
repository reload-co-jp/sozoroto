import { FC } from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ListLanding } from "components/SeoSections"
import {
  getStationBySlug,
  getStationPages,
  getStationSpotPages,
} from "lib/stations"
import { listMetadata } from "lib/seo"

export const dynamicParams = false

export async function generateStaticParams() {
  return getStationPages().map((s) => ({ slug: s.slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const station = getStationBySlug((await params).slug)
  if (!station) return {}
  const { name, courses, spots } = station
  return listMetadata(
    `/stations/${station.slug}`,
    `${name}駅から歩ける散歩コース${courses.length}選｜駅周辺の街歩き`,
    `${name}駅周辺を歩く散歩コース${courses.length}件。${spots
      .slice(0, 3)
      .map((s) => s.name)
      .join("・")}など、駅から歩いて行けるスポットを巡ります。${courses
      .slice(0, 2)
      .map((c) => c.title)
      .join("、")}など。`
  )
}

const StationPage: FC<Props> = async ({ params }) => {
  const station = getStationBySlug((await params).slug)
  if (!station) notFound()
  const { name, courses, lines } = station
  const spotPages = getStationSpotPages(station)
  const shortest = courses.reduce((a, b) =>
    a.durationMinutes <= b.durationMinutes ? a : b
  )

  return (
    <ListLanding
      breadcrumb={[
        { name: "駅から探す", path: "/stations" },
        { name: `${name}駅の散歩コース`, path: `/stations/${station.slug}` },
      ]}
      heading={`${name}駅から歩ける散歩コース`}
      lead={`${name}駅${lines.length > 0 ? `（${lines.join("・")}）` : ""}の周辺を歩く散歩コースです。駅近くのスポットを経由するコースを、駅の近くから歩き始めるものから順に並べています。`}
      courses={courses}
      spotLinksTitle={`${name}駅近くのスポット`}
      spotLinks={spotPages.map((s) => ({
        href: `/spots/${s.slug}`,
        label: s.name,
      }))}
      otherLinksTitle="ほかの駅から探す"
      otherLinks={getStationPages()
        .filter((s) => s.slug !== station.slug)
        .map((s) => ({
          href: `/stations/${s.slug}`,
          label: `${s.name}駅`,
        }))}
      faq={[
        {
          q: `${name}駅から歩ける散歩コースはいくつありますか？`,
          a: `${courses.length}件あります。`,
        },
        {
          q: `${name}駅周辺でいちばん短いコースは？`,
          a: `「${shortest.title}」で、所要時間は約${shortest.durationMinutes}分、距離は約${Number((shortest.distanceMeters / 1000).toFixed(1))}kmです。`,
        },
        ...(spotPages.length > 0
          ? [
              {
                q: `${name}駅の近くにはどんなスポットがありますか？`,
                a: `${spotPages
                  .slice(0, 5)
                  .map((s) => s.name)
                  .join("、")}などがあります。`,
              },
            ]
          : []),
      ]}
    />
  )
}

export default StationPage

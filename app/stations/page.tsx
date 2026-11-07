import { FC } from "react"
import type { Metadata } from "next"
import Breadcrumb from "components/Breadcrumb"
import { LinkList } from "components/SeoSections"
import { getStationPages } from "lib/stations"
import { listMetadata } from "lib/seo"
import { colors } from "lib/tokens"

export const metadata: Metadata = listMetadata(
  "/stations",
  "駅から探す散歩コース｜東京の駅周辺を歩く街歩き",
  "秋葉原・上野・浅草・御茶ノ水など、東京の駅から歩ける散歩コースを駅ごとに探せます。"
)

const StationsPage: FC = () => {
  const stations = getStationPages()
  return (
    <div style={{ maxWidth: 1024, margin: "0 auto", padding: "40px 24px" }}>
      <Breadcrumb items={[{ name: "駅から探す", path: "/stations" }]} />
      <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.gray900 }}>
        駅から探す
      </h1>
      <p
        style={{
          marginTop: 8,
          marginBottom: 32,
          color: colors.gray600,
          lineHeight: 1.7,
        }}
      >
        最寄り駅から歩ける散歩コースを探せます。
      </p>
      <LinkList
        links={stations.map((s) => ({
          href: `/stations/${s.slug}`,
          label: `${s.name}駅（${s.courses.length}コース）`,
        }))}
      />
    </div>
  )
}

export default StationsPage

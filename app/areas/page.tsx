import { FC } from "react"
import type { Metadata } from "next"
import AreaCard from "components/AreaCard"
import { getAreasWithCourseCount } from "lib/areas"
import { colors } from "lib/tokens"

export const metadata: Metadata = {
  title: "エリア一覧",
  description:
    "東京近辺の散歩エリア一覧。秋葉原・谷中・清澄白河など、街ごとの散歩コースを探す。",
  alternates: { canonical: "https://sozoroto.jp/areas" },
}

const AreasPage: FC = () => {
  const areas = getAreasWithCourseCount()

  return (
    <div
      style={{
        maxWidth: 1024,
        margin: "0 auto",
        padding: "40px 24px",
      }}
    >
      <h1
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: colors.gray900,
          marginBottom: 8,
        }}
      >
        エリア一覧
      </h1>
      <p
        style={{
          color: colors.gray600,
          marginBottom: 40,
        }}
      >
        東京近辺の散歩エリアを探す。
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        {areas.map((area) => (
          <AreaCard key={area.id} area={area} />
        ))}
      </div>
    </div>
  )
}

export default AreasPage

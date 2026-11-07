import { FC } from "react"
import type { Metadata } from "next"
import CoursesPageClient from "components/CoursesPageClient"
import { getAllCourses } from "lib/courses"
import { getAllAreas } from "lib/areas"
import { getAllTags } from "lib/tags"
import { breadcrumbJsonLd, listMetadata } from "lib/seo"
import { colors } from "lib/tokens"

export const metadata: Metadata = listMetadata(
  "/courses",
  `東京の散歩コース一覧（全${getAllCourses().length}コース）｜エリア・時間・テーマで探す`,
  `東京近辺の散歩コース${getAllCourses().length}件の一覧。エリア・所要時間・距離・テーマで絞り込んで、今日歩きたい道を探せます。`
)

const CoursesPage: FC = () => {
  const courses = getAllCourses()
  const areas = getAllAreas()
  const tags = getAllTags()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "そぞろっと！", path: "/" },
              {
                name: "コース一覧",
                path: "/courses",
              },
            ])
          ),
        }}
      />
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
            marginBottom: 32,
          }}
        >
          東京の散歩コース一覧
        </h1>
        <CoursesPageClient courses={courses} areas={areas} tags={tags} />
      </div>
    </>
  )
}

export default CoursesPage

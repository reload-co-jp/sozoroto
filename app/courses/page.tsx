import { FC } from "react"
import type { Metadata } from "next"
import CoursesPageClient from "components/CoursesPageClient"
import { getAllCourses } from "lib/courses"
import { getAllAreas } from "lib/areas"
import { getAllTags } from "lib/tags"
import { colors } from "lib/tokens"

export const metadata: Metadata = {
  title: "コース一覧",
  description:
    "東京近辺の散歩コース一覧。エリア・所要時間・テーマで絞り込みできます。",
  alternates: { canonical: "https://sozoroto.reload.co.jp/courses" },
}

const CoursesPage: FC = () => {
  const courses = getAllCourses()
  const areas = getAllAreas()
  const tags = getAllTags()

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
          marginBottom: 32,
        }}
      >
        コース一覧
      </h1>
      <CoursesPageClient courses={courses} areas={areas} tags={tags} />
    </div>
  )
}

export default CoursesPage

import { FC } from "react"
import Link from "next/link"
import CourseCard from "components/CourseCard"
import AreaCard from "components/AreaCard"
import TagList from "components/TagList"
import { getAllCourses } from "lib/courses"
import { getAreasWithCourseCount } from "lib/areas"
import { getTagsWithCourseCount } from "lib/tags"
import { colors, radius } from "lib/tokens"

const Page: FC = () => {
  const courses = getAllCourses().slice(0, 6)
  const areas = getAreasWithCourseCount().filter((a) => a.courseCount > 0)
  const tags = getTagsWithCourseCount()

  return (
    <>
      <section
        style={{
          background: colors.surface2,
          padding: "96px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: colors.gray900,
              lineHeight: 1.4,
            }}
          >
            なんとなく、きままな冒険を。
          </h1>
          <p
            style={{
              marginTop: 16,
              color: colors.gray600,
              lineHeight: 1.7,
            }}
          >
            東京近辺の散歩コースを、そぞろっと！探す。
          </p>
          <Link
            href="/courses"
            style={{
              display: "inline-block",
              marginTop: 32,
              background: colors.primary,
              color: colors.white,
              borderRadius: radius.full,
              padding: "12px 32px",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            コースを探す
          </Link>
        </div>
      </section>

      <div
        style={{
          maxWidth: 1024,
          margin: "0 auto",
          padding: "64px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 80,
        }}
      >
        <section>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 32,
            }}
          >
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: colors.gray900,
              }}
            >
              おすすめコース
            </h2>
            <Link
              href="/courses"
              style={{ fontSize: 14, color: colors.primary }}
            >
              すべて見る →
            </Link>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
            }}
          >
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>

        <section>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 32,
            }}
          >
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: colors.gray900,
              }}
            >
              エリアから探す
            </h2>
            <Link href="/areas" style={{ fontSize: 14, color: colors.primary }}>
              すべて見る →
            </Link>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
            }}
          >
            {areas.slice(0, 6).map((area) => (
              <AreaCard key={area.id} area={area} />
            ))}
          </div>
        </section>

        <section>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: colors.gray900,
              marginBottom: 32,
            }}
          >
            テーマから探す
          </h2>
          <TagList tags={tags} />
        </section>
      </div>
    </>
  )
}

export default Page

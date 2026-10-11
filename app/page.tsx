import { FC, ReactNode } from "react"
import Link from "next/link"
import CourseCard from "components/CourseCard"
import AreaCard from "components/AreaCard"
import TagList from "components/TagList"
import { getAllCourses, getCourseById } from "lib/courses"
import { getAreasWithCourseCount } from "lib/areas"
import { getTagsWithCourseCount } from "lib/tags"
import type { Course } from "types/course"
import { colors, font, radius } from "lib/tokens"

// ファーストビューの写真（神保町の古書店街・神田川・清澄白河）
const HERO_COURSE_IDS = [7, 9, 6]

const THEME_GROUPS = [
  {
    label: "街の空気",
    slugs: [
      "roji",
      "retro",
      "shimamachi",
      "sakamichi",
      "shotengai",
      "denkigai",
      "kenchiku",
    ],
  },
  {
    label: "食と店",
    slugs: [
      "kissaten",
      "cafe",
      "gourmet",
      "shinise",
      "honya",
      "furuhon",
      "zakka",
    ],
  },
  {
    label: "歴史と文化",
    slugs: ["rekishi", "shiseki", "jinja", "tera", "museum", "art"],
  },
  {
    label: "水辺と緑",
    slugs: ["kawazoi", "hashi", "park", "teien", "shizen", "neko"],
  },
]

const SectionHeader: FC<{
  eyebrow: string
  title: string
  href?: string
  linkLabel?: string
}> = ({ eyebrow, title, href, linkLabel = "すべて見る" }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      gap: 16,
      marginBottom: 32,
      paddingBottom: 16,
      borderBottom: `1px solid ${colors.gray300}`,
    }}
  >
    <div>
      <p
        style={{
          fontSize: 11,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: colors.primary,
        }}
      >
        {eyebrow}
      </p>
      <h2
        style={{
          marginTop: 4,
          fontFamily: font.serif,
          fontSize: 26,
          fontWeight: 700,
          color: colors.gray900,
        }}
      >
        {title}
      </h2>
    </div>
    {href && (
      <Link
        href={href}
        style={{ flexShrink: 0, fontSize: 14, color: colors.primary }}
      >
        {linkLabel} →
      </Link>
    )}
  </div>
)

const Section: FC<{ children: ReactNode }> = ({ children }) => (
  <section className="container" style={{ marginTop: 112 }}>
    {children}
  </section>
)

const Page: FC = () => {
  const courses = getAllCourses().slice(0, 6)
  const areas = getAreasWithCourseCount().filter((a) => a.courseCount > 0)
  const tags = getTagsWithCourseCount()
  const [heroMain, ...heroSubs] = HERO_COURSE_IDS.map(getCourseById).filter(
    (c): c is Course => !!c?.mainImageUrl
  )
  const grouped = new Set(THEME_GROUPS.flatMap((g) => g.slugs))
  const themeGroups = [
    ...THEME_GROUPS.map((g) => ({
      label: g.label,
      tags: g.slugs.flatMap((s) => tags.filter((t) => t.slug === s)),
    })),
    { label: "その他", tags: tags.filter((t) => !grouped.has(t.slug)) },
  ].filter((g) => g.tags.length > 0)

  return (
    <div style={{ paddingBottom: 112 }}>
      <section className="container" style={{ paddingTop: 48 }}>
        <div className="hero">
          <div>
            <p
              style={{
                fontSize: 12,
                letterSpacing: "0.2em",
                color: colors.primary,
              }}
            >
              東京近辺の散歩コースガイド
            </p>
            <h1
              style={{
                marginTop: 20,
                fontFamily: font.serif,
                fontSize: "clamp(34px, 4.6vw, 54px)",
                fontWeight: 700,
                lineHeight: 1.35,
                letterSpacing: "0.04em",
                color: colors.gray900,
              }}
            >
              <span style={{ whiteSpace: "nowrap" }}>なんとなく、</span>
              <br />
              <span style={{ whiteSpace: "nowrap" }}>きままな冒険を。</span>
            </h1>
            <p
              style={{
                marginTop: 24,
                maxWidth: 380,
                fontSize: 15,
                lineHeight: 1.9,
                color: colors.gray600,
              }}
            >
              路地裏の喫茶店、川沿いの遊歩道、古書店の並ぶ通り。
              <br />
              東京近辺の散歩コースを、そぞろっと！探す。
            </p>
            <div
              style={{
                marginTop: 36,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "16px 28px",
              }}
            >
              <Link
                href="/courses"
                style={{
                  display: "inline-block",
                  background: colors.primary,
                  color: colors.white,
                  borderRadius: radius.md,
                  padding: "14px 32px",
                  fontSize: 15,
                  fontWeight: 500,
                }}
              >
                散歩コースを探す
              </Link>
              <Link
                href="/areas"
                style={{
                  fontSize: 14,
                  color: colors.gray700,
                  borderBottom: `1px solid ${colors.gray400}`,
                  paddingBottom: 2,
                }}
              >
                エリアから探す
              </Link>
            </div>
          </div>

          {heroMain && (
            <div>
              <Link
                href={`/courses/${heroMain.id}`}
                style={{ display: "block" }}
              >
                <img
                  src={heroMain.mainImageUrl}
                  alt={heroMain.title}
                  style={{
                    width: "100%",
                    aspectRatio: "4/3",
                    objectFit: "cover",
                    borderRadius: radius.md,
                  }}
                />
              </Link>
              <div
                style={{
                  marginTop: 12,
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 12,
                }}
              >
                {heroSubs.map((c) => (
                  <Link key={c.id} href={`/courses/${c.id}`}>
                    <img
                      src={c.mainImageUrl}
                      alt={c.title}
                      style={{
                        width: "100%",
                        aspectRatio: "3/2",
                        objectFit: "cover",
                        borderRadius: radius.md,
                      }}
                    />
                  </Link>
                ))}
              </div>
              <p style={{ marginTop: 10, fontSize: 12, color: colors.gray500 }}>
                写真：
                {[heroMain, ...heroSubs].map((c) => c.title).join(" / ")}
              </p>
            </div>
          )}
        </div>
      </section>

      <Section>
        <SectionHeader
          eyebrow="Recommended"
          title="おすすめコース"
          href="/courses"
        />
        <div className="grid-cards">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Areas" title="エリアから探す" href="/areas" />
        <div className="grid-cards">
          {areas.slice(0, 6).map((area) => (
            <AreaCard key={area.id} area={area} />
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Themes"
          title="テーマから探す"
          href="/courses"
          linkLabel="条件で絞り込む"
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(min(100%, 420px), 1fr))",
            gap: "28px 48px",
          }}
        >
          {themeGroups.map((g) => (
            <div key={g.label}>
              <h3
                style={{
                  marginBottom: 12,
                  fontFamily: font.serif,
                  fontSize: 16,
                  fontWeight: 700,
                  color: colors.gray700,
                }}
              >
                {g.label}
              </h3>
              <TagList tags={g.tags} />
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

export default Page

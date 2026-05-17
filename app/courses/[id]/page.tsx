import { FC } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import DifficultyBadge from "components/DifficultyBadge"
import TagList from "components/TagList"
import CourseMapWrapper from "components/CourseMapWrapper"
import { getCourseById, getAllCourseIds, getAllCourses } from "lib/courses"
import { getAreaById } from "lib/areas"
import { getAllTags } from "lib/tags"
import { getCourseSpots } from "lib/spots"
import { courseMetadata, courseJsonLd, breadcrumbJsonLd } from "lib/seo"
import { colors, radius, shadow } from "lib/tokens"
import SpotListItem from "components/SpotListItem"

export async function generateStaticParams() {
  return getAllCourseIds().map((id) => ({ id: String(id) }))
}

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const course = getCourseById(Number(id))
  if (!course) return {}
  return courseMetadata(course)
}

const CourseDetailPage: FC<Props> = async ({ params }) => {
  const { id } = await params
  const course = getCourseById(Number(id))
  if (!course) notFound()

  const area = getAreaById(course.areaId)
  const allTags = getAllTags()
  const courseTags = allTags.filter((t) => course.tags.includes(t.slug))
  const courseSpots = getCourseSpots(course.id)
  const lastOrder = courseSpots.length

  const mapSpots = courseSpots.map((cs, i) => ({
    id: cs.spot.id,
    name: cs.spot.name,
    latitude: cs.spot.latitude,
    longitude: cs.spot.longitude,
    imageUrl: cs.spot.imageUrl,
    type:
      i === 0
        ? ("start" as const)
        : i === courseSpots.length - 1
          ? ("end" as const)
          : ("waypoint" as const),
  }))

  const relatedCourses = getAllCourses()
    .filter((c) => c.id !== course.id && c.areaId === course.areaId)
    .slice(0, 3)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd(course)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "そぞろっと", url: "https://sozoroto.jp" },
              { name: "コース一覧", url: "https://sozoroto.jp/courses" },
              { name: course.title, url: `https://sozoroto.jp/courses/${course.id}` },
            ])
          ),
        }}
      />

      <div style={{ maxWidth: 896, margin: "0 auto", padding: "40px 24px" }}>
        <nav
          style={{
            display: "flex",
            gap: 8,
            fontSize: 14,
            color: colors.gray400,
            marginBottom: 24,
          }}
        >
          <Link href="/">ホーム</Link>
          <span>/</span>
          <Link href="/courses">コース一覧</Link>
          <span>/</span>
          <span style={{ color: colors.gray600 }}>{course.title}</span>
        </nav>

        <div
          style={{
            overflow: "hidden",
            borderRadius: radius.xl,
            background: colors.white,
            boxShadow: shadow.sm,
          }}
        >
          <div
            style={{
              aspectRatio: "16/7",
              width: "100%",
              background: colors.gray100,
            }}
          >
            {course.mainImageUrl ? (
              <img
                src={course.mainImageUrl}
                alt={course.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: colors.gray300,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={64}
                  height={64}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>

          <div style={{ padding: "32px 32px 40px" }}>
            {area && (
              <Link
                href={`/areas/${area.id}`}
                style={{ fontSize: 14, color: colors.primary }}
              >
                {area.name}
              </Link>
            )}
            <h1
              style={{
                marginTop: 4,
                fontSize: 28,
                fontWeight: 700,
                color: colors.gray900,
                lineHeight: 1.4,
              }}
            >
              {course.title}
            </h1>
            <p
              style={{
                marginTop: 12,
                color: colors.gray600,
                lineHeight: 1.7,
              }}
            >
              {course.shortDescription}
            </p>

            <div
              style={{
                marginTop: 32,
                display: "flex",
                flexWrap: "wrap",
                gap: 24,
                borderRadius: radius.lg,
                background: colors.surface2,
                padding: "20px 24px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 11, color: colors.gray500 }}>所要時間</p>
                <p style={{ fontWeight: 700, color: colors.gray900 }}>
                  {course.durationMinutes}分
                </p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 11, color: colors.gray500 }}>距離</p>
                <p style={{ fontWeight: 700, color: colors.gray900 }}>
                  {(course.distanceMeters / 1000).toFixed(1)}km
                </p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 11, color: colors.gray500 }}>難易度</p>
                <DifficultyBadge difficulty={course.difficulty} />
              </div>
              {course.estimatedSteps && (
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 11, color: colors.gray500 }}>想定歩数</p>
                  <p style={{ fontWeight: 700, color: colors.gray900 }}>
                    {course.estimatedSteps.toLocaleString()}歩
                  </p>
                </div>
              )}
            </div>

            <div
              style={{
                marginTop: 40,
                display: "flex",
                flexWrap: "wrap",
                gap: 40,
                alignItems: "flex-start",
              }}
            >
              <div style={{ flex: "1 1 320px" }}>
                <h2
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: colors.gray900,
                    marginBottom: 12,
                  }}
                >
                  コース説明
                </h2>
                <p style={{ color: colors.gray700, lineHeight: 1.8 }}>
                  {course.description}
                </p>

                {courseSpots.length > 0 && (
                  <div style={{ marginTop: 32 }}>
                    <h2
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: colors.gray900,
                        marginBottom: 16,
                      }}
                    >
                      ルート
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {courseSpots.map((cs, i) => {
                        const isFirst = i === 0
                        const isLast = i === lastOrder - 1
                        const dotColor = isFirst
                          ? "#22c55e"
                          : isLast
                            ? "#ef4444"
                            : colors.primary
                        return (
                          <div key={cs.id}>
                            <div
                              style={{
                                display: "flex",
                                gap: 16,
                                alignItems: "flex-start",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  flexShrink: 0,
                                }}
                              >
                                <div
                                  style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: "50%",
                                    background: dotColor,
                                    color: colors.white,
                                    fontSize: 12,
                                    fontWeight: 700,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  {cs.order}
                                </div>
                              </div>
                              <div
                                style={{
                                  paddingBottom: isLast ? 0 : 24,
                                  flex: 1,
                                }}
                              >
                                <SpotListItem spotId={cs.spot.id}>
                                  <p
                                    style={{
                                      fontWeight: 700,
                                      fontSize: 14,
                                      color: colors.primary,
                                      lineHeight: 1.4,
                                      textDecoration: "underline",
                                      textDecorationStyle: "dotted",
                                      textUnderlineOffset: 3,
                                    }}
                                  >
                                    {cs.title ?? cs.spot.name}
                                  </p>
                                </SpotListItem>
                                {cs.description && (
                                  <p
                                    style={{
                                      marginTop: 4,
                                      fontSize: 13,
                                      color: colors.gray600,
                                      lineHeight: 1.6,
                                    }}
                                  >
                                    {cs.description}
                                  </p>
                                )}
                                {cs.stayMinutes && (
                                  <p
                                    style={{
                                      marginTop: 4,
                                      fontSize: 12,
                                      color: colors.primary,
                                    }}
                                  >
                                    滞在目安 {cs.stayMinutes}分
                                  </p>
                                )}
                                {cs.spot.imageUrl && (
                                  <div
                                    style={{
                                      marginTop: 8,
                                      borderRadius: radius.md,
                                      overflow: "hidden",
                                      aspectRatio: "16/9",
                                    }}
                                  >
                                    <img
                                      src={cs.spot.imageUrl}
                                      alt={cs.title ?? cs.spot.name}
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                            {!isLast && (
                              <div
                                style={{
                                  marginLeft: 13,
                                  borderLeft: `2px dashed ${colors.gray200}`,
                                  height: 8,
                                }}
                              />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {course.recommendedTimeOfDay.length > 0 && (
                  <div style={{ marginTop: 24 }}>
                    <h2
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: colors.gray900,
                        marginBottom: 10,
                      }}
                    >
                      おすすめ時間帯
                    </h2>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {course.recommendedTimeOfDay.map((t) => (
                        <span
                          key={t}
                          style={{
                            borderRadius: radius.full,
                            background: colors.surface2,
                            padding: "4px 14px",
                            fontSize: 14,
                            color: colors.gray700,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {course.cautionNotes && (
                  <div
                    style={{
                      marginTop: 24,
                      borderRadius: radius.lg,
                      border: `1px solid #fde68a`,
                      background: "#fefce8",
                      padding: "16px 20px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#92400e",
                        marginBottom: 4,
                      }}
                    >
                      注意点
                    </p>
                    <p style={{ fontSize: 13, color: "#a16207" }}>
                      {course.cautionNotes}
                    </p>
                  </div>
                )}

                {courseTags.length > 0 && (
                  <div style={{ marginTop: 24 }}>
                    <h2
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: colors.gray900,
                        marginBottom: 12,
                      }}
                    >
                      タグ
                    </h2>
                    <TagList tags={courseTags} />
                  </div>
                )}
              </div>

              <div style={{ flex: "0 1 320px", minWidth: 260 }}>
                <h2
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: colors.gray900,
                    marginBottom: 12,
                  }}
                >
                  地図
                </h2>
                <CourseMapWrapper
                  route={course.routeGeoJson}
                  spots={mapSpots}
                  height="320px"
                />
              </div>
            </div>
          </div>
        </div>

        {relatedCourses.length > 0 && (
          <section style={{ marginTop: 64 }}>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: colors.gray900,
                marginBottom: 24,
              }}
            >
              同じエリアのコース
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
              {relatedCourses.map((c) => (
                <Link
                  key={c.id}
                  href={`/courses/${c.id}`}
                  style={{
                    flex: "1 1 200px",
                    borderRadius: radius.lg,
                    background: colors.white,
                    padding: "16px 20px",
                    boxShadow: shadow.sm,
                  }}
                >
                  <p
                    style={{
                      fontWeight: 700,
                      color: colors.gray900,
                      fontSize: 15,
                    }}
                  >
                    {c.title}
                  </p>
                  <p
                    style={{
                      marginTop: 4,
                      fontSize: 13,
                      color: colors.gray600,
                      lineHeight: 1.6,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {c.shortDescription}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}

export default CourseDetailPage

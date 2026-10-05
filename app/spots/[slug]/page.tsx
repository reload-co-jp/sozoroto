import { FC } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import TagList from "components/TagList"
import Breadcrumb from "components/Breadcrumb"
import ImageCredit from "components/ImageCredit"
import { CourseGrid, LinkList, SectionTitle } from "components/SeoSections"
import {
  getSpotBySlug,
  getSpotPages,
  hasSpotPage,
  getCoursesBySpot,
  getSpotHighlights,
  getNearbySpots,
} from "lib/spots"
import { getAreaById } from "lib/areas"
import { getAllTags } from "lib/tags"
import { spotMetadata, spotJsonLd } from "lib/seo"
import { colors, radius } from "lib/tokens"

export async function generateStaticParams() {
  return getSpotPages().map((s) => ({ slug: s.slug }))
}

type Props = { params: Promise<{ slug: string }> }

function getSpot(slug: string) {
  const spot = getSpotBySlug(decodeURIComponent(slug))
  return spot && hasSpotPage(spot) ? spot : undefined
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const spot = getSpot((await params).slug)
  if (!spot) return {}
  return spotMetadata(
    spot,
    spot.areaId !== undefined ? getAreaById(spot.areaId) : undefined
  )
}

const SpotDetailPage: FC<Props> = async ({ params }) => {
  const spot = getSpot((await params).slug)
  if (!spot) notFound()

  const area =
    spot.areaId !== undefined ? getAreaById(spot.areaId) : undefined
  const areaName = area?.name.join("・")
  const courses = getCoursesBySpot(spot.id)
  const highlights = getSpotHighlights(spot.id)
  const nearbySpots = getNearbySpots(spot)
  const spotTags = getAllTags().filter((t) => spot.tags.includes(t.slug))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(spotJsonLd(spot)) }}
      />
      <div style={{ maxWidth: 896, margin: "0 auto", padding: "40px 24px" }}>
        <Breadcrumb
          items={[
            area
              ? { name: areaName!, path: `/areas/${area.id}` }
              : { name: "コース一覧", path: "/courses" },
            { name: spot.name, path: `/spots/${spot.slug}` },
          ]}
        />

        {area && (
          <Link
            href={`/areas/${area.id}`}
            style={{ fontSize: 14, color: colors.primary }}
          >
            {areaName}
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
          {spot.name}
        </h1>
        {spot.categories.length > 0 && (
          <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
            {spot.categories.map((c) => (
              <span
                key={c}
                style={{
                  borderRadius: radius.full,
                  background: colors.surface2,
                  padding: "2px 12px",
                  fontSize: 13,
                  color: colors.gray700,
                }}
              >
                {c}
              </span>
            ))}
          </div>
        )}

        {spot.imageUrl && (
          <div
            style={{
              marginTop: 24,
              borderRadius: radius.xl,
              overflow: "hidden",
              aspectRatio: "16/7",
              background: colors.gray100,
            }}
          >
            <img
              src={spot.imageUrl}
              alt={spot.name}
              fetchPriority="high"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}
        <ImageCredit credit={spot.imageCredit} style={{ marginTop: 6 }} />

        <section style={{ marginTop: 32 }}>
          <SectionTitle>概要</SectionTitle>
          <p style={{ color: colors.gray700, lineHeight: 1.8 }}>
            {spot.description}
          </p>
          <dl
            style={{
              marginTop: 16,
              fontSize: 14,
              color: colors.gray600,
              lineHeight: 1.8,
            }}
          >
            {spot.address && (
              <div>
                <dt style={{ display: "inline", fontWeight: 700 }}>所在地：</dt>
                <dd style={{ display: "inline" }}>{spot.address}</dd>
              </div>
            )}
            {spot.officialUrl && (
              <div>
                <dt style={{ display: "inline", fontWeight: 700 }}>公式サイト：</dt>
                <dd style={{ display: "inline" }}>
                  <a
                    href={spot.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: colors.primary, wordBreak: "break-all" }}
                  >
                    {spot.officialUrl}
                  </a>
                </dd>
              </div>
            )}
          </dl>
          <p style={{ marginTop: 8, fontSize: 12, color: colors.gray500 }}>
            営業時間・料金・休館日は公式サイト等で最新情報をご確認ください。
          </p>
        </section>

        {highlights.length > 0 && (
          <section style={{ marginTop: 40 }}>
            <SectionTitle>見どころ</SectionTitle>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {highlights.map(({ course, description }) => (
                <li
                  key={course.id}
                  style={{
                    borderTop: `1px solid ${colors.gray200}`,
                    padding: "12px 0",
                  }}
                >
                  <p style={{ color: colors.gray700, lineHeight: 1.7 }}>
                    {description}
                  </p>
                  <Link
                    href={`/courses/${course.id}`}
                    style={{ fontSize: 13, color: colors.primary }}
                  >
                    {course.title}より
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section style={{ marginTop: 40 }}>
          <SectionTitle>
            {spot.name}を含む散歩コース（{courses.length}件）
          </SectionTitle>
          <CourseGrid courses={courses} />
        </section>

        {nearbySpots.length > 0 && (
          <section style={{ marginTop: 48 }}>
            <SectionTitle>{spot.name}の周辺スポット</SectionTitle>
            <LinkList
              links={nearbySpots.map((s) => ({
                href: `/spots/${s.slug}`,
                label: s.name,
              }))}
            />
          </section>
        )}

        {(area || spotTags.length > 0) && (
          <section style={{ marginTop: 48 }}>
            <SectionTitle>エリア・テーマから探す</SectionTitle>
            {area && (
              <LinkList
                links={[
                  {
                    href: `/areas/${area.id}`,
                    label: `${areaName}の散歩コース`,
                  },
                ]}
              />
            )}
            {spotTags.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <TagList tags={spotTags} />
              </div>
            )}
          </section>
        )}
      </div>
    </>
  )
}

export default SpotDetailPage

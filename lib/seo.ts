import type { Metadata } from "next"
import type { Course } from "types/course"
import type { Area } from "types/area"
import type { Tag } from "types/tag"
import type { Spot } from "types/spot"

const SITE_NAME = "そぞろっと"
const SITE_DESCRIPTION = "東京近辺の散歩コースを、そぞろっと探す。"
export const BASE_URL = "https://sozoroto.reload.co.jp"

// 検索結果で1〜2件しかない一覧ページは薄いのでnoindex・sitemap除外
export const MIN_INDEXABLE_COURSES = 3

// trailingSlash: true に合わせた正規URL
export function pageUrl(path: string): string {
  return `${BASE_URL}${path.endsWith("/") ? path : `${path}/`}`
}

const km = (m: number) => `${Number((m / 1000).toFixed(1))}km`

export function rootMetadata(): Metadata {
  return {
    metadataBase: new URL(BASE_URL),
    title: {
      template: `%s | ${SITE_NAME}`,
      default: `${SITE_NAME} — なんとなく、きままな冒険を。`,
    },
    description: SITE_DESCRIPTION,
    openGraph: {
      siteName: SITE_NAME,
      locale: "ja_JP",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: pageUrl("/"),
    },
  }
}

export function courseMetadata(course: Course, area?: Area): Metadata {
  const title = `${course.seo?.title ?? `${course.title}｜${course.durationMinutes}分・${km(course.distanceMeters)}の散歩コース`} | ${SITE_NAME}`
  const description =
    course.seo?.description ??
    `${area ? `${area.name.join("・")}エリアの` : ""}${course.durationMinutes}分・${km(course.distanceMeters)}の散歩コース。${course.shortDescription}`
  return {
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: pageUrl(`/courses/${course.id}`),
      publishedTime: course.publishedAt,
      modifiedTime: course.updatedAt,
      images: course.mainImageUrl ? [{ url: course.mainImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: course.mainImageUrl ? [course.mainImageUrl] : undefined,
    },
    keywords: course.seo?.keywords,
    alternates: {
      canonical: pageUrl(`/courses/${course.id}`),
    },
  }
}

export function areaMetadata(
  area: Area,
  courseCount: number,
  tagNames: string[]
): Metadata {
  const name = area.name.join("・")
  const title = `${name}の散歩コース${tagNames.length > 0 ? `｜${tagNames.slice(0, 3).join("・")}を巡る街歩き` : ""} | ${SITE_NAME}`
  const description = `${name}エリアの散歩コース${courseCount}件。${area.description}`
  return {
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: pageUrl(`/areas/${area.id}`),
      images: area.mainImageUrl ? [{ url: area.mainImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: area.mainImageUrl ? [area.mainImageUrl] : undefined,
    },
    alternates: { canonical: pageUrl(`/areas/${area.id}`) },
    ...(courseCount === 0 && { robots: { index: false, follow: true } }),
  }
}

export function tagMetadata(tag: Tag, courseCount: number): Metadata {
  const title = `東京の${tag.name}散歩コース｜${tag.name}を巡りながら歩く街歩き | ${SITE_NAME}`
  const description = `${tag.name}をテーマにした東京近辺の散歩コース${courseCount}件。${tag.description ?? ""}`
  return {
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: pageUrl(`/tags/${tag.id}`),
    },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: pageUrl(`/tags/${tag.id}`) },
    ...(courseCount < MIN_INDEXABLE_COURSES && {
      robots: { index: false, follow: true },
    }),
  }
}

// 所要時間・距離別などの一覧ページ用
export function listMetadata(
  path: string,
  title: string,
  description: string
): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`
  return {
    title: { absolute: fullTitle },
    description,
    openGraph: {
      title: fullTitle,
      description,
      type: "website",
      url: pageUrl(path),
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
    alternates: { canonical: pageUrl(path) },
  }
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: pageUrl("/"),
    inLanguage: "ja",
  }
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "株式会社Reload",
    url: "https://reload.co.jp",
  }
}

export function courseJsonLd(course: Course, spots: Spot[] = []) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: course.title,
    description: course.shortDescription,
    url: pageUrl(`/courses/${course.id}`),
    ...(course.mainImageUrl && {
      image: `${BASE_URL}${course.mainImageUrl}`,
    }),
    ...(spots.length > 0 && {
      itinerary: {
        "@type": "ItemList",
        itemListElement: spots.map((spot, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "TouristAttraction",
            name: spot.name,
            ...(spot.address && { address: spot.address }),
            geo: {
              "@type": "GeoCoordinates",
              latitude: spot.latitude,
              longitude: spot.longitude,
            },
          },
        })),
      },
    }),
  }
}

// path は "/areas/1" のようなサイト内パス
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: pageUrl(item.path),
    })),
  }
}

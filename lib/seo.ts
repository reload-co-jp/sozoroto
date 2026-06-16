import type { Metadata } from "next"
import type { Course } from "types/course"
import type { Area } from "types/area"
import type { Tag } from "types/tag"

const SITE_NAME = "そぞろっと"
const SITE_DESCRIPTION = "東京近辺の散歩コースを、そぞろっと探す。"
const BASE_URL = "https://sozoroto.reload.co.jp"

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
      url: BASE_URL,
    },
    twitter: {
      card: "summary_large_image",
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: BASE_URL,
    },
  }
}

export function courseMetadata(course: Course): Metadata {
  const title = `${course.title} | ${SITE_NAME}`
  const description = course.shortDescription
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `${BASE_URL}/courses/${course.id}`,
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
    alternates: {
      canonical: `${BASE_URL}/courses/${course.id}`,
    },
  }
}

export function areaMetadata(area: Area): Metadata {
  const title = `${area.name.join("・")}の散歩コース | ${SITE_NAME}`
  const description = `${area.name.join("・")}エリアの散歩コース一覧。${area.description}`
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${BASE_URL}/areas/${area.id}`,
      images: area.mainImageUrl ? [{ url: area.mainImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: area.mainImageUrl ? [area.mainImageUrl] : undefined,
    },
    alternates: { canonical: `${BASE_URL}/areas/${area.id}` },
  }
}

export function tagMetadata(tag: Tag): Metadata {
  const title = `${tag.name}の散歩コース | ${SITE_NAME}`
  const description =
    tag.description ?? `${tag.name}をテーマにした東京近辺の散歩コース一覧。`
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${BASE_URL}/tags/${tag.id}`,
    },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `${BASE_URL}/tags/${tag.id}` },
  }
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: BASE_URL,
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

export function courseJsonLd(course: Course) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: course.title,
    description: course.shortDescription,
    url: `${BASE_URL}/courses/${course.id}`,
    ...(course.mainImageUrl && {
      image: `${BASE_URL}${course.mainImageUrl}`,
    }),
  }
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

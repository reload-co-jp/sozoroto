import type { Metadata } from "next"
import type { Course } from "types/course"
import type { Area } from "types/area"
import type { Tag } from "types/tag"

const SITE_NAME = "そぞろっと"
const SITE_DESCRIPTION = "東京近辺の散歩コースを、そぞろっと探す。"
const BASE_URL = "https://sozoroto.jp"

export function rootMetadata(): Metadata {
  return {
    title: {
      template: `%s | ${SITE_NAME}`,
      default: `${SITE_NAME} — なんとなく歩きたい日に。`,
    },
    description: SITE_DESCRIPTION,
    openGraph: {
      siteName: SITE_NAME,
      locale: "ja_JP",
      type: "website",
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
      publishedTime: course.publishedAt,
      modifiedTime: course.updatedAt,
    },
    alternates: {
      canonical: `${BASE_URL}/courses/${course.slug}`,
    },
  }
}

export function areaMetadata(area: Area): Metadata {
  const title = `${area.name}の散歩コース | ${SITE_NAME}`
  const description = `${area.name}エリアの散歩コース一覧。${area.description}`
  return {
    title,
    description,
    openGraph: { title, description },
    alternates: { canonical: `${BASE_URL}/areas/${area.slug}` },
  }
}

export function tagMetadata(tag: Tag): Metadata {
  const title = `${tag.name}の散歩コース | ${SITE_NAME}`
  const description =
    tag.description ?? `${tag.name}をテーマにした東京近辺の散歩コース一覧。`
  return {
    title,
    description,
    openGraph: { title, description },
    alternates: { canonical: `${BASE_URL}/tags/${tag.slug}` },
  }
}

export function courseJsonLd(course: Course) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: course.title,
    description: course.shortDescription,
    datePublished: course.publishedAt,
    dateModified: course.updatedAt,
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

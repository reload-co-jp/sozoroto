import { FC, ReactNode } from "react"
import Link from "next/link"
import type { Course } from "types/course"
import CourseCard from "components/CourseCard"
import Breadcrumb from "components/Breadcrumb"
import { colors, radius } from "lib/tokens"

export const SectionTitle: FC<{ children: ReactNode }> = ({ children }) => (
  <h2
    style={{
      fontSize: 18,
      fontWeight: 700,
      color: colors.gray900,
      marginBottom: 16,
    }}
  >
    {children}
  </h2>
)

export const LinkList: FC<{ links: { href: string; label: string }[] }> = ({
  links,
}) => (
  <ul
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
      listStyle: "none",
      padding: 0,
    }}
  >
    {links.map((l) => (
      <li key={l.href}>
        <Link
          href={l.href}
          style={{
            display: "inline-block",
            borderRadius: radius.full,
            background: colors.surface2,
            padding: "6px 14px",
            fontSize: 14,
            color: colors.gray700,
          }}
        >
          {l.label}
        </Link>
      </li>
    ))}
  </ul>
)

// 実データから答えられる質問だけ渡すこと。FAQPage構造化データは
// Googleのリッチリザルト対象外（政府・医療系のみ）のため出さない
export const Faq: FC<{ items: { q: string; a: string }[] }> = ({ items }) =>
  items.length === 0 ? null : (
    <section style={{ marginTop: 48 }}>
      <SectionTitle>よくある質問</SectionTitle>
      <dl>
        {items.map(({ q, a }) => (
          <div
            key={q}
            style={{
              borderTop: `1px solid ${colors.gray200}`,
              padding: "14px 0",
            }}
          >
            <dt style={{ fontWeight: 700, color: colors.gray900 }}>Q. {q}</dt>
            <dd
              style={{ marginTop: 6, color: colors.gray700, lineHeight: 1.7 }}
            >
              {a}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )

export const CourseGrid: FC<{ courses: Course[] }> = ({ courses }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
    {courses.map((course) => (
      <CourseCard key={course.id} course={course} />
    ))}
  </div>
)

type ListLandingProps = {
  breadcrumb: { name: string; path: string }[]
  heading: string
  lead: string
  courses: Course[]
  otherLinksTitle: string
  otherLinks: { href: string; label: string }[]
}

// テーマ・所要時間・距離別の一覧ランディングページ共通レイアウト
export const ListLanding: FC<ListLandingProps> = ({
  breadcrumb,
  heading,
  lead,
  courses,
  otherLinksTitle,
  otherLinks,
}) => (
  <div style={{ maxWidth: 1024, margin: "0 auto", padding: "40px 24px" }}>
    <Breadcrumb items={breadcrumb} />
    <div style={{ marginBottom: 32 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.gray900 }}>
        {heading}
      </h1>
      <p style={{ marginTop: 8, color: colors.gray600, lineHeight: 1.7 }}>
        {lead}
      </p>
    </div>
    {courses.length === 0 ? (
      <p style={{ color: colors.gray500 }}>該当するコースがありません。</p>
    ) : (
      <>
        <p style={{ marginBottom: 24, fontSize: 13, color: colors.gray500 }}>
          {courses.length}件
        </p>
        <CourseGrid courses={courses} />
      </>
    )}
    {otherLinks.length > 0 && (
      <section style={{ marginTop: 48 }}>
        <SectionTitle>{otherLinksTitle}</SectionTitle>
        <LinkList links={otherLinks} />
      </section>
    )}
  </div>
)

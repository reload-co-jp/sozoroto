import { FC, Fragment } from "react"
import Link from "next/link"
import { breadcrumbJsonLd } from "lib/seo"
import { colors } from "lib/tokens"

type Props = { items: { name: string; path: string }[] }

// 表示用パンくずとBreadcrumbList JSON-LDを同じデータから出す。先頭の「ホーム」は自動付与
const Breadcrumb: FC<Props> = ({ items }) => {
  const all = [{ name: "ホーム", path: "/" }, ...items]
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(all)),
        }}
      />
      <nav
        aria-label="パンくずリスト"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          fontSize: 14,
          color: colors.gray400,
          marginBottom: 24,
        }}
      >
        {all.map((item, i) =>
          i === all.length - 1 ? (
            <span key={item.path} style={{ color: colors.gray600 }}>
              {item.name}
            </span>
          ) : (
            <Fragment key={item.path}>
              <Link href={item.path}>{item.name}</Link>
              <span>/</span>
            </Fragment>
          )
        )}
      </nav>
    </>
  )
}

export default Breadcrumb

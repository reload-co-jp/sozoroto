import { notFound } from "next/navigation"
import Link from "next/link"
import { resourceSchemas } from "app/admin/_lib/schema"
import { colors, font } from "lib/tokens"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV !== "development") {
    notFound()
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.surface,
        color: colors.gray900,
        fontFamily: font.family,
      }}
    >
      <nav
        style={{
          display: "flex",
          gap: 4,
          alignItems: "center",
          padding: "0 24px",
          background: colors.primaryDark,
        }}
      >
        <Link
          href="/admin"
          style={{
            color: colors.white,
            fontWeight: "bold",
            padding: "16px 12px",
            textDecoration: "none",
          }}
        >
          管理TOP
        </Link>
        {resourceSchemas.map((s) => (
          <Link
            key={s.resource}
            href={`/admin/${s.resource}`}
            style={{
              color: colors.surface,
              padding: "16px 12px",
              textDecoration: "none",
            }}
          >
            {s.label}
          </Link>
        ))}
      </nav>
      <div style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>{children}</div>
    </div>
  )
}

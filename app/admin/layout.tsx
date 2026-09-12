import { notFound } from "next/navigation"
import Link from "next/link"
import { resourceSchemas } from "app/admin/_lib/schema"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV !== "development") {
    notFound()
  }

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <nav style={{ marginBottom: 24, display: "flex", gap: 16 }}>
        <Link href="/admin">管理TOP</Link>
        {resourceSchemas.map((s) => (
          <Link key={s.resource} href={`/admin/${s.resource}`}>
            {s.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  )
}

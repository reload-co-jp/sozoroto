import fs from "fs"
import path from "path"
import Link from "next/link"
import { notFound } from "next/navigation"
import { resourceSchemas } from "app/admin/_lib/schema"

function countRecords(resource: string): number {
  const file = path.join(process.cwd(), "data", `${resource}.json`)
  const raw = fs.readFileSync(file, "utf-8")
  return (JSON.parse(raw) as unknown[]).length
}

export default function AdminDashboardPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound()
  }

  return (
    <div>
      <h1>管理画面（dev限定）</h1>
      <p>文言修正・スポット編集用の内部ツール。本番ビルドには含まれない。</p>
      <ul>
        {resourceSchemas.map((s) => (
          <li key={s.resource}>
            <Link href={`/admin/${s.resource}`}>{s.label}</Link>
            （{countRecords(s.resource)}件）
          </li>
        ))}
      </ul>
    </div>
  )
}

import fs from "fs"
import path from "path"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getSchema, ResourceName } from "app/admin/_lib/schema"

function readRecords(resource: string): Record<string, unknown>[] {
  const file = path.join(process.cwd(), "data", `${resource}.json`)
  return JSON.parse(fs.readFileSync(file, "utf-8"))
}

function formatTitle(value: unknown): string {
  if (Array.isArray(value)) return value.join("・")
  return String(value ?? "")
}

export default function ResourceListView({ resource }: { resource: ResourceName }) {
  if (process.env.NODE_ENV !== "development") {
    notFound()
  }

  const schema = getSchema(resource)!
  const records = readRecords(resource)

  return (
    <div>
      <h1>
        {schema.label}一覧（{records.length}件）
      </h1>
      <p>
        <Link href={`/admin/${resource}/new`}>+ 新規作成</Link>
      </p>
      <table
        border={1}
        cellPadding={6}
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>{schema.fields.find((f) => f.key === schema.titleField)?.label}</th>
            <th>slug</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={String(r.id)}>
              <td>{String(r.id)}</td>
              <td>{formatTitle(r[schema.titleField])}</td>
              <td>{String(r.slug ?? "")}</td>
              <td>
                <Link href={`/admin/${resource}/${r.id}`}>編集</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

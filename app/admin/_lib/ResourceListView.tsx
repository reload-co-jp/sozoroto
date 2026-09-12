import fs from "fs"
import path from "path"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getSchema, ResourceName } from "app/admin/_lib/schema"
import { colors, radius } from "lib/tokens"

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
      <h1 style={{ color: colors.gray900 }}>
        {schema.label}一覧（{records.length}件）
      </h1>
      <p>
        <Link
          href={`/admin/${resource}/new`}
          style={{
            display: "inline-block",
            background: colors.primary,
            color: colors.white,
            padding: "8px 16px",
            borderRadius: radius.sm,
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          + 新規作成
        </Link>
      </p>
      <table
        cellPadding={10}
        style={{
          borderCollapse: "collapse",
          width: "100%",
          background: colors.white,
          borderRadius: radius.sm,
          overflow: "hidden",
        }}
      >
        <thead>
          <tr style={{ background: colors.surface2, color: colors.gray700 }}>
            <th style={{ textAlign: "left", borderBottom: `1px solid ${colors.gray300}` }}>ID</th>
            <th style={{ textAlign: "left", borderBottom: `1px solid ${colors.gray300}` }}>
              {schema.fields.find((f) => f.key === schema.titleField)?.label}
            </th>
            <th style={{ textAlign: "left", borderBottom: `1px solid ${colors.gray300}` }}>slug</th>
            <th style={{ borderBottom: `1px solid ${colors.gray300}` }}></th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={String(r.id)} style={{ borderBottom: `1px solid ${colors.gray200}` }}>
              <td style={{ color: colors.gray500 }}>{String(r.id)}</td>
              <td style={{ color: colors.gray900 }}>{formatTitle(r[schema.titleField])}</td>
              <td style={{ color: colors.gray500 }}>{String(r.slug ?? "")}</td>
              <td>
                <Link href={`/admin/${resource}/${r.id}`} style={{ color: colors.primary }}>
                  編集
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

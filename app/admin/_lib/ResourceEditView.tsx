import fs from "fs"
import path from "path"
import { notFound } from "next/navigation"
import { getSchema, ResourceName } from "app/admin/_lib/schema"
import AdminForm from "app/admin/_lib/AdminForm"

export default function ResourceEditView({
  resource,
  id,
}: {
  resource: ResourceName
  id: string
}) {
  if (process.env.NODE_ENV !== "development") {
    notFound()
  }

  const schema = getSchema(resource)!

  let initialValues: Record<string, unknown> | null = null
  if (id !== "new") {
    const file = path.join(process.cwd(), "data", `${resource}.json`)
    const records = JSON.parse(fs.readFileSync(file, "utf-8")) as Record<
      string,
      unknown
    >[]
    const record = records.find((r) => String(r.id) === id)
    if (!record) notFound()
    initialValues = record
  }

  return (
    <div>
      <h1>
        {schema.label}
        {id === "new" ? "新規作成" : `編集（ID:${id}）`}
      </h1>
      <AdminForm
        schema={schema}
        initialValues={initialValues}
        recordId={id === "new" ? null : id}
      />
    </div>
  )
}

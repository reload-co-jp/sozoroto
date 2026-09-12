import { NextResponse } from "next/server"
import { ResourceName, isDevEnv, readResource, writeResource, nextId } from "app/api/admin/_lib/resources"

function notFound() {
  return NextResponse.json({ error: "Not Found" }, { status: 404 })
}

export async function handleList(resource: ResourceName) {
  if (!isDevEnv()) return notFound()
  return NextResponse.json(readResource(resource))
}

export async function handleCreate(resource: ResourceName, req: Request) {
  if (!isDevEnv()) return notFound()

  const body = await req.json()
  if (typeof body.slug !== "string" || body.slug.trim() === "") {
    return NextResponse.json({ error: "slugは必須です" }, { status: 400 })
  }

  const records = readResource(resource)
  if (records.some((r) => r.slug === body.slug)) {
    return NextResponse.json({ error: "同じslugが既に存在します" }, { status: 400 })
  }

  const now = new Date().toISOString()
  const record = {
    ...body,
    id: nextId(records),
    createdAt: now,
    updatedAt: now,
  }
  records.push(record)
  writeResource(resource, records)

  return NextResponse.json(record, { status: 201 })
}

export async function handleUpdate(resource: ResourceName, id: string, req: Request) {
  if (!isDevEnv()) return notFound()

  const targetId = Number(id)
  const body = await req.json()
  const records = readResource(resource)
  const index = records.findIndex((r) => r.id === targetId)
  if (index === -1) return notFound()

  if (
    typeof body.slug === "string" &&
    records.some((r) => r.id !== targetId && r.slug === body.slug)
  ) {
    return NextResponse.json({ error: "同じslugが既に存在します" }, { status: 400 })
  }

  const updated = {
    ...records[index],
    ...body,
    id: targetId,
    updatedAt: new Date().toISOString(),
  }
  records[index] = updated
  writeResource(resource, records)

  return NextResponse.json(updated)
}

export async function handleDelete(resource: ResourceName, id: string) {
  if (!isDevEnv()) return notFound()

  const targetId = Number(id)
  const records = readResource(resource)
  const filtered = records.filter((r) => r.id !== targetId)
  if (filtered.length === records.length) return notFound()

  writeResource(resource, filtered)
  return NextResponse.json({ ok: true })
}

import fs from "fs"
import path from "path"
import { NextResponse } from "next/server"
import { isResourceName, isDevEnv } from "app/api/admin/_lib/resources"

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
}

const MAX_SIZE = 10 * 1024 * 1024 // 10MB

function sanitizeBaseName(name: string): string {
  const base = name.replace(/\.[^.]+$/, "")
  const safe = base.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 60)
  return safe || "image"
}

export async function POST(req: Request) {
  if (!isDevEnv()) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 })
  }

  const formData = await req.formData()
  const resource = formData.get("resource")
  const file = formData.get("file")

  if (typeof resource !== "string" || !isResourceName(resource)) {
    return NextResponse.json({ error: "resourceが不正です" }, { status: 400 })
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "fileは必須です" }, { status: 400 })
  }
  const ext = ALLOWED_TYPES[file.type]
  if (!ext) {
    return NextResponse.json({ error: "対応していない画像形式です（jpeg/png/webp/gif）" }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "ファイルサイズは10MB以下にしてください" }, { status: 400 })
  }

  const dir = path.join(process.cwd(), "public", "images", resource)
  fs.mkdirSync(dir, { recursive: true })

  const filename = `${sanitizeBaseName(file.name)}-${Date.now()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())
  fs.writeFileSync(path.join(dir, filename), buffer)

  return NextResponse.json({ url: `/images/${resource}/${filename}` }, { status: 201 })
}

import { handleList, handleCreate } from "app/api/admin/_lib/handlers"

export function GET() {
  return handleList("courses")
}

export function POST(req: Request) {
  return handleCreate("courses", req)
}

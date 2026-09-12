import { handleList, handleCreate } from "app/api/admin/_lib/handlers"

export function GET() {
  return handleList("tags")
}

export function POST(req: Request) {
  return handleCreate("tags", req)
}

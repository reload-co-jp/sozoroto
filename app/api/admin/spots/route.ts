import { handleList, handleCreate } from "app/api/admin/_lib/handlers"

export function GET() {
  return handleList("spots")
}

export function POST(req: Request) {
  return handleCreate("spots", req)
}

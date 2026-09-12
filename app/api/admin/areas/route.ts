import { handleList, handleCreate } from "app/api/admin/_lib/handlers"

export function GET() {
  return handleList("areas")
}

export function POST(req: Request) {
  return handleCreate("areas", req)
}

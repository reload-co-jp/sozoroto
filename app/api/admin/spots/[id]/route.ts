import { handleUpdate, handleDelete } from "app/api/admin/_lib/handlers"

type Props = { params: Promise<{ id: string }> }

export async function PUT(req: Request, { params }: Props) {
  const { id } = await params
  return handleUpdate("spots", id, req)
}

export async function DELETE(_req: Request, { params }: Props) {
  const { id } = await params
  return handleDelete("spots", id)
}

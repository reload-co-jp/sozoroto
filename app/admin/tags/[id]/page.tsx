import ResourceEditView from "app/admin/_lib/ResourceEditView"

type Props = { params: Promise<{ id: string }> }

export default async function TagEditPage({ params }: Props) {
  const { id } = await params
  return <ResourceEditView resource="tags" id={id} />
}

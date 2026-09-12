import ResourceEditView from "app/admin/_lib/ResourceEditView"

type Props = { params: Promise<{ id: string }> }

export default async function AreaEditPage({ params }: Props) {
  const { id } = await params
  return <ResourceEditView resource="areas" id={id} />
}

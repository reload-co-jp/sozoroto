import ResourceEditView from "app/admin/_lib/ResourceEditView"

type Props = { params: Promise<{ id: string }> }

export default async function SpotEditPage({ params }: Props) {
  const { id } = await params
  return <ResourceEditView resource="spots" id={id} />
}

const GSI_ENDPOINT = "https://msearch.gsi.go.jp/address-search/AddressSearch"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const address = searchParams.get("address")?.trim()

  if (!address) {
    return Response.json({ error: "address は必須です" }, { status: 400 })
  }

  const url = `${GSI_ENDPOINT}?q=${encodeURIComponent(address)}`
  const res = await fetch(url)
  if (!res.ok) {
    return Response.json({ error: "ジオコーディングに失敗しました" }, { status: 502 })
  }

  const features: Array<{ geometry: { coordinates: [number, number] }; properties: { title: string } }> =
    await res.json()

  if (!features || features.length === 0) {
    return Response.json({ error: "住所から座標が見つかりませんでした" }, { status: 404 })
  }

  const [longitude, latitude] = features[0].geometry.coordinates
  return Response.json({ latitude, longitude, title: features[0].properties.title })
}

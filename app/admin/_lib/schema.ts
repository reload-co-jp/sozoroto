export type ResourceName = "spots" | "areas" | "courses" | "tags"

export type FieldType = "text" | "textarea" | "number" | "select" | "list" | "readonly"

export type FieldDef = {
  key: string
  label: string
  type: FieldType
  options?: string[]
  required?: boolean
}

export type ResourceSchema = {
  resource: ResourceName
  label: string
  titleField: string
  fields: FieldDef[]
}

export const resourceSchemas: ResourceSchema[] = [
  {
    resource: "spots",
    label: "スポット",
    titleField: "name",
    fields: [
      { key: "slug", label: "slug", type: "text", required: true },
      { key: "name", label: "名称", type: "text", required: true },
      { key: "description", label: "説明文", type: "textarea" },
      { key: "address", label: "住所", type: "text" },
      { key: "latitude", label: "緯度", type: "number", required: true },
      { key: "longitude", label: "経度", type: "number", required: true },
      { key: "imageUrl", label: "画像URL", type: "text" },
      { key: "officialUrl", label: "公式URL", type: "text" },
    ],
  },
  {
    resource: "areas",
    label: "エリア",
    titleField: "name",
    fields: [
      { key: "slug", label: "slug", type: "text", required: true },
      { key: "name", label: "名称（カンマ区切りで複数可）", type: "list", required: true },
      { key: "description", label: "説明文", type: "textarea", required: true },
      { key: "prefecture", label: "都道府県", type: "text", required: true },
      { key: "city", label: "市区町村", type: "text" },
      { key: "mainImageUrl", label: "メイン画像URL", type: "text" },
      { key: "latitude", label: "緯度", type: "number", required: true },
      { key: "longitude", label: "経度", type: "number", required: true },
    ],
  },
  {
    resource: "tags",
    label: "タグ",
    titleField: "name",
    fields: [
      { key: "slug", label: "slug", type: "text", required: true },
      { key: "name", label: "名称", type: "text", required: true },
      { key: "description", label: "説明文", type: "textarea" },
    ],
  },
  {
    resource: "courses",
    label: "コース",
    titleField: "title",
    fields: [
      { key: "slug", label: "slug", type: "text", required: true },
      { key: "title", label: "タイトル", type: "text", required: true },
      { key: "shortDescription", label: "短い説明", type: "textarea", required: true },
      { key: "description", label: "説明文", type: "textarea", required: true },
      {
        key: "difficulty",
        label: "難易度",
        type: "select",
        options: ["very_easy", "easy", "normal", "hard"],
        required: true,
      },
      {
        key: "status",
        label: "公開状態",
        type: "select",
        options: ["draft", "published", "archived"],
        required: true,
      },
      { key: "cautionNotes", label: "注意事項", type: "textarea" },
      { key: "tags", label: "タグ（カンマ区切り、slug）", type: "list" },
      { key: "recommendedTimeOfDay", label: "おすすめ時間帯（カンマ区切り）", type: "list" },
      { key: "mainImageUrl", label: "メイン画像URL", type: "text" },
      { key: "imageUrls", label: "画像URL一覧（カンマ区切り）", type: "list" },
      { key: "areaId", label: "エリアID（編集不可）", type: "readonly" },
      { key: "startPointId", label: "開始スポットID（編集不可）", type: "readonly" },
      { key: "endPointId", label: "終了スポットID（編集不可）", type: "readonly" },
      { key: "distanceMeters", label: "距離m（編集不可）", type: "readonly" },
      { key: "durationMinutes", label: "所要分（編集不可）", type: "readonly" },
      { key: "estimatedSteps", label: "推定歩数（編集不可）", type: "readonly" },
      { key: "routeGeoJson", label: "ルートGeoJSON（編集不可）", type: "readonly" },
    ],
  },
]

export function getSchema(resource: string): ResourceSchema | undefined {
  return resourceSchemas.find((s) => s.resource === resource)
}

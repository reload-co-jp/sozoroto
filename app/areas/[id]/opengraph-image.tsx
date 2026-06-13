import { ImageResponse } from "next/og"
import { getAreaById, getAllAreaIds } from "lib/areas"
import { getCoursesByArea } from "lib/courses"

const BASE_URL = "https://sozoroto.reload.co.jp"

function toAbsoluteUrl(url: string | undefined): string | undefined {
  if (!url) return undefined
  if (url.startsWith("http")) return url
  return `${BASE_URL}${url}`
}

export const dynamic = "force-static"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export async function generateStaticParams() {
  return getAllAreaIds().map((id) => ({ id: String(id) }))
}

type Props = { params: Promise<{ id: string }> }

export default async function OgImage({ params }: Props) {
  const { id } = await params
  const area = getAreaById(Number(id))

  if (!area) {
    return new ImageResponse(
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#faf9f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 48,
          color: "#111827",
        }}
      >
        そぞろっと！
      </div>,
      { ...size }
    )
  }

  const courses = getCoursesByArea(area.id)

  return new ImageResponse(
    <div
      style={{
        width: 1200,
        height: 630,
        background: "#faf9f6",
        display: "flex",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {toAbsoluteUrl(area.mainImageUrl) && (
        <img
          src={toAbsoluteUrl(area.mainImageUrl)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.15,
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 72px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "#3d7a5f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            そ
          </div>
          <span style={{ fontSize: 20, color: "#4B5563" }}>そぞろっと！</span>
          <span
            style={{
              marginLeft: 8,
              fontSize: 16,
              color: "#3d7a5f",
              background: "#f3f1ec",
              borderRadius: 9999,
              padding: "4px 16px",
            }}
          >
            エリア
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 60,
              fontWeight: 700,
              color: "#111827",
              lineHeight: 1.3,
            }}
          >
            {area.name.join("・")}
          </div>
          <div
            style={{
              fontSize: 24,
              color: "#4B5563",
              lineHeight: 1.5,
              maxWidth: 800,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {area.description}
          </div>
        </div>

        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <div
            style={{
              background: "#ffffff",
              borderRadius: 12,
              padding: "12px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span style={{ fontSize: 12, color: "#6B7280" }}>散歩コース</span>
            <span style={{ fontSize: 22, fontWeight: 700, color: "#3d7a5f" }}>
              {courses.length}件
            </span>
          </div>
          <div
            style={{
              background: "#ffffff",
              borderRadius: 12,
              padding: "12px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span style={{ fontSize: 12, color: "#6B7280" }}>エリア</span>
            <span style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>
              {area.prefecture}
            </span>
          </div>
        </div>
      </div>
    </div>,
    { ...size }
  )
}

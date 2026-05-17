import { ImageResponse } from "next/og"

export const dynamic = "force-static"
export const alt = "そぞろっと — なんとなく歩きたい日に。"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#faf9f6",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: "#3d7a5f",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontSize: 44,
            fontWeight: 700,
          }}
        >
          そ
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#111827",
          }}
        >
          そぞろっと
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#4B5563",
          }}
        >
          なんとなく歩きたい日に。
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 20,
            color: "#6B7280",
          }}
        >
          東京近辺の散歩コースを、そぞろっと探す。
        </div>
      </div>
    ),
    { ...size }
  )
}

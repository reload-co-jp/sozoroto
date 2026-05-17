import { ImageResponse } from "next/og"

export const dynamic = "force-static"
export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "#3d7a5f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        そ
      </div>
    ),
    { ...size }
  )
}

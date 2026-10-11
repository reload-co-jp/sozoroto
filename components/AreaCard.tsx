"use client"

import { FC } from "react"
import Link from "next/link"
import type { Area } from "types/area"
import { getCoursesByArea } from "lib/courses"
import { colors, font, radius, transition } from "lib/tokens"
import { useHover } from "lib/useHover"

type Props = { area: Area & { courseCount: number } }

const AreaCard: FC<Props> = ({ area }) => {
  const { hovered, hoverProps } = useHover()
  // エリア写真が未登録ならそのエリアのコース写真で代替
  const imageUrl =
    area.mainImageUrl ??
    getCoursesByArea(area.id).find((c) => c.mainImageUrl)?.mainImageUrl
  const name = area.name.join("・")

  return (
    <Link
      href={`/areas/${area.id}`}
      {...hoverProps}
      style={{
        display: "flex",
        flexDirection: "column",
        flex: "1 1 260px",
      }}
    >
      <div
        style={{
          aspectRatio: "3/2",
          width: "100%",
          overflow: "hidden",
          borderRadius: radius.md,
          background: colors.gray100,
          flexShrink: 0,
        }}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: hovered ? "scale(1.04)" : "scale(1)",
              transition: transition.transform,
            }}
          />
        )}
      </div>
      <div style={{ paddingTop: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: 12,
            paddingBottom: 8,
            borderBottom: `1px solid ${colors.gray200}`,
          }}
        >
          <h3
            style={{
              fontFamily: font.serif,
              fontWeight: 700,
              fontSize: 20,
              lineHeight: 1.4,
              color: hovered ? colors.primary : colors.gray900,
              transition: transition.default,
            }}
          >
            {name}
          </h3>
          <span
            style={{
              flexShrink: 0,
              fontSize: 12,
              color: colors.primary,
            }}
          >
            {area.courseCount}コース
          </span>
        </div>
        <p
          style={{
            marginTop: 10,
            fontSize: 13,
            color: colors.gray600,
            lineHeight: 1.7,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {area.description}
        </p>
      </div>
    </Link>
  )
}

export default AreaCard

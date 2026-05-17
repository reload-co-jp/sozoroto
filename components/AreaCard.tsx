"use client"

import { FC } from "react"
import Link from "next/link"
import type { Area } from "types/area"
import { colors, radius, shadow, transition } from "lib/tokens"
import { useHover } from "lib/useHover"

type Props = { area: Area & { courseCount: number } }

const AreaCard: FC<Props> = ({ area }) => {
  const { hovered, hoverProps } = useHover()

  return (
    <Link
      href={`/areas/${area.id}`}
      {...hoverProps}
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: radius.xl,
        background: colors.white,
        boxShadow: hovered ? shadow.md : shadow.sm,
        transition: transition.default,
        flex: "1 1 260px",
      }}
    >
      <div
        style={{
          aspectRatio: "16/9",
          width: "100%",
          overflow: "hidden",
          background: colors.gray100,
          flexShrink: 0,
        }}
      >
        {area.mainImageUrl ? (
          <img
            src={area.mainImageUrl}
            alt={area.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: hovered ? "scale(1.05)" : "scale(1)",
              transition: transition.transform,
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: colors.gray300,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={40}
              height={40}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        )}
      </div>
      <div style={{ padding: 20 }}>
        <h3
          style={{
            fontWeight: 700,
            fontSize: 15,
            color: hovered ? colors.primary : colors.gray900,
            transition: transition.default,
          }}
        >
          {area.name}
        </h3>
        <p
          style={{
            marginTop: 8,
            fontSize: 13,
            color: colors.gray600,
            lineHeight: 1.6,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {area.description}
        </p>
        <p style={{ marginTop: 10, fontSize: 12, color: colors.primary }}>
          {area.courseCount}コース
        </p>
      </div>
    </Link>
  )
}

export default AreaCard

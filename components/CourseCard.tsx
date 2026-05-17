"use client"

import { FC } from "react"
import Link from "next/link"
import type { Course } from "types/course"
import { getAreaById } from "lib/areas"
import DifficultyBadge from "components/DifficultyBadge"
import { colors, radius, shadow, transition } from "lib/tokens"
import { useHover } from "lib/useHover"

type Props = { course: Course }

const CourseCard: FC<Props> = ({ course }) => {
  const area = getAreaById(course.areaId)
  const { hovered, hoverProps } = useHover()

  return (
    <Link
      href={`/courses/${course.id}`}
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
          aspectRatio: "4/3",
          width: "100%",
          overflow: "hidden",
          background: colors.gray100,
          flexShrink: 0,
        }}
      >
        {course.mainImageUrl ? (
          <img
            src={course.mainImageUrl}
            alt={course.title}
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
              color: colors.gray400,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={48}
              height={48}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: 20,
        }}
      >
        {area && (
          <span style={{ fontSize: 12, color: colors.primary }}>
            {area.name}
          </span>
        )}
        <h3
          style={{
            fontWeight: 700,
            fontSize: 15,
            color: hovered ? colors.primary : colors.gray900,
            lineHeight: 1.4,
            transition: transition.default,
          }}
        >
          {course.title}
        </h3>
        <p
          style={{
            fontSize: 13,
            color: colors.gray600,
            lineHeight: 1.6,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {course.shortDescription}
        </p>
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 8,
            paddingTop: 8,
          }}
        >
          <DifficultyBadge difficulty={course.difficulty} />
          <span style={{ fontSize: 12, color: colors.gray500 }}>
            {course.durationMinutes}分
          </span>
          <span style={{ fontSize: 12, color: colors.gray500 }}>
            {(course.distanceMeters / 1000).toFixed(1)}km
          </span>
        </div>
        {course.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {course.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                style={{
                  background: colors.surface2,
                  borderRadius: 4,
                  padding: "2px 8px",
                  fontSize: 11,
                  color: colors.gray600,
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

export default CourseCard

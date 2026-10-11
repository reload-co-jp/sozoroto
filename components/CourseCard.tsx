"use client"

import { FC } from "react"
import Link from "next/link"
import type { Course } from "types/course"
import { getAreaById } from "lib/areas"
import DifficultyBadge from "components/DifficultyBadge"
import { colors, font, radius, transition } from "lib/tokens"
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
        {course.mainImageUrl && (
          <img
            src={course.mainImageUrl}
            alt={course.title}
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

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          paddingTop: 16,
        }}
      >
        {area && (
          <span
            style={{
              fontSize: 12,
              color: colors.primary,
              letterSpacing: "0.08em",
            }}
          >
            {area.name.join("・")}
          </span>
        )}
        <h3
          style={{
            marginTop: 6,
            fontFamily: font.serif,
            fontWeight: 700,
            fontSize: 18,
            lineHeight: 1.5,
            color: hovered ? colors.primary : colors.gray900,
            transition: transition.default,
          }}
        >
          {course.title}
        </h3>
        <p
          style={{
            marginTop: 8,
            fontSize: 13,
            color: colors.gray600,
            lineHeight: 1.7,
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
            paddingTop: 14,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "4px 14px",
            fontSize: 12,
            color: colors.gray500,
          }}
        >
          <span>約{course.durationMinutes}分</span>
          <span>{(course.distanceMeters / 1000).toFixed(1)}km</span>
          <DifficultyBadge difficulty={course.difficulty} />
        </div>
      </div>
    </Link>
  )
}

export default CourseCard

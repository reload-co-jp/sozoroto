"use client"

import { FC } from "react"
import Link from "next/link"
import type { Tag } from "types/tag"
import { colors, radius, transition } from "lib/tokens"
import { useHover } from "lib/useHover"

type TagItemProps = { tag: Tag & { courseCount?: number } }

const TagItem: FC<TagItemProps> = ({ tag }) => {
  const { hovered, hoverProps } = useHover()
  return (
    <Link
      href={`/tags/${tag.id}`}
      {...hoverProps}
      style={{
        display: "inline-block",
        border: `1px solid ${colors.primary}`,
        borderRadius: radius.full,
        padding: "6px 14px",
        fontSize: 14,
        color: hovered ? colors.white : colors.primary,
        background: hovered ? colors.primary : "transparent",
        transition: transition.default,
      }}
    >
      {tag.name}
      {tag.courseCount !== undefined && (
        <span style={{ marginLeft: 4, fontSize: 12, opacity: 0.7 }}>
          ({tag.courseCount})
        </span>
      )}
    </Link>
  )
}

type Props = { tags: (Tag & { courseCount?: number })[] }

const TagList: FC<Props> = ({ tags }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
    {tags.map((tag) => (
      <TagItem key={tag.slug} tag={tag} />
    ))}
  </div>
)

export default TagList

import { FC } from "react"
import type { Difficulty } from "types/course"
import { colors } from "lib/tokens"

const labels: Record<Difficulty, string> = {
  very_easy: "とても軽い",
  easy: "軽い",
  normal: "普通",
  hard: "しっかり歩く",
}

// 落ち着いた配色に合わせ、色ではなく濃淡で強度を示す
const badgeColors: Record<Difficulty, { bg: string; text: string }> = {
  very_easy: { bg: colors.surface2, text: colors.gray700 },
  easy: { bg: colors.surface2, text: colors.gray700 },
  normal: { bg: "#e4e7dc", text: colors.primaryDark },
  hard: { bg: "#ece0d2", text: "#7a5232" },
}

type Props = { difficulty: Difficulty }

const DifficultyBadge: FC<Props> = ({ difficulty }) => {
  const { bg, text } = badgeColors[difficulty]
  return (
    <span
      style={{
        display: "inline-block",
        background: bg,
        color: text,
        borderRadius: 2,
        padding: "1px 8px",
        fontSize: 12,
        fontWeight: 500,
        lineHeight: 1.6,
      }}
    >
      {labels[difficulty]}
    </span>
  )
}

export default DifficultyBadge

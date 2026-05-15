import { FC } from "react"
import type { Difficulty } from "types/course"
import { colors } from "lib/tokens"

const labels: Record<Difficulty, string> = {
  very_easy: "とても軽い",
  easy: "軽い",
  normal: "普通",
  hard: "しっかり歩く",
}

const badgeColors: Record<Difficulty, { bg: string; text: string }> = {
  very_easy: { bg: colors.green100, text: colors.green700 },
  easy: { bg: colors.lime100, text: colors.lime700 },
  normal: { bg: "#fef9c3", text: "#854d0e" },
  hard: { bg: colors.orange100, text: colors.orange700 },
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
        borderRadius: 9999,
        padding: "2px 10px",
        fontSize: 12,
        fontWeight: 500,
      }}
    >
      {labels[difficulty]}
    </span>
  )
}

export default DifficultyBadge

"use client"

import { FC, useState, useMemo } from "react"
import CourseCard from "components/CourseCard"
import type { Course, Difficulty } from "types/course"
import type { Area } from "types/area"
import type { Tag } from "types/tag"
import { colors, radius, shadow } from "lib/tokens"

type Props = {
  courses: Course[]
  areas: Area[]
  tags: Tag[]
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: radius.md,
  border: `1px solid ${colors.gray200}`,
  padding: "8px 12px",
  fontSize: 14,
  color: colors.gray700,
  background: colors.white,
  outline: "none",
}

const CoursesPageClient: FC<Props> = ({ courses, areas, tags }) => {
  const [q, setQ] = useState("")
  const [areaId, setAreaId] = useState("")
  const [durationMax, setDurationMax] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [tag, setTag] = useState("")

  const filtered = useMemo(() => {
    let result = courses
    if (q) {
      const lower = q.toLowerCase()
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(lower) ||
          c.shortDescription.toLowerCase().includes(lower)
      )
    }
    if (areaId) result = result.filter((c) => c.areaId === Number(areaId))
    if (durationMax)
      result = result.filter(
        (c) => c.durationMinutes <= parseInt(durationMax)
      )
    if (difficulty)
      result = result.filter((c) => c.difficulty === (difficulty as Difficulty))
    if (tag) result = result.filter((c) => c.tags.includes(tag))
    return result
  }, [courses, q, areaId, durationMax, difficulty, tag])

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 24,
        alignItems: "flex-start",
      }}
    >
      <aside
        style={{
          flex: "0 0 240px",
          minWidth: 200,
        }}
      >
        <div
          style={{
            borderRadius: radius.xl,
            background: colors.white,
            padding: 20,
            boxShadow: shadow.sm,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <input
            type="search"
            placeholder="コース名で検索"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={inputStyle}
          />
          <select
            value={areaId}
            onChange={(e) => setAreaId(e.target.value)}
            style={inputStyle}
          >
            <option value="">すべてのエリア</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name.join("・")}
              </option>
            ))}
          </select>
          <select
            value={durationMax}
            onChange={(e) => setDurationMax(e.target.value)}
            style={inputStyle}
          >
            <option value="">所要時間を選択</option>
            <option value="15">15分以内</option>
            <option value="30">30分以内</option>
            <option value="60">1時間以内</option>
            <option value="120">2時間以内</option>
          </select>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            style={inputStyle}
          >
            <option value="">難易度を選択</option>
            <option value="very_easy">とても軽い</option>
            <option value="easy">軽い</option>
            <option value="normal">普通</option>
            <option value="hard">しっかり歩く</option>
          </select>
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            style={inputStyle}
          >
            <option value="">タグを選択</option>
            {tags.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setQ("")
              setAreaId("")
              setDurationMax("")
              setDifficulty("")
              setTag("")
            }}
            style={{
              ...inputStyle,
              color: colors.gray600,
              textAlign: "center",
            }}
          >
            リセット
          </button>
        </div>
      </aside>

      <div style={{ flex: "1 1 300px" }}>
        <p
          style={{
            marginBottom: 20,
            fontSize: 13,
            color: colors.gray500,
          }}
        >
          {filtered.length}件のコース
        </p>
        {filtered.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: colors.gray500,
              padding: "64px 0",
            }}
          >
            コースが見つかりませんでした。
          </p>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
            }}
          >
            {filtered.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CoursesPageClient

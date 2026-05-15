"use client"

import { FC, useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { Area } from "types/area"
import type { Tag } from "types/tag"

type Props = {
  areas: Area[]
  tags: Tag[]
}

const CourseFilter: FC<Props> = ({ areas, tags }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const [q, setQ] = useState(searchParams.get("q") ?? "")
  const [areaId, setAreaId] = useState(searchParams.get("areaId") ?? "")
  const [durationMax, setDurationMax] = useState(
    searchParams.get("durationMax") ?? ""
  )
  const [difficulty, setDifficulty] = useState(
    searchParams.get("difficulty") ?? ""
  )
  const [tag, setTag] = useState(searchParams.get("tag") ?? "")

  const apply = () => {
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    if (areaId) params.set("areaId", areaId)
    if (durationMax) params.set("durationMax", durationMax)
    if (difficulty) params.set("difficulty", difficulty)
    if (tag) params.set("tag", tag)
    startTransition(() => {
      router.push(`/courses?${params.toString()}`)
    })
  }

  const reset = () => {
    setQ("")
    setAreaId("")
    setDurationMax("")
    setDifficulty("")
    setTag("")
    startTransition(() => {
      router.push("/courses")
    })
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm space-y-3">
      <input
        type="search"
        placeholder="コース名・エリアで検索"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && apply()}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none"
      />

      <select
        value={areaId}
        onChange={(e) => setAreaId(e.target.value)}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-[var(--color-primary)] focus:outline-none"
      >
        <option value="">すべてのエリア</option>
        {areas.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>

      <select
        value={durationMax}
        onChange={(e) => setDurationMax(e.target.value)}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-[var(--color-primary)] focus:outline-none"
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
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-[var(--color-primary)] focus:outline-none"
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
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-[var(--color-primary)] focus:outline-none"
      >
        <option value="">タグを選択</option>
        {tags.map((t) => (
          <option key={t.slug} value={t.slug}>
            {t.name}
          </option>
        ))}
      </select>

      <div className="flex gap-2">
        <button
          onClick={apply}
          className="flex-1 rounded-lg bg-[var(--color-primary)] py-2 text-sm font-medium text-white transition hover:bg-[var(--color-primary-dark)]"
        >
          絞り込む
        </button>
        <button
          onClick={reset}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
        >
          リセット
        </button>
      </div>
    </div>
  )
}

export default CourseFilter

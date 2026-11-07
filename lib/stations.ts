import type { Course } from "types/course"
import type { Spot } from "types/spot"
import { getAllCourses } from "lib/courses"
import { getCourseSpots, getSpotPages } from "lib/spots"
import { MIN_INDEXABLE_COURSES } from "lib/seo"
import spotsData from "data/spots.json"

const spots = spotsData as Spot[]

// 駅名 → URLスラッグ。spots.json の access（「湯島駅（東京メトロ）、…」）から駅名を抽出し、
// ここにスラッグがある駅だけを駅別ページ化する。コースが増えて MIN_INDEXABLE_COURSES 件に
// 達した駅は、ここへ追記するとページが生成される。
const STATION_SLUGS: Record<string, string> = {
  御茶ノ水: "ochanomizu",
  末広町: "suehirocho",
  上野: "ueno",
  秋葉原: "akihabara",
  浅草: "asakusa",
  淡路町: "awajicho",
  田原町: "tawaramachi",
  本所吾妻橋: "honjo-azumabashi",
  千駄木: "sendagi",
  両国: "ryogoku",
  蔵前: "kuramae",
  日暮里: "nippori",
  日本橋: "nihombashi",
  三越前: "mitsukoshimae",
  浜町: "hamacho",
  神田: "kanda",
  岩本町: "iwamotocho",
  根津: "nezu",
  森下: "morishita",
  神保町: "jimbocho",
  九段下: "kudanshita",
  新日本橋: "shin-nihombashi",
  門前仲町: "monzen-nakacho",
  鶯谷: "uguisudani",
  浅草橋: "asakusabashi",
  西日暮里: "nishi-nippori",
  東大前: "todaimae",
  有楽町: "yurakucho",
  銀座: "ginza",
  築地: "tsukiji",
  新富町: "shintomicho",
  人形町: "ningyocho",
  東京: "tokyo",
  月島: "tsukishima",
  新宿: "shinjuku",
  新宿三丁目: "shinjuku-sanchome",
  湯島: "yushima",
  早稲田: "waseda",
  飯田橋: "iidabashi",
  水道橋: "suidobashi",
  本郷三丁目: "hongo-sanchome",
  新橋: "shimbashi",
}

// 乗換で実質同じ駅として扱うもの（同じ内容のページが複数できるのを防ぐ）
const STATION_ALIASES: Record<string, string> = {
  新御茶ノ水: "御茶ノ水",
  京成上野: "上野",
}

export type Station = {
  name: string // 「駅」を含まない駅名
  slug: string
  lines: string[]
  spots: Spot[]
  courses: Course[]
}

function parseAccess(access: string) {
  return access.split("、").flatMap((part) => {
    const m = part.trim().match(/^(.+?)駅(?:（(.+)）)?/)
    if (!m) return []
    const name = STATION_ALIASES[m[1]] ?? m[1]
    return [{ name, lines: m[2]?.split("・") ?? [] }]
  })
}

function buildStations(): Station[] {
  const map = new Map<string, { lines: Set<string>; spots: Spot[] }>()
  for (const spot of spots) {
    for (const { name, lines } of parseAccess(spot.access ?? "")) {
      if (!STATION_SLUGS[name]) continue
      const entry = map.get(name) ?? { lines: new Set(), spots: [] }
      lines.forEach((l) => entry.lines.add(l))
      if (!entry.spots.includes(spot)) entry.spots.push(spot)
      map.set(name, entry)
    }
  }
  const courses = getAllCourses()
  return [...map.entries()]
    .map(([name, { lines, spots: stationSpots }]) => {
      const spotIds = new Set(stationSpots.map((s) => s.id))
      // 駅近くのスポットを経由するコース。出発地点が駅近くのものを先に並べる
      const matched = courses
        .map((course) => {
          const cs = getCourseSpots(course.id)
          const idx = cs.findIndex((c) => spotIds.has(c.spot.id))
          return { course, idx }
        })
        .filter(({ idx }) => idx >= 0)
        .sort((a, b) => a.idx - b.idx)
        .map(({ course }) => course)
      return {
        name,
        slug: STATION_SLUGS[name],
        lines: [...lines],
        spots: stationSpots,
        courses: matched,
      }
    })
    .sort((a, b) => b.courses.length - a.courses.length)
}

let cache: Station[] | undefined
function allStations(): Station[] {
  return (cache ??= buildStations())
}

// 薄いページを作らないため、コースが MIN_INDEXABLE_COURSES 件以上の駅だけページ化する
export function getStationPages(): Station[] {
  return allStations().filter((s) => s.courses.length >= MIN_INDEXABLE_COURSES)
}

export function getStationBySlug(slug: string): Station | undefined {
  return getStationPages().find((s) => s.slug === slug)
}

// スポットの最寄り駅のうちページがあるもの
export function getStationPagesBySpot(spot: Spot): Station[] {
  return getStationPages().filter((s) => s.spots.includes(spot))
}

// コースが経由するスポットの最寄り駅のうちページがあるもの
export function getStationPagesByCourse(course: Course): Station[] {
  return getStationPages().filter((s) => s.courses.includes(course))
}

// 駅ページに載せるスポットページ（説明文があるもの）
export function getStationSpotPages(station: Station): Spot[] {
  const pages = new Set(getSpotPages())
  return station.spots.filter((s) => pages.has(s))
}

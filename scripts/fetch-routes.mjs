import { readFileSync, writeFileSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, "../data")

const apiKey = process.env.OPENROUTESERVICE_API_KEY
if (!apiKey) {
  console.error("OPENROUTESERVICE_API_KEY が未設定")
  process.exit(1)
}

const courses = JSON.parse(readFileSync(join(dataDir, "courses.json"), "utf8"))
const spots = JSON.parse(readFileSync(join(dataDir, "spots.json"), "utf8"))
const courseSpots = JSON.parse(readFileSync(join(dataDir, "course_spots.json"), "utf8"))

const spotMap = Object.fromEntries(spots.map((s) => [s.id, s]))

async function fetchRoute(coordinates) {
  const res = await fetch(
    "https://api.heigit.org/openrouteservice/v2/directions/foot-walking/geojson",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify({ coordinates }),
    }
  )
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`ORS ${res.status}: ${text}`)
  }
  const data = await res.json()
  return data.features[0].geometry
}

let updated = 0
let failed = 0

for (const course of courses) {
  const cs = courseSpots
    .filter((cs) => cs.courseId === course.id)
    .sort((a, b) => a.order - b.order)

  if (course.routeFetchedAt) {
    console.log(`skip ${course.slug}: 取得済み`)
    continue
  }

  if (cs.length < 2) {
    console.log(`skip ${course.slug}: スポット ${cs.length} 件`)
    continue
  }

  const coordinates = cs.map((c) => {
    const spot = spotMap[c.spotId]
    return [spot.longitude, spot.latitude]
  })

  try {
    const geometry = await fetchRoute(coordinates)
    course.routeGeoJson = geometry
    course.routeFetchedAt = new Date().toISOString()
    updated++
    console.log(`✓ ${course.slug}`)
  } catch (err) {
    failed++
    console.error(`✗ ${course.slug}: ${err.message}`)
  }

  // ORS free tier: 40 req/min → 1.5s 間隔
  await new Promise((r) => setTimeout(r, 1500))
}

writeFileSync(join(dataDir, "courses.json"), JSON.stringify(courses, null, 2))
console.log(`\n完了: ${updated} 件更新, ${failed} 件失敗`)

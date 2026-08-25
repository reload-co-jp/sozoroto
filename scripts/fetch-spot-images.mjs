import { readFileSync, createWriteStream, existsSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import { pipeline } from "stream/promises"

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, "../data")
const imgDir = join(__dirname, "../public/images/spots")

const spots = JSON.parse(readFileSync(join(dataDir, "spots.json"), "utf8"))

const SEARCH_QUERIES = {
  "nakamise-dori": "Nakamise shopping street Asakusa Tokyo",
  "azumabashi": "Azuma Bridge Sumida River Tokyo",
  "coredo-muromachi": "Coredo Muromachi Nihonbashi Tokyo",
  "suiten-gu": "Suitengu shrine Tokyo",
  "fukagawa-edo-museum": "Fukagawa Edo Museum Tokyo",
  "yodobashi-camera-akiba": "Yodobashi Camera Akihabara Tokyo",
  "yanagimori-shrine": "Yanagimori shrine Akihabara Tokyo",
  "nikolai-cathedral": "Nikolai Cathedral Tokyo Holy Resurrection",
  "3331-arts-chiyoda": "3331 Arts Chiyoda Tokyo",
  "ueno-tosho-gu": "Ueno Toshogu shrine Tokyo",
  "tokyo-university-of-the-arts": "Tokyo University of Arts Ueno",
  "asakusa-hanayashiki": "Hanayashiki amusement park Asakusa Tokyo",
  "komagata-bridge": "Komagata Bridge Tokyo",
  "bank-of-japan": "Bank of Japan headquarters Tokyo",
  "fukutoku-shrine": "Fukutoku shrine Nihonbashi Tokyo",
  "mannenbashi": "Mannenbashi bridge Fukagawa Tokyo",
  "sendaibori-river-park": "Sendaibori River Park Koto Tokyo",
  "suidobashi-station": "Suidobashi station Tokyo",
  "ochanomizu-bridge": "Ochanomizubashi bridge Kanda river Tokyo",
  "shohei-bridge": "Shoheibashi bridge Tokyo",
  "yanagibashi": "Yanagibashi bridge Kanda river Tokyo",
}

const TARGET_IDS = [28, 29, 30, 31, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 49, 50, 51, 52]

async function searchWikimedia(query) {
  const url = new URL("https://commons.wikimedia.org/w/api.php")
  url.searchParams.set("action", "query")
  url.searchParams.set("list", "search")
  url.searchParams.set("srsearch", `${query} filetype:bitmap`)
  url.searchParams.set("srnamespace", "6")
  url.searchParams.set("srlimit", "15")
  url.searchParams.set("format", "json")
  url.searchParams.set("origin", "*")

  const res = await fetch(url, {
    headers: { "User-Agent": "sozoroto-bot/1.0 (yamamoto@reload.co.jp)" },
  })
  const text = await res.text()
  try {
    const data = JSON.parse(text)
    return data.query?.search ?? []
  } catch {
    throw new Error(`API parse error: ${text.slice(0, 80)}`)
  }
}

async function getImageUrl(title) {
  const url = new URL("https://commons.wikimedia.org/w/api.php")
  url.searchParams.set("action", "query")
  url.searchParams.set("titles", title)
  url.searchParams.set("prop", "imageinfo")
  url.searchParams.set("iiprop", "url|size|mediatype")
  url.searchParams.set("iiurlwidth", "1200")
  url.searchParams.set("format", "json")
  url.searchParams.set("origin", "*")

  const res = await fetch(url, {
    headers: { "User-Agent": "sozoroto-bot/1.0 (yamamoto@reload.co.jp)" },
  })
  const text = await res.text()
  try {
    const data = JSON.parse(text)
    const pages = data.query?.pages ?? {}
    const page = Object.values(pages)[0]
    const info = page?.imageinfo?.[0]
    if (!info) return null
    if (info.mediatype !== "BITMAP") return null
    return info.thumburl || info.url
  } catch {
    return null
  }
}

async function downloadImage(imageUrl, destPath) {
  const res = await fetch(imageUrl, {
    headers: { "User-Agent": "sozoroto-bot/1.0 (yamamoto@reload.co.jp)" },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  await pipeline(res.body, createWriteStream(destPath))
}

let updated = 0
let failed = 0

for (const spot of spots) {
  if (!TARGET_IDS.includes(spot.id)) continue

  const pad = String(spot.id).padStart(2, "0")
  const filename = `spot-${pad}.jpg`
  const destPath = join(imgDir, filename)

  if (existsSync(destPath)) {
    console.log(`skip ${spot.slug}: 既存`)
    continue
  }

  const query = SEARCH_QUERIES[spot.slug] ?? spot.name
  console.log(`search: ${spot.name} (${query})`)

  try {
    const results = await searchWikimedia(query)
    let imageUrl = null

    for (const result of results) {
      const ext = result.title.split(".").pop().toLowerCase()
      if (!["jpg", "jpeg"].includes(ext)) continue
      imageUrl = await getImageUrl(result.title)
      if (imageUrl) break
      await new Promise((r) => setTimeout(r, 500))
    }

    if (!imageUrl) throw new Error("画像見つからず")

    await downloadImage(imageUrl, destPath)
    updated++
    console.log(`✓ ${spot.name} → ${filename}`)
  } catch (err) {
    failed++
    console.error(`✗ ${spot.name}: ${err.message}`)
  }

  await new Promise((r) => setTimeout(r, 2000))
}

console.log(`\n完了: ${updated} 件取得, ${failed} 件失敗`)

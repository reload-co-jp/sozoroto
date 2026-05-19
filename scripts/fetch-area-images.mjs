import { readFileSync, writeFileSync, createWriteStream } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import { pipeline } from "stream/promises"

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, "../data")
const imgDir = join(__dirname, "../public/images/areas")

const areas = JSON.parse(readFileSync(join(dataDir, "areas.json"), "utf8"))

const SEARCH_QUERIES = {
  "akihabara-kanda": "Akihabara Tokyo",
  "ochanomizu-akihabara": "Ochanomizu Tokyo",
  "ueno-yanaka": "Ueno Park Tokyo",
  "asakusa-kuramae": "Senso-ji Asakusa Tokyo",
  "nihonbashi-ningyocho": "Nihonbashi Tokyo",
  "kiyosumi-shirakawa": "Kiyosumi garden Tokyo",
  "jimbocho": "Jimbocho Tokyo",
}

async function searchWikimedia(query) {
  const url = new URL("https://commons.wikimedia.org/w/api.php")
  url.searchParams.set("action", "query")
  url.searchParams.set("list", "search")
  url.searchParams.set("srsearch", `${query} filetype:bitmap`)
  url.searchParams.set("srnamespace", "6")
  url.searchParams.set("srlimit", "10")
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

for (let i = 0; i < areas.length; i++) {
  const area = areas[i]
  const pad = String(i + 1).padStart(2, "0")
  const filename = `area-${pad}.jpg`
  const destPath = join(imgDir, filename)
  const publicPath = `/images/areas/${filename}`

  if (area.mainImageUrl) {
    console.log(`skip ${area.slug}: 取得済み`)
    continue
  }

  const query = SEARCH_QUERIES[area.slug] ?? area.name
  console.log(`search: ${area.name} (${query})`)

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
    area.mainImageUrl = publicPath
    updated++
    console.log(`✓ ${area.slug} → ${publicPath}`)
  } catch (err) {
    failed++
    console.error(`✗ ${area.slug}: ${err.message}`)
  }

  await new Promise((r) => setTimeout(r, 2000))
}

writeFileSync(join(dataDir, "areas.json"), JSON.stringify(areas, null, 2))
console.log(`\n完了: ${updated} 件更新, ${failed} 件失敗`)

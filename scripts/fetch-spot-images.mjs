import { readFileSync, writeFileSync, createWriteStream, existsSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import { pipeline } from "stream/promises"

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, "../data")
const imgDir = join(__dirname, "../public/images/spots")

const spotsPath = join(dataDir, "spots.json")
const spots = JSON.parse(readFileSync(spotsPath, "utf8"))

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
  "ogai-memorial-museum": "Mori Ogai Memorial Museum Bunkyo",
  "kyu-yasuda-kusuo-tei": "YasudaHouse Sendagi",
  "kokyo-gaien": "Kōkyo-Gaien toward central Tokyo",
  "nijubashi": "Nijubashi bridge Imperial Palace Tokyo",
  "umayabashi": "Umaya Bridge Tokyo",
  "ginza-4chome": "Ginza 4-chome intersection Wako",
  "tsukiji-outer-market": "Tsukiji outer market street",
  "akiba-gachapon-kaikan": "Gachapon Kaikan Akihabara",
  "akihabara-udx-tashiro-dori": "Akihabara UDX",
  "akihabara-udx-monitor": "Akihabara UDX building",
  "shimo-goinden-bridge": "Shimogoinden",
}

const HEADERS = { "User-Agent": "sozoroto-bot/1.0 (yamamoto@reload.co.jp)" }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// 商用利用・改変可のライセンスのみ（NC/ND は除外）
const OPENVERSE_LICENSES = ["cc0", "pdm", "by", "by-sa"]

async function searchWikimedia(query) {
  const url = new URL("https://commons.wikimedia.org/w/api.php")
  url.searchParams.set("action", "query")
  url.searchParams.set("list", "search")
  url.searchParams.set("srsearch", `${query} filetype:bitmap`)
  url.searchParams.set("srnamespace", "6")
  url.searchParams.set("srlimit", "15")
  url.searchParams.set("format", "json")
  url.searchParams.set("origin", "*")

  const res = await fetch(url, { headers: HEADERS })
  const text = await res.text()
  try {
    const data = JSON.parse(text)
    return data.query?.search ?? []
  } catch {
    throw new Error(`API parse error: ${text.slice(0, 80)}`)
  }
}

export async function getWikimediaImage(title) {
  const url = new URL("https://commons.wikimedia.org/w/api.php")
  url.searchParams.set("action", "query")
  url.searchParams.set("titles", title)
  url.searchParams.set("prop", "imageinfo")
  url.searchParams.set("iiprop", "url|size|mediatype|extmetadata")
  url.searchParams.set("iiextmetadatafilter", "Artist|LicenseShortName")
  url.searchParams.set("iiurlwidth", "1200")
  url.searchParams.set("format", "json")
  url.searchParams.set("origin", "*")

  const res = await fetch(url, { headers: HEADERS })
  const text = await res.text()
  try {
    const data = JSON.parse(text)
    const pages = data.query?.pages ?? {}
    const page = Object.values(pages)[0]
    const info = page?.imageinfo?.[0]
    if (!info) return null
    if (info.mediatype !== "BITMAP") return null
    const meta = info.extmetadata ?? {}
    return {
      imageUrl: info.thumburl || info.url,
      credit: {
        author: meta.Artist?.value.replace(/<[^>]+>/g, "").trim() || "不明",
        license: meta.LicenseShortName?.value ?? "不明",
        sourceUrl: info.descriptionurl,
      },
    }
  } catch {
    return null
  }
}

async function findWikimedia(query) {
  for (const result of await searchWikimedia(query)) {
    const ext = result.title.split(".").pop().toLowerCase()
    if (!["jpg", "jpeg"].includes(ext)) continue
    const found = await getWikimediaImage(result.title)
    if (found) return found
    await sleep(500)
  }
  return null
}

function formatLicense(license, version) {
  if (license === "cc0") return "CC0 1.0"
  if (license === "pdm") return "Public Domain Mark 1.0"
  return `CC ${license.toUpperCase()} ${version}`
}

async function findOpenverse(query) {
  const url = new URL("https://api.openverse.org/v1/images/")
  url.searchParams.set("q", query)
  url.searchParams.set("license", OPENVERSE_LICENSES.join(","))
  url.searchParams.set("extension", "jpg")
  url.searchParams.set("page_size", "5")

  const res = await fetch(url, { headers: HEADERS })
  if (!res.ok) throw new Error(`Openverse HTTP ${res.status}`)
  const r = (await res.json()).results?.[0]
  if (!r) return null
  return {
    imageUrl: r.url,
    credit: {
      author: r.creator || "不明",
      license: formatLicense(r.license, r.license_version),
      sourceUrl: r.foreign_landing_url,
    },
  }
}

async function downloadImage(imageUrl, destPath) {
  const res = await fetch(imageUrl, { headers: HEADERS })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  await pipeline(res.body, createWriteStream(destPath))
}

async function main() {
  let updated = 0
  let failed = 0

  for (const spot of spots) {
    const pad = String(spot.id).padStart(2, "0")
    const filename = `spot-${pad}.jpg`
    const destPath = join(imgDir, filename)

    if (existsSync(destPath)) continue

    // 個別指定 → 日本語名 → slug の順に、Wikimedia → Openverse で検索
    const queries = [SEARCH_QUERIES[spot.slug], spot.name, `${spot.slug.replace(/-/g, " ")} Tokyo`].filter(Boolean)
    console.log(`search: ${spot.name}`)

    try {
      let found = null
      for (const query of queries) {
        found = (await findWikimedia(query)) ?? (await findOpenverse(query))
        if (found) break
      }
      if (!found) throw new Error("画像見つからず")

      await downloadImage(found.imageUrl, destPath)
      spot.imageUrl = `/images/spots/${filename}`
      spot.imageCredit = found.credit
      updated++
      console.log(`✓ ${spot.name} → ${filename} (${found.credit.license})`)
    } catch (err) {
      failed++
      console.error(`✗ ${spot.name}: ${err.message}`)
    }

    await sleep(2000)
  }

  writeFileSync(spotsPath, JSON.stringify(spots, null, 2) + "\n")
  console.log(`\n完了: ${updated} 件取得, ${failed} 件失敗`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main()

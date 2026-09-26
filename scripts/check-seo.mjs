// ビルド成果物(out/)のSEO情報チェック。scripts/build.mjs から next build 後に実行する。
// index対象ページ: title/description/canonical必須・titleとcanonical一意・canonicalは自URL
// sitemap: noindexページや存在しないURLを含めない
import { readFileSync, readdirSync, statSync } from "fs"
import { join } from "path"

const OUT = "out"
const BASE_URL = "https://sozoroto.reload.co.jp"

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) return htmlFiles(p)
    return name === "index.html" ? [p] : []
  })
}

const attr = (html, re) => html.match(re)?.[1]
const errors = []
const pages = new Map()

for (const file of htmlFiles(OUT)) {
  const path = file.slice(OUT.length).replace(/index\.html$/, "")
  if (path.startsWith("/_next/")) continue
  const html = readFileSync(file, "utf8")
  const url = `${BASE_URL}${path}`
  const noindex = /<meta name="robots" content="[^"]*noindex/.test(html)
  const title = attr(html, /<title>([^<]*)<\/title>/)
  const description = attr(html, /<meta name="description" content="([^"]*)"/)
  const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/)
  pages.set(url, { noindex })
  if (noindex) continue
  if (!title) errors.push(`${path}: title がない`)
  if (!description) errors.push(`${path}: description がない`)
  if (canonical !== url)
    errors.push(`${path}: canonical が自URLでない (${canonical})`)
  pages.get(url).title = title
}

const seen = new Map()
for (const [url, { noindex, title }] of pages) {
  if (noindex || !title) continue
  if (seen.has(title))
    errors.push(`title 重複: "${title}" (${seen.get(title)}, ${url})`)
  seen.set(title, url)
}

const sitemap = readFileSync(join(OUT, "sitemap.xml"), "utf8")
for (const [, loc] of sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)) {
  const page = pages.get(loc)
  if (!page) errors.push(`sitemap: ページが存在しない ${loc}`)
  else if (page.noindex) errors.push(`sitemap: noindexページを含む ${loc}`)
}

if (errors.length > 0) {
  console.error(`SEOチェック失敗 (${errors.length}件)\n${errors.join("\n")}`)
  process.exit(1)
}
console.log(`SEOチェックOK (${pages.size}ページ)`)

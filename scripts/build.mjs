// 本番static export用ビルドスクリプト。
// dev限定admin機能（app/admin, app/api/admin）はoutput:exportと相性が悪い
// （動的routeにgenerateStaticParamsを要求される）ため、ビルド中だけ一時退避する。
import { existsSync } from "fs"
import { mkdir, rename, rmdir } from "fs/promises"
import { spawn } from "child_process"

const BACKUP_DIR = ".admin-build-backup"
const moves = [
  ["app/admin", `${BACKUP_DIR}/admin`],
  ["app/api/admin", `${BACKUP_DIR}/api-admin`],
]

async function restore() {
  for (const [from, to] of moves) {
    if (existsSync(to)) {
      await rename(to, from)
    }
  }
  await rmdir(BACKUP_DIR).catch(() => {})
}

async function main() {
  await mkdir(BACKUP_DIR, { recursive: true })
  for (const [from, to] of moves) {
    if (existsSync(from)) {
      await rename(from, to)
    }
  }

  const exitCode = await new Promise((resolve) => {
    const child = spawn("next", ["build"], { stdio: "inherit", shell: true })
    child.on("close", (code) => resolve(code ?? 1))
  })

  await restore()
  process.exit(exitCode)
}

main().catch(async (err) => {
  console.error(err)
  await restore()
  process.exit(1)
})

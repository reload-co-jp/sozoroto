/** @type {import('next').NextConfig} */

const nextConfig = {
  // 本番ビルド(output: export)ではdev限定admin機能(app/admin, app/api/admin)を
  // scripts/build.mjs が一時退避してからビルドする。next dev では常にNODE_ENV=development
  // となりexport制約が外れるため、admin機能はdevで通常どおり動作する。
  output: process.env.NODE_ENV === "development" ? undefined : "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

export default nextConfig

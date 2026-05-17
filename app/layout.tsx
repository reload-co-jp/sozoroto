import type { Metadata } from "next"
import Link from "next/link"
import "./reset.css"
import "./globals.css"
import { rootMetadata } from "lib/seo"
import { colors, font } from "lib/tokens"

export const metadata: Metadata = rootMetadata()

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ja">
      <body
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          fontFamily: font.family,
        }}
      >
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            borderBottom: `1px solid ${colors.gray200}`,
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            style={{
              maxWidth: 1024,
              margin: "0 auto",
              padding: "16px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Link href="/">
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: colors.primary,
                }}
              >
                そぞろっと
              </span>
            </Link>
            <nav
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                fontSize: 14,
                color: colors.gray600,
              }}
            >
              <Link href="/courses">コース一覧</Link>
              <Link href="/areas">エリア</Link>
            </nav>
          </div>
        </header>

        <main style={{ flex: 1 }}>{children}</main>

        <footer
          style={{
            borderTop: `1px solid ${colors.gray200}`,
            background: colors.white,
          }}
        >
          <div
            style={{
              maxWidth: 1024,
              margin: "0 auto",
              padding: "40px 24px",
              textAlign: "center",
              fontSize: 14,
              color: colors.gray500,
            }}
          >
            <p style={{ fontWeight: 600, color: colors.primary }}>
              そぞろっと
            </p>
            <p style={{ marginTop: 4 }}>
              東京近辺の散歩コースを、そぞろっと探す。
            </p>
            <p style={{ marginTop: 16, fontSize: 12 }}>
              <Link
                href="/about"
                style={{ color: colors.gray500 }}
              >
                このサイトについて
              </Link>
            </p>
            <p style={{ marginTop: 8, fontSize: 12 }}>© 2025 sozoroto</p>
          </div>
        </footer>
      </body>
    </html>
  )
}

export default RootLayout

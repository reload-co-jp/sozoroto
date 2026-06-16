import type { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import "./reset.css"
import "./globals.css"
import { rootMetadata, websiteJsonLd, organizationJsonLd } from "lib/seo"
import { colors, font } from "lib/tokens"

export const metadata: Metadata = rootMetadata()

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ja">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd()),
        }}
      />
      {process.env.NODE_ENV === "production" && (
        <>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-051Z05W041"
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-051Z05W041');`}
          </Script>
        </>
      )}
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
                  fontWeight: 900,
                  color: colors.primary,
                }}
              >
                そぞろっと！
              </span>
              <p style={{ fontSize: 9 }}>なんとなく、きままな冒険を。</p>
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
              そぞろっと！
            </p>
            <p style={{ marginTop: 4 }}>
              東京近辺の散歩コースを、そぞろっと！探す。
            </p>
            <p style={{ marginTop: 16, fontSize: 12 }}>
              <Link href="/about" style={{ color: colors.gray500 }}>
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

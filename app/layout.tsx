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
      <head>
        <Script
          id="website-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
        <Script
          id="organization-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
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
      </head>
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
            background: "rgba(247,245,239,0.94)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            className="container"
            style={{
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Link
              href="/"
              style={{ display: "flex", alignItems: "baseline", gap: 12 }}
            >
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  color: colors.primary,
                  letterSpacing: "0.02em",
                }}
              >
                そぞろっと！
              </span>
              <span
                className="nav-sub"
                style={{ fontSize: 11, color: colors.gray500 }}
              >
                東京近辺の散歩コース
              </span>
            </Link>
            <nav
              style={{
                display: "flex",
                alignItems: "center",
                gap: 28,
                fontSize: 14,
                color: colors.gray700,
              }}
            >
              <Link href="/courses">コース一覧</Link>
              <Link href="/areas">エリア</Link>
              <Link href="/about" className="nav-sub">
                このサイトについて
              </Link>
            </nav>
          </div>
        </header>

        <main style={{ flex: 1 }}>{children}</main>

        <footer
          style={{
            background: colors.gray900,
            color: colors.gray300,
          }}
        >
          <div
            className="container"
            style={{
              paddingTop: 56,
              paddingBottom: 32,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: 40,
            }}
          >
            <div>
              <Link
                href="/"
                style={{ fontSize: 22, fontWeight: 900, color: colors.surface }}
              >
                そぞろっと！
              </Link>
              <p
                style={{
                  marginTop: 12,
                  fontFamily: font.serif,
                  fontSize: 15,
                  color: colors.surface,
                }}
              >
                なんとなく、きままな冒険を。
              </p>
              <p style={{ marginTop: 4, fontSize: 13 }}>
                東京近辺の散歩コースを、そぞろっと！探す。
              </p>
            </div>
            <nav
              aria-label="フッター"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                fontSize: 14,
              }}
            >
              <Link href="/courses">コース一覧</Link>
              <Link href="/areas">エリアから探す</Link>
              <Link href="/about">このサイトについて</Link>
            </nav>
          </div>
          <div
            className="container"
            style={{
              paddingBottom: 32,
            }}
          >
            <p
              style={{
                paddingTop: 20,
                borderTop: "1px solid rgba(247,245,239,0.15)",
                fontSize: 12,
                color: colors.gray400,
              }}
            >
              © 2025 sozoroto
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}

export default RootLayout

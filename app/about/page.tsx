import type { Metadata } from "next"
import { colors, radius } from "lib/tokens"

export const metadata: Metadata = {
  title: "このサイトについて | そぞろっと",
  description:
    "そぞろっとは、東京近辺の散歩コースを探せるサービスです。サイトのコンセプトや使い方をご紹介します。",
  alternates: { canonical: "https://sozoroto.reload.co.jp/about" },
}

const section = (title: string, body: React.ReactNode) => (
  <section style={{ marginBottom: 48 }}>
    <h2
      style={{
        fontSize: 18,
        fontWeight: 700,
        color: colors.gray900,
        marginBottom: 16,
        paddingBottom: 8,
        borderBottom: `2px solid ${colors.primary}`,
      }}
    >
      {title}
    </h2>
    <div style={{ color: colors.gray700, lineHeight: 1.8, fontSize: 15 }}>
      {body}
    </div>
  </section>
)

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "64px 24px" }}>
      <h1
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: colors.gray900,
          marginBottom: 8,
        }}
      >
        このサイトについて
      </h1>
      <p style={{ color: colors.gray500, fontSize: 14, marginBottom: 48 }}>
        About sozoroto
      </p>

      {section(
        "そぞろっととは",
        <>
          <p>
            「そぞろっと」は、東京近辺の散歩コースをゆっくり探せるウェブサービスです。
            目的地ではなく、歩くこと自体を楽しみたいとき——そんな気分のお供になれたら、と思って作りました。
            エリアやテーマからコースを絞り込んだり、地図でルートを確認したりしながら、今日歩きたい場所を見つけてみてください。
          </p>
          <p style={{ marginTop: 12 }}>
            名前は「そぞろ歩き」に由来しています。そぞろ歩きとは、あてもなくぶらぶらと歩くこと。急がず、目的を決めすぎず、ただ歩くことを楽しむ——そんな散歩のあり方をそのままサービス名にしました。
          </p>
        </>
      )}

      {section(
        "コンテンツについて",
        <>
          <p>
            掲載しているコースはすべて編集部が実際に歩いて確認したものです。距離・所要時間・難易度などの情報は取材時点のものであり、道路状況や施設の変化により実際と異なる場合があります。
          </p>
          <p style={{ marginTop: 12 }}>
            コースの情報に誤りや変化を見つけた場合は、お問い合わせよりご連絡ください。
          </p>
        </>
      )}

      {section(
        "運営",
        <p>
          このサイトは{" "}
          <a
            href="https://reload.co.jp"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: colors.primary }}
          >
            株式会社Reload
          </a>{" "}
          が運営しています。
        </p>
      )}

      {section(
        "お問い合わせ",
        <p>
          ご意見・ご要望・掲載情報の誤りなどは{" "}
          <a
            href="mailto:info@reload.co.jp"
            style={{ color: colors.primary }}
          >
            info@reload.co.jp
          </a>{" "}
          までお送りください。
        </p>
      )}
    </div>
  )
}

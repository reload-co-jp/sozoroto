"use client"

import { FC, useEffect } from "react"

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

const units = {
  inArticle: {
    "data-ad-slot": "4625326006",
    "data-ad-layout": "in-article",
    "data-ad-format": "fluid",
  },
  display: {
    "data-ad-slot": "4829146611",
    "data-ad-format": "auto",
    "data-full-width-responsive": "true",
  },
}

// ローダー(adsbygoogle.js)はapp/layout.tsxで本番のみ読込
const AdUnit: FC<{
  unit: keyof typeof units
  style?: React.CSSProperties
  className?: string
}> = ({ unit, style, className }) => {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return
    ;(window.adsbygoogle = window.adsbygoogle || []).push({})
  }, [])

  if (process.env.NODE_ENV !== "production") return null

  return (
    <div className={className} style={style}>
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          textAlign: unit === "inArticle" ? "center" : undefined,
        }}
        data-ad-client="ca-pub-6542845006087970"
        {...units[unit]}
      />
    </div>
  )
}

export default AdUnit

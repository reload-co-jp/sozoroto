"use client"

import { FC, useEffect, useRef } from "react"

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
  const ref = useRef<HTMLModElement>(null)

  useEffect(() => {
    const el = ref.current
    if (process.env.NODE_ENV !== "production" || !el) return
    // 幅0でpushすると "No slot size for availableWidth=0" → 幅確定まで待つ
    const push = () => {
      if (el.offsetWidth === 0 || el.dataset.adsbygoogleStatus) return false
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      return true
    }
    if (push()) return
    const ro = new ResizeObserver(() => push() && ro.disconnect())
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  if (process.env.NODE_ENV !== "production") return null

  return (
    <div className={className} style={style}>
      <ins
        ref={ref}
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

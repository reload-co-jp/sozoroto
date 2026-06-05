"use client"

import { FC, ReactNode } from "react"

type Props = {
  spotId: number
  children: ReactNode
  style?: React.CSSProperties
}

const SpotListItem: FC<Props> = ({ spotId, children, style }) => {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("spot-click", { detail: { spotId } }))
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleClick() }}
      style={{ cursor: "pointer", ...style }}
    >
      {children}
    </div>
  )
}

export default SpotListItem

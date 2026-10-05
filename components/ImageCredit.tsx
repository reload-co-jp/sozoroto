import { FC } from "react"
import { colors } from "lib/tokens"
import type { ImageCredit as Credit } from "types/spot"

const ImageCredit: FC<{ credit?: Credit; style?: React.CSSProperties }> = ({
  credit,
  style,
}) =>
  credit ? (
    <p
      style={{
        fontSize: 12,
        color: colors.gray600,
        textAlign: "right",
        ...style,
      }}
    >
      写真:{" "}
      <a href={credit.sourceUrl} target="_blank" rel="noopener noreferrer">
        {credit.author}
      </a>{" "}
      / {credit.license}
    </p>
  ) : null

export default ImageCredit

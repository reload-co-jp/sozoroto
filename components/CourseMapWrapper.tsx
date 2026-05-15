"use client"

import dynamic from "next/dynamic"
import type { ComponentProps } from "react"
import type CourseMap from "components/CourseMap"

const CourseMapDynamic = dynamic(() => import("components/CourseMap"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full overflow-hidden rounded-2xl bg-gray-100 animate-pulse"
      style={{ height: "320px" }}
    />
  ),
})

const CourseMapWrapper = (props: ComponentProps<typeof CourseMap>) => (
  <CourseMapDynamic {...props} />
)

export default CourseMapWrapper

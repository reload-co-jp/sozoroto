"use client"

import { FC, useEffect, useRef } from "react"
import type { LineString } from "geojson"

type Spot = {
  id: string
  name: string
  latitude: number
  longitude: number
  type: "start" | "end" | "waypoint"
}

type Props = {
  route: LineString
  spots?: Spot[]
  height?: string
}

const CourseMap: FC<Props> = ({ route, spots = [], height = "400px" }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<unknown>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const center = route.coordinates[
      Math.floor(route.coordinates.length / 2)
    ] as [number, number]

    import("maplibre-gl").then(({ default: maplibregl }) => {
      const map = new maplibregl.Map({
        container: containerRef.current!,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: [
                "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
              ],
              tileSize: 256,
              attribution: "© OpenStreetMap contributors",
            },
          },
          layers: [
            {
              id: "osm",
              type: "raster",
              source: "osm",
            },
          ],
        },
        center,
        zoom: 14,
      })

      mapRef.current = map

      map.on("load", () => {
        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: route,
          },
        })

        map.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#3d7a5f",
            "line-width": 4,
            "line-opacity": 0.85,
          },
        })

        spots.forEach((spot) => {
          const color =
            spot.type === "start"
              ? "#22c55e"
              : spot.type === "end"
                ? "#ef4444"
                : "#3b82f6"

          const el = document.createElement("div")
          el.style.cssText = `
            width: 12px; height: 12px;
            background: ${color};
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 1px 4px rgba(0,0,0,0.3);
          `

          new maplibregl.Marker({ element: el })
            .setLngLat([spot.longitude, spot.latitude])
            .setPopup(
              new maplibregl.Popup({ offset: 10 }).setHTML(
                `<p style="margin:0;font-size:13px;font-weight:bold">${spot.name}</p>`
              )
            )
            .addTo(map)
        })

        const bounds = route.coordinates.reduce(
          (b, coord) => b.extend(coord as [number, number]),
          new maplibregl.LngLatBounds(
            route.coordinates[0] as [number, number],
            route.coordinates[0] as [number, number]
          )
        )
        map.fitBounds(bounds, { padding: 40 })
      })
    })

    return () => {
      if (mapRef.current) {
        ;(mapRef.current as { remove: () => void }).remove()
        mapRef.current = null
      }
    }
  }, [route, spots])

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className="w-full overflow-hidden rounded-2xl"
    />
  )
}

export default CourseMap

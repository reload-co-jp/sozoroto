"use client"

import { FC, useEffect, useRef, useState, useCallback } from "react"
import type { LineString } from "geojson"
import "maplibre-gl/dist/maplibre-gl.css"

type Spot = {
  id: number
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

function useMapInit(
  containerRef: React.RefObject<HTMLDivElement | null>,
  route: LineString,
  spots: Spot[]
) {
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
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution: "© OpenStreetMap contributors",
            },
          },
          layers: [{ id: "osm", type: "raster", source: "osm" }],
        },
        center,
        zoom: 14,
      })

      mapRef.current = map

      map.on("load", () => {
        map.addSource("route", {
          type: "geojson",
          data: { type: "Feature", properties: {}, geometry: route },
        })

        map.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          layout: { "line-join": "round", "line-cap": "round" },
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
}

const MapContainer: FC<{ route: LineString; spots: Spot[]; height: string }> = ({
  route,
  spots,
  height,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  useMapInit(containerRef, route, spots)
  return (
    <div
      ref={containerRef}
      style={{ height }}
      className="w-full overflow-hidden rounded-2xl"
    />
  )
}

const CourseMap: FC<Props> = ({ route, spots = [], height = "400px" }) => {
  const [expanded, setExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setExpanded(false)
  }, [])

  useEffect(() => {
    if (expanded) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [expanded, handleKeyDown])

  useMapInit(containerRef, route, spots)

  return (
    <>
      <div style={{ position: "relative" }}>
        <div
          ref={containerRef}
          style={{ height }}
          className="w-full overflow-hidden rounded-2xl"
        />
        <button
          onClick={() => setExpanded(true)}
          aria-label="地図を拡大"
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 32,
            height: 32,
            borderRadius: 6,
            background: "rgba(255,255,255,0.9)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            zIndex: 1,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={16}
            fill="none"
            viewBox="0 0 24 24"
            stroke="#374151"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        </button>
      </div>

      {expanded && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            flexDirection: "column",
          }}
          onClick={() => setExpanded(false)}
        >
          <div
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 10000,
            }}
          >
            <button
              onClick={() => setExpanded(false)}
              aria-label="閉じる"
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: "rgba(255,255,255,0.9)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                fill="none"
                viewBox="0 0 24 24"
                stroke="#374151"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div
            style={{ flex: 1, margin: 16, borderRadius: 12, overflow: "hidden" }}
            onClick={(e) => e.stopPropagation()}
          >
            <MapContainer route={route} spots={spots} height="100%" />
          </div>
        </div>
      )}
    </>
  )
}

export default CourseMap

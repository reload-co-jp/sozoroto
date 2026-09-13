"use client"

import { useEffect, useRef } from "react"
import type { LineString, Position } from "geojson"
import type { Map as MaplibreMap, Marker } from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

type Props = {
  value: LineString
  onChange: (route: LineString) => void
  height?: string
}

function distanceToSegment(p: Position, a: Position, b: Position): number {
  const [px, py] = p
  const [ax, ay] = a
  const [bx, by] = b
  const dx = bx - ax
  const dy = by - ay
  const lengthSq = dx * dx + dy * dy
  let t = lengthSq === 0 ? 0 : ((px - ax) * dx + (py - ay) * dy) / lengthSq
  t = Math.max(0, Math.min(1, t))
  const cx = ax + t * dx
  const cy = ay + t * dy
  return Math.hypot(px - cx, py - cy)
}

// クリック位置に最も近い区間を探し、その直後に挿入するインデックスを返す
function nearestInsertIndex(coords: Position[], point: Position): number {
  let minDist = Infinity
  let insertAt = coords.length
  for (let i = 0; i < coords.length - 1; i++) {
    const d = distanceToSegment(point, coords[i], coords[i + 1])
    if (d < minDist) {
      minDist = d
      insertAt = i + 1
    }
  }
  return insertAt
}

export default function RouteEditorMap({ value, onChange, height = "420px" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MaplibreMap | null>(null)
  const markersRef = useRef<Marker[]>([])
  const routeRef = useRef<LineString>(value)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    let cancelled = false

    import("maplibre-gl").then(({ default: maplibregl }) => {
      if (cancelled || !containerRef.current) return

      const center = routeRef.current.coordinates[
        Math.floor(routeRef.current.coordinates.length / 2)
      ] as [number, number]

      const map = new maplibregl.Map({
        container: containerRef.current,
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
        zoom: 15,
      })
      mapRef.current = map

      const updateLineSource = () => {
        const source = map.getSource("route")
        if (source && "setData" in source) {
          ;(source as { setData: (data: unknown) => void }).setData({
            type: "Feature",
            properties: {},
            geometry: routeRef.current,
          })
        }
      }

      const emitChange = () => {
        onChangeRef.current({
          type: "LineString",
          coordinates: routeRef.current.coordinates.map((c) => [...c]),
        })
      }

      const rebuildMarkers = () => {
        markersRef.current.forEach((m) => m.remove())
        markersRef.current = []

        routeRef.current.coordinates.forEach((coord, i) => {
          const el = document.createElement("div")
          const isEndpoint = i === 0 || i === routeRef.current.coordinates.length - 1
          el.style.cssText = `
            width: ${isEndpoint ? 16 : 12}px;
            height: ${isEndpoint ? 16 : 12}px;
            background: ${isEndpoint ? "#ef4444" : "#f97316"};
            border: 2px solid white;
            border-radius: 50%;
            cursor: grab;
            box-shadow: 0 1px 4px rgba(0,0,0,0.4);
          `
          el.title = "ドラッグで移動 / ダブルクリックで削除"

          const marker = new maplibregl.Marker({ element: el, draggable: true })
            .setLngLat(coord as [number, number])
            .addTo(map)

          marker.on("drag", () => {
            const { lng, lat } = marker.getLngLat()
            routeRef.current.coordinates[i] = [lng, lat]
            updateLineSource()
          })
          marker.on("dragend", () => {
            emitChange()
          })

          el.addEventListener("click", (e) => e.stopPropagation())
          el.addEventListener("dblclick", (e) => {
            e.stopPropagation()
            if (routeRef.current.coordinates.length <= 2) return
            routeRef.current.coordinates.splice(i, 1)
            rebuildMarkers()
            updateLineSource()
            emitChange()
          })

          markersRef.current.push(marker)
        })
      }

      map.on("load", () => {
        map.addSource("route", {
          type: "geojson",
          data: { type: "Feature", properties: {}, geometry: routeRef.current },
        })
        map.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": "#3d7a5f", "line-width": 4, "line-opacity": 0.85 },
        })

        rebuildMarkers()

        const bounds = routeRef.current.coordinates.reduce(
          (b, coord) => b.extend(coord as [number, number]),
          new maplibregl.LngLatBounds(
            routeRef.current.coordinates[0] as [number, number],
            routeRef.current.coordinates[0] as [number, number]
          )
        )
        map.fitBounds(bounds, { padding: 40 })

        map.on("click", (e) => {
          const point: Position = [e.lngLat.lng, e.lngLat.lat]
          const insertAt = nearestInsertIndex(routeRef.current.coordinates, point)
          routeRef.current.coordinates.splice(insertAt, 0, point)
          rebuildMarkers()
          updateLineSource()
          emitChange()
        })
      })
    })

    return () => {
      cancelled = true
      markersRef.current.forEach((m) => m.remove())
      markersRef.current = []
      mapRef.current?.remove()
      mapRef.current = null
    }
    // 初回マウント時のみ地図生成。以降はvalueの再流入で作り直さない（ドラッグ中の再初期化を防ぐ）
  }, [])

  return (
    <div>
      <div ref={containerRef} style={{ height }} className="w-full overflow-hidden rounded-2xl" />
      <p style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
        地図クリックで頂点追加・ドラッグで移動・頂点ダブルクリックで削除（始点/終点は赤）
      </p>
    </div>
  )
}

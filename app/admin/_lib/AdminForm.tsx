"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { ResourceSchema, FieldDef } from "app/admin/_lib/schema"
import { colors, radius } from "lib/tokens"

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  border: `1px solid ${colors.gray300}`,
  borderRadius: radius.sm,
  color: colors.gray900,
  background: colors.white,
}

type Props = {
  schema: ResourceSchema
  initialValues: Record<string, unknown> | null
  recordId: string | null
}

function toInputValue(field: FieldDef, value: unknown): string {
  if (value === undefined || value === null) return ""
  if (field.type === "list" && Array.isArray(value)) return value.join(", ")
  if (field.type === "readonly") {
    return typeof value === "string" ? value : JSON.stringify(value)
  }
  return String(value)
}

function buildInitialState(schema: ResourceSchema, initialValues: Record<string, unknown> | null) {
  const state: Record<string, string> = {}
  for (const field of schema.fields) {
    state[field.key] = toInputValue(field, initialValues?.[field.key])
  }
  return state
}

export default function AdminForm({ schema, initialValues, recordId }: Props) {
  const router = useRouter()
  const [values, setValues] = useState<Record<string, string>>(() =>
    buildInitialState(schema, initialValues)
  )
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [geocoding, setGeocoding] = useState(false)

  const isNew = recordId === null

  function handleChange(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  async function handleGeocode() {
    const address = values.address?.trim()
    if (!address) {
      setError("住所を入力してください")
      return
    }
    setError(null)
    setGeocoding(true)
    try {
      const res = await fetch(`/api/admin/geocode?address=${encodeURIComponent(address)}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "ジオコーディングに失敗しました")
        return
      }
      setValues((prev) => ({
        ...prev,
        latitude: String(data.latitude),
        longitude: String(data.longitude),
      }))
    } finally {
      setGeocoding(false)
    }
  }

  type PayloadResult =
    | { ok: true; payload: Record<string, unknown> }
    | { ok: false; error: string }

  function buildPayload(): PayloadResult {
    const payload: Record<string, unknown> = {}
    for (const field of schema.fields) {
      if (field.type === "readonly") continue
      const raw = values[field.key] ?? ""

      if (field.required && raw.trim() === "") {
        return { ok: false, error: `「${field.label}」は必須です` }
      }
      if (raw.trim() === "" && !field.required) {
        continue
      }

      if (field.type === "number") {
        const num = Number(raw)
        if (Number.isNaN(num)) {
          return { ok: false, error: `「${field.label}」は数値で入力してください` }
        }
        payload[field.key] = num
      } else if (field.type === "list") {
        payload[field.key] = raw
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s !== "")
      } else {
        payload[field.key] = raw
      }
    }
    return { ok: true, payload }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const result = buildPayload()
    if (result.ok === false) {
      setError(result.error)
      return
    }

    setSaving(true)
    try {
      const url = isNew
        ? `/api/admin/${schema.resource}`
        : `/api/admin/${schema.resource}/${recordId}`
      const res = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "保存に失敗しました")
        return
      }
      router.push(`/admin/${schema.resource}`)
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (isNew || recordId === null) return
    if (!window.confirm("削除しますか？この操作は取り消せません。")) return

    setSaving(true)
    try {
      const res = await fetch(`/api/admin/${schema.resource}/${recordId}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "削除に失敗しました")
        return
      }
      router.push(`/admin/${schema.resource}`)
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 640,
        background: colors.white,
        padding: 24,
        borderRadius: radius.md,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}
    >
      {error && (
        <p
          style={{
            color: colors.orange700,
            background: colors.orange100,
            padding: "8px 12px",
            borderRadius: radius.sm,
            fontWeight: "bold",
          }}
        >
          {error}
        </p>
      )}
      {schema.fields.map((field) => (
        <div key={field.key} style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: 4,
              color: colors.gray700,
            }}
          >
            {field.label}
            {field.required && <span style={{ color: colors.orange700 }}> *</span>}
          </label>
          {field.type === "readonly" ? (
            <textarea
              value={values[field.key]}
              readOnly
              rows={field.key === "routeGeoJson" ? 6 : 1}
              style={{ ...inputStyle, background: colors.surface2, color: colors.gray500 }}
            />
          ) : field.type === "textarea" ? (
            <textarea
              value={values[field.key]}
              onChange={(e) => handleChange(field.key, e.target.value)}
              rows={4}
              style={inputStyle}
            />
          ) : field.type === "select" ? (
            <select
              value={values[field.key]}
              onChange={(e) => handleChange(field.key, e.target.value)}
              style={inputStyle}
            >
              <option value="">選択してください</option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={values[field.key]}
              onChange={(e) => handleChange(field.key, e.target.value)}
              style={inputStyle}
            />
          )}
          {schema.resource === "spots" && field.key === "address" && (
            <button
              type="button"
              onClick={handleGeocode}
              disabled={geocoding}
              style={{
                marginTop: 8,
                padding: "6px 12px",
                borderRadius: radius.sm,
                border: `1px solid ${colors.primary}`,
                background: colors.white,
                color: colors.primary,
                fontWeight: "bold",
              }}
            >
              {geocoding ? "取得中..." : "住所から緯度経度を取得"}
            </button>
          )}
        </div>
      ))}

      <div style={{ display: "flex", gap: 12 }}>
        <button
          type="submit"
          disabled={saving}
          style={{
            padding: "10px 20px",
            borderRadius: radius.sm,
            border: "none",
            background: colors.primary,
            color: colors.white,
            fontWeight: "bold",
          }}
        >
          {saving ? "保存中..." : "保存"}
        </button>
        {!isNew && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            style={{
              padding: "10px 20px",
              borderRadius: radius.sm,
              border: `1px solid ${colors.orange700}`,
              background: colors.white,
              color: colors.orange700,
              fontWeight: "bold",
            }}
          >
            削除
          </button>
        )}
      </div>
    </form>
  )
}

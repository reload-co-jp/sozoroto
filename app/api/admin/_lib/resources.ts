import fs from "fs"
import path from "path"

export type ResourceName = "spots" | "areas" | "courses" | "tags"

export type ResourceRow = { id: number; slug?: string; [key: string]: unknown }

const FILE_MAP: Record<ResourceName, string> = {
  spots: "data/spots.json",
  areas: "data/areas.json",
  courses: "data/courses.json",
  tags: "data/tags.json",
}

export function isResourceName(value: string): value is ResourceName {
  return Object.prototype.hasOwnProperty.call(FILE_MAP, value)
}

function filePath(resource: ResourceName): string {
  return path.join(process.cwd(), FILE_MAP[resource])
}

export function readResource(resource: ResourceName): ResourceRow[] {
  const raw = fs.readFileSync(filePath(resource), "utf-8")
  return JSON.parse(raw) as ResourceRow[]
}

export function writeResource(resource: ResourceName, records: ResourceRow[]): void {
  fs.writeFileSync(filePath(resource), JSON.stringify(records, null, 2) + "\n", "utf-8")
}

export function nextId(records: ResourceRow[]): number {
  return records.reduce((max, r) => Math.max(max, r.id), 0) + 1
}

export function isDevEnv(): boolean {
  return process.env.NODE_ENV === "development"
}

// SectorCalc V5.3.1 — Baris PRO Schema Loader
// Loads schemas from src/sectorcalc/schemas/pro-v531/
// Used by resolveApprovedToolSchema as a fallback for the pro-v531 directory.
import "server-only";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { SuperV4Schema } from "@/sectorcalc/pro-form/contract-types";

let loadedSchemas: Map<string, SuperV4Schema> | null = null;

const SCHEMA_DIR = join(process.cwd(), "src/sectorcalc/schemas/pro-v531");
const STANDALONE_DIR = join(
  process.cwd(),
  ".next/standalone/src/sectorcalc/schemas/pro-v531"
);

function getSchemaDir(): string {
  if (existsSync(STANDALONE_DIR)) return STANDALONE_DIR;
  if (existsSync(SCHEMA_DIR)) return SCHEMA_DIR;
  return SCHEMA_DIR;
}

function loadAllSchemas(): void {
  if (loadedSchemas) return;
  loadedSchemas = new Map();
  const dir = getSchemaDir();
  if (!existsSync(dir)) return;
  const files = readdirSync(dir).filter((f) => f.endsWith(".schema.json"));
  for (const file of files) {
    try {
      const raw = JSON.parse(readFileSync(join(dir, file), "utf8"));
      if (raw.tool_key) {
        loadedSchemas.set(raw.tool_key, raw as SuperV4Schema);
      }
    } catch {
      // skip invalid files
    }
  }
}

export function getBarisProSchema(toolKey: string): SuperV4Schema | null {
  loadAllSchemas();
  return loadedSchemas?.get(toolKey) ?? null;
}

export function listBarisProSchemaSlugs(): string[] {
  loadAllSchemas();
  return loadedSchemas ? [...loadedSchemas.keys()].sort() : [];
}

export function clearBarisSchemaCache(): void {
  loadedSchemas = null;
}

// SectorCalc V5.3.1 — Free V5.3.1 Schema Loader
// Server-only loader for the 51 additional Free calculator schemas.
// Schemas are loaded from src/sectorcalc/schemas/free-v531/ and validated.

import type { SuperV4Schema } from "@/sectorcalc/pro-form/contract-types";
import { validateProV531Schema } from "@/sectorcalc/runtime/validate-pro-v531-schema";
import { readFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";

interface LoadedSchema {
  schema: SuperV4Schema;
  errors: string[];
}

let loadedSchemas: Map<string, LoadedSchema> | null = null;

const SCHEMA_DIR = join(process.cwd(), "src/sectorcalc/schemas/free-v531");

function loadAllSchemas(): void {
  if (loadedSchemas) return;
  loadedSchemas = new Map();

  if (!existsSync(SCHEMA_DIR)) return;

  const files = readdirSync(SCHEMA_DIR)
    .filter((f) => f.endsWith(".schema.json"))
    .sort();

  for (const file of files) {
    try {
      const filePath = join(SCHEMA_DIR, file);
      const raw = JSON.parse(readFileSync(filePath, "utf8")) as Record<string, unknown>;

      const toolKey = raw.tool_key as string;
      if (!toolKey) {
        continue;
      }

      // Validate
      const validation = validateProV531Schema(raw);
      if (!validation.ok) {
        continue;
      }

      if (validation.schema && !loadedSchemas.has(toolKey)) {
        loadedSchemas.set(toolKey, {
          schema: validation.schema,
          errors: [],
        });
      }
    } catch {
      // Skip invalid files
    }
  }
}

export function getFreeToolSchema(toolKey: string): SuperV4Schema | null {
  loadAllSchemas();
  const entry = loadedSchemas?.get(toolKey);
  return entry?.schema ?? null;
}

export function listFreeToolSchemaSlugs(): string[] {
  loadAllSchemas();
  if (!loadedSchemas) return [];
  return [...loadedSchemas.keys()].sort();
}

export function getAllFreeToolSchemas(): Array<{ toolKey: string; schema: SuperV4Schema }> {
  loadAllSchemas();
  if (!loadedSchemas) return [];
  return [...loadedSchemas.entries()].map(([toolKey, entry]) => ({
    toolKey,
    schema: entry.schema,
  }));
}

export function getFreeSchemaCount(): number {
  loadAllSchemas();
  return loadedSchemas?.size ?? 0;
}

export function reloadFreeSchemas(): void {
  loadedSchemas = null;
  loadAllSchemas();
}

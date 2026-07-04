import type { SuperV4Schema } from "@/sectorcalc/pro-form/contract-types";
import { validateSuperV4Schema } from "@/sectorcalc/pro-form/schema-adapter";
import { readFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";

interface LoadedSchema { schema: SuperV4Schema; errors: string[]; }
let loadedSchemas: Map<string, LoadedSchema> | null = null;
let loadErrors: string[] = [];

function getSchemasDir(): string {
  const cwd = process.cwd();
  const fnBundle = join(cwd, ".next/standalone/src/sectorcalc/schemas/free-v531");
  if (existsSync(fnBundle)) return fnBundle;
  const direct = join(cwd, "src/sectorcalc/schemas/free-v531");
  if (existsSync(direct)) return direct;
  return direct;
}

function loadAllSchemas(): void {
  if (loadedSchemas) return;
  loadedSchemas = new Map(); loadErrors = [];
  try {
    const schemasDir = getSchemasDir();
    if (!existsSync(schemasDir)) { loadErrors.push("Dir not found: " + schemasDir); return; }
    const files = readdirSync(schemasDir).filter((f: string) => f.endsWith(".json")).sort();
    if (files.length === 0) { loadErrors.push("No schema files"); return; }
    for (const file of files) {
      try {
        const schema = JSON.parse(readFileSync(join(schemasDir, file), "utf8")) as SuperV4Schema;
        if (!schema.tool_key) { loadErrors.push("Missing tool_key in " + file); continue; }
        const v = validateSuperV4Schema(schema);
        if (!v.ok) { loadErrors.push(schema.tool_key + ": " + v.errors.join("; ")); continue; }
        if (loadedSchemas.has(schema.tool_key)) { loadErrors.push("Duplicate: " + schema.tool_key); continue; }
        if (v.schema) loadedSchemas.set(schema.tool_key, { schema: v.schema, errors: [] });
      } catch (err) {
        loadErrors.push("Error " + file + ": " + (err instanceof Error ? err.message : String(err)));
      }
    }
  } catch (err) {
    loadErrors.push("Init: " + (err instanceof Error ? err.message : String(err)));
  }
}

export function getFreeToolSchema(toolKey: string): SuperV4Schema | null {
  loadAllSchemas(); const entry = loadedSchemas?.get(toolKey); return entry?.schema ?? null;
}
export function listFreeToolSchemaSlugs(): string[] {
  loadAllSchemas(); return loadedSchemas ? [...loadedSchemas.keys()].sort() : [];
}
export function getAllFreeToolSchemas(): Array<{ toolKey: string; schema: SuperV4Schema }> {
  loadAllSchemas(); if (!loadedSchemas) return [];
  return [...loadedSchemas.entries()].filter(([_, e]) => e.schema).map(([k, e]) => ({ toolKey: k, schema: e.schema }));
}

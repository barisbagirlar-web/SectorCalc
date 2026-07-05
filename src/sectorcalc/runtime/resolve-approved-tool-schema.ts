// SectorCalc V5.3.1 Canonical Schema Resolver (Pro + Free V5.3.1)

import type { SuperV4Schema } from "@/sectorcalc/pro-form/contract-types";
import { validateSuperV4Schema } from "@/sectorcalc/pro-form/schema-adapter";
import { getProToolSchema, listProToolSchemaSlugs } from "@/sectorcalc/runtime/pro-schema-loader";
import { getFreeToolSchema, listFreeToolSchemaSlugs } from "@/sectorcalc/runtime/free-schema-loader";
import { assertToolSchemaIdentity, freezeSchemaGuard } from "@/sectorcalc/runtime/assert-tool-schema-identity";
import { enrichV531SchemaReferences } from "@/sectorcalc/runtime/v531-reference-enrichment";

export type ApprovedSchemaResult =
  | { ok: true; schema: SuperV4Schema; source: "pro_v531" | "free_v531" }
  | { ok: false; reason: "SCHEMA_NOT_FOUND" | "VALIDATION_FAILED" | "SCHEMA_IDENTITY_MISMATCH" | "CAUGHT_EXCEPTION"; errors: string[] };

type ResolvedSource = "pro_v531" | "free_v531";

interface CacheEntry { schema: SuperV4Schema; source: ResolvedSource; }

const schemaCache = new Map<string, CacheEntry>();
const MAX_CACHE_SIZE = 800;

function trimCache(): void {
  if (schemaCache.size <= MAX_CACHE_SIZE) return;
  const toDelete = schemaCache.size - MAX_CACHE_SIZE;
  let deleted = 0;
  for (const key of schemaCache.keys()) {
    if (deleted >= toDelete) break;
    schemaCache.delete(key);
    deleted++;
  }
}

function computeSchemaHash(schema: SuperV4Schema): string {
  const payload = [schema.tool_id, schema.metadata?.schema_version || "", schema.metadata?.formula_version || "", schema.inputs.length, schema.outputs.length, schema.formulas.length, JSON.stringify(schema.unit_conversion_contract?.conversion_registry ? Object.keys(schema.unit_conversion_contract.conversion_registry).sort() : [])].join("|");
  let hash = 0;
  for (let i = 0; i < payload.length; i++) { hash = ((hash << 5) - hash) + payload.charCodeAt(i); hash |= 0; }
  return "h" + Math.abs(hash).toString(16);
}

function cacheKey(toolKey: string, schema: SuperV4Schema): string {
  return toolKey + ":" + (schema.metadata?.schema_version || "1.0.0") + ":" + computeSchemaHash(schema);
}

export function resolveApprovedToolSchema(toolKey: string): ApprovedSchemaResult {
  if (!toolKey || typeof toolKey !== "string") return { ok: false, reason: "SCHEMA_NOT_FOUND", errors: ["Invalid tool key: " + toolKey] };
  const normalizedKey = toolKey.trim();

  function buildAndCache(buildFn: () => SuperV4Schema, source: ResolvedSource): ApprovedSchemaResult {
    let superV4: SuperV4Schema;
    try { superV4 = buildFn(); } catch (err: unknown) { return { ok: false, reason: "CAUGHT_EXCEPTION", errors: ["Build threw: " + (err instanceof Error ? err.message : String(err))] }; }
    const validation = validateSuperV4Schema(superV4);
    if (validation.ok) {
      const enriched = enrichV531SchemaReferences(validation.schema);
      const frozen = freezeSchemaGuard(enriched);
      const key = cacheKey(normalizedKey, frozen);
      if (!schemaCache.has(key)) { schemaCache.set(key, { schema: frozen, source }); trimCache(); }
      return { ok: true, schema: frozen, source };
    }
    return { ok: false, reason: "VALIDATION_FAILED", errors: validation.errors };
  }

  for (const [key, entry] of schemaCache.entries()) {
    if (key.startsWith(normalizedKey + ":")) {
      const identityCheck = assertToolSchemaIdentity({ routeToolKey: normalizedKey, schemaToolKey: entry.schema.tool_key, schemaToolId: entry.schema.tool_id });
      if (!identityCheck.ok) { schemaCache.delete(key); continue; }
      return { ok: true, schema: entry.schema, source: entry.source };
    }
  }

  const proSchema = getProToolSchema(normalizedKey);
  if (proSchema) return buildAndCache(() => proSchema, "pro_v531");

  const freeSchema = getFreeToolSchema(normalizedKey);
  if (freeSchema) return buildAndCache(() => freeSchema, "free_v531");

  return { ok: false, reason: "SCHEMA_NOT_FOUND", errors: ["No schema found for: " + normalizedKey] };
}

export function getSchemaCacheStats(): { size: number; keys: string[] } {
  return { size: schemaCache.size, keys: [...schemaCache.keys()].slice(0, 5) };
}

export function clearSchemaCache(): void { schemaCache.clear(); }

export function listAllResolvableToolKeys(): string[] {
  return [...listProToolSchemaSlugs(), ...listFreeToolSchemaSlugs()];
}

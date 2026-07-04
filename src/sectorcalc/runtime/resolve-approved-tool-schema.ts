// SectorCalc V5.3.1 Canonical Schema Resolver (Pro-only)
// Server-only. Single entry point for all tool schema resolution.
// Resolution order:
//   1. Pro V5.3.1 schema (highest priority)
//   2. Safe null for unknown tool

import type { SuperV4Schema } from "@/sectorcalc/pro-form/contract-types";
import { validateSuperV4Schema } from "@/sectorcalc/pro-form/schema-adapter";
import { getProToolSchema, listProToolSchemaSlugs } from "@/sectorcalc/runtime/pro-schema-loader";
import { assertToolSchemaIdentity, freezeSchemaGuard } from "@/sectorcalc/runtime/assert-tool-schema-identity";

export type ApprovedSchemaResult =
  | { ok: true; schema: SuperV4Schema; source: "pro_v531" }
  | { ok: false; reason: "SCHEMA_NOT_FOUND" | "VALIDATION_FAILED" | "SCHEMA_IDENTITY_MISMATCH" | "CAUGHT_EXCEPTION"; errors: string[] };

// ── Server-side schema cache ─────────────────────────────────────────────
// Module-scoped, never imported by client components.
// Key format: `${toolKey}:${schemaVersion}:${schemaHash}`

type ResolvedSource = "pro_v531";

interface CacheEntry {
  schema: SuperV4Schema;
  source: ResolvedSource;
}

const schemaCache = new Map<string, CacheEntry>();

const MAX_CACHE_SIZE = 500;

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
  const payload = [
    schema.tool_id,
    schema.metadata?.schema_version || "",
    schema.metadata?.formula_version || "",
    schema.inputs.length,
    schema.outputs.length,
    schema.formulas.length,
    JSON.stringify(schema.unit_conversion_contract?.conversion_registry ? Object.keys(schema.unit_conversion_contract.conversion_registry).sort() : []),
  ].join("|");
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `h${Math.abs(hash).toString(16)}`;
}

function cacheKey(toolKey: string, schema: SuperV4Schema): string {
  const version = schema.metadata?.schema_version || "1.0.0";
  const hash = computeSchemaHash(schema);
  return `${toolKey}:${version}:${hash}`;
}

/**
 * Resolve and validate a tool schema to the approved V5.3.1 SuperV4Schema format.
 *
 * Pro-only: only Pro V5.3.1 schemas are resolved. Free tool schemas
 * have been permanently removed from the active source tree.
 *
 * Every returned schema is validated against the strict V5.3.1 contract.
 * Validated schemas are cached server-side. Cache key includes schema version + hash,
 * so version/hash changes create a new key and invalidate naturally.
 *
 * Identity invariant: every cache return verifies schema.tool_key === requestedToolKey.
 * Cached schemas are frozen to prevent cross-request mutation.
 */
export function resolveApprovedToolSchema(toolKey: string): ApprovedSchemaResult {
  if (!toolKey || typeof toolKey !== "string") {
    return {
      ok: false,
      reason: "SCHEMA_NOT_FOUND",
      errors: [`Invalid tool key: ${toolKey}`],
    };
  }

  const normalizedKey = toolKey.trim();

  // Helper: build and validate a SuperV4 schema, cache if valid
  function buildAndCache(
    buildFn: () => SuperV4Schema,
    source: ResolvedSource,
  ): ApprovedSchemaResult {
    let superV4: SuperV4Schema;
    try {
      superV4 = buildFn();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        ok: false,
        reason: "CAUGHT_EXCEPTION",
        errors: [`Build function threw: ${msg}`],
      };
    }
    const validation = validateSuperV4Schema(superV4);
    if (validation.ok) {
      const frozen = freezeSchemaGuard(validation.schema);
      const key = cacheKey(normalizedKey, frozen);
      if (!schemaCache.has(key)) {
        schemaCache.set(key, { schema: frozen, source });
        trimCache();
      }
      return { ok: true, schema: frozen, source };
    }
    return {
      ok: false,
      reason: "VALIDATION_FAILED",
      errors: validation.errors,
    };
  }

  // Check cache by iterating (fast path for previously cached schemas)
  for (const [key, entry] of schemaCache.entries()) {
    if (key.startsWith(`${normalizedKey}:`)) {
      // Identity invariant: verify cached schema.tool_key matches requested key
      const identityCheck = assertToolSchemaIdentity({
        routeToolKey: normalizedKey,
        schemaToolKey: entry.schema.tool_key,
        schemaToolId: entry.schema.tool_id,
      });
      if (!identityCheck.ok) {
        // Cache poison detected — remove bad entry and fall through to rebuild
        schemaCache.delete(key);
        continue;
      }
      return { ok: true, schema: entry.schema, source: entry.source };
    }
  }

  // 1. PRO V5.3.1 schema (native V5.3.1 — highest priority)
  const proSchema = getProToolSchema(normalizedKey);
  if (proSchema) {
    return buildAndCache(
      () => proSchema,
      "pro_v531",
    );
  }

  // 2. Unknown tool — do not cache
  return {
    ok: false,
    reason: "SCHEMA_NOT_FOUND",
    errors: [`No schema found for tool key: ${normalizedKey}`],
  };
}

/**
 * Get cache stats for diagnostics.
 * Returns count of cached entries and sample keys.
 */
export function getSchemaCacheStats(): { size: number; keys: string[] } {
  return {
    size: schemaCache.size,
    keys: [...schemaCache.keys()].slice(0, 5),
  };
}

/**
 * Clear the schema cache (for testing).
 */
export function clearSchemaCache(): void {
  schemaCache.clear();
}

/**
 * List all known tool keys that can be resolved.
 */
export function listAllResolvableToolKeys(): string[] {
  return listProToolSchemaSlugs();
}

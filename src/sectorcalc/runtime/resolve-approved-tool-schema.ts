// SectorCalc V5.4 Core — Canonical Schema Resolver with Active Tool Allowlist
// Only allowlisted tools are resolved for public execution.
// All other tools return SCHEMA_NOT_FOUND (quarantined until V5.4 Core rebuild).

import type { SuperV4Schema } from "@/sectorcalc/pro-form/contract-types";
import { validateSuperV4Schema } from "@/sectorcalc/pro-form/schema-adapter";
import {
  getProToolSchema,
  listProToolSchemaSlugs,
  clearProSchemaCache,
  normalizeProSchema,
} from "@/sectorcalc/runtime/pro-schema-loader";
import {
  getFreeToolSchema,
  listFreeToolSchemaSlugs,
  clearFreeSchemaCache,
  normalizeFreeSchema,
} from "@/sectorcalc/runtime/free-schema-loader";
import {
  assertToolSchemaIdentity,
  freezeSchemaGuard,
} from "@/sectorcalc/runtime/assert-tool-schema-identity";
import { enrichV531SchemaReferences } from "@/sectorcalc/runtime/v531-reference-enrichment";
import { isActiveTool } from "@/sectorcalc/runtime/active-tool-allowlist";
import {
  getBarisProSchema,
  clearBarisSchemaCache,
} from "@/sectorcalc/runtime/baris-schema-loader";
import { applyCertifiedFreeCalculationContract } from "@/sectorcalc/runtime/free-calculation-contract-overrides";
import { applySchemaPresentationOverrides } from "@/sectorcalc/runtime/schema-presentation-overrides";
import fs from "fs";
import path from "path";

export type ApprovedSchemaResult =
  | { ok: true; schema: SuperV4Schema; source: "pro_v531" | "free_v531" }
  | {
      ok: false;
      reason:
        | "SCHEMA_NOT_FOUND"
        | "VALIDATION_FAILED"
        | "SCHEMA_IDENTITY_MISMATCH"
        | "CAUGHT_EXCEPTION";
      errors: string[];
    };

type ResolvedSource = "pro_v531" | "free_v531";

interface CacheEntry {
  schema: SuperV4Schema;
  source: ResolvedSource;
}

const schemaCache = new Map<string, CacheEntry>();
const MAX_CACHE_SIZE = 800;

function trimCache(): void {
  if (schemaCache.size <= MAX_CACHE_SIZE) return;
  const toDelete = schemaCache.size - MAX_CACHE_SIZE;
  let deleted = 0;
  for (const key of schemaCache.keys()) {
    if (deleted >= toDelete) break;
    schemaCache.delete(key);
    deleted += 1;
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
    JSON.stringify(
      schema.unit_conversion_contract?.conversion_registry
        ? Object.keys(schema.unit_conversion_contract.conversion_registry).sort()
        : [],
    ),
  ].join("|");
  let hash = 0;
  for (let index = 0; index < payload.length; index += 1) {
    hash = ((hash << 5) - hash) + payload.charCodeAt(index);
    hash |= 0;
  }
  return `h${Math.abs(hash).toString(16)}`;
}

function cacheKey(toolKey: string, schema: SuperV4Schema): string {
  return `${toolKey}:${schema.metadata?.schema_version || "1.0.0"}:${computeSchemaHash(schema)}`;
}

export function resolveApprovedToolSchema(toolKey: string): ApprovedSchemaResult {
  if (!toolKey || typeof toolKey !== "string") {
    return {
      ok: false,
      reason: "SCHEMA_NOT_FOUND",
      errors: [`Invalid tool key: ${toolKey}`],
    };
  }
  const normalizedKey = toolKey.trim();

  if (!isActiveTool(normalizedKey)) {
    return {
      ok: false,
      reason: "SCHEMA_NOT_FOUND",
      errors: [
        `Tool is under V5.4 Core rebuild verification: ${normalizedKey}`,
      ],
    };
  }

  function buildAndCache(
    buildFn: () => SuperV4Schema,
    source: ResolvedSource,
  ): ApprovedSchemaResult {
    let superV4: SuperV4Schema;
    try {
      const built = buildFn();
      const certified = source === "free_v531"
        ? applyCertifiedFreeCalculationContract(built)
        : built;
      superV4 = applySchemaPresentationOverrides(certified);
    } catch (error: unknown) {
      return {
        ok: false,
        reason: "CAUGHT_EXCEPTION",
        errors: [
          `Build threw: ${error instanceof Error ? error.message : String(error)}`,
        ],
      };
    }

    const validation = validateSuperV4Schema(superV4);
    if (!validation.ok) {
      return {
        ok: false,
        reason: "VALIDATION_FAILED",
        errors: validation.errors,
      };
    }

    const enriched = enrichV531SchemaReferences(validation.schema);
    const frozen = freezeSchemaGuard(enriched);
    const key = cacheKey(normalizedKey, frozen);
    if (!schemaCache.has(key)) {
      schemaCache.set(key, { schema: frozen, source });
      trimCache();
    }
    return { ok: true, schema: frozen, source };
  }

  for (const [key, entry] of schemaCache.entries()) {
    if (!key.startsWith(`${normalizedKey}:`)) continue;
    const identityCheck = assertToolSchemaIdentity({
      routeToolKey: normalizedKey,
      schemaToolKey: entry.schema.tool_key,
      schemaToolId: entry.schema.tool_id,
    });
    if (!identityCheck.ok) {
      schemaCache.delete(key);
      continue;
    }
    return { ok: true, schema: entry.schema, source: entry.source };
  }

  const proSchema = getProToolSchema(normalizedKey);
  if (proSchema) return buildAndCache(() => proSchema, "pro_v531");

  const barisSchema = getBarisProSchema(normalizedKey);
  if (barisSchema) return buildAndCache(() => barisSchema, "pro_v531");

  const freeSchema = getFreeToolSchema(normalizedKey);
  if (freeSchema) return buildAndCache(() => freeSchema, "free_v531");

  clearSchemaCache();
  clearProSchemaCache();
  clearFreeSchemaCache();
  clearBarisSchemaCache();

  const proSchema2 = getProToolSchema(normalizedKey);
  if (proSchema2) return buildAndCache(() => proSchema2, "pro_v531");

  const barisSchema2 = getBarisProSchema(normalizedKey);
  if (barisSchema2) return buildAndCache(() => barisSchema2, "pro_v531");

  const freeSchema2 = getFreeToolSchema(normalizedKey);
  if (freeSchema2) return buildAndCache(() => freeSchema2, "free_v531");

  try {
    const proDir = path.join(
      process.cwd(),
      "src/sectorcalc/schemas/pro-v531",
    );
    if (fs.existsSync(proDir)) {
      for (const fileName of fs
        .readdirSync(proDir)
        .filter((file: string) => file.endsWith(".schema.json"))) {
        const raw = JSON.parse(
          fs.readFileSync(path.join(proDir, fileName), "utf8"),
        );
        if (raw.tool_key !== normalizedKey) continue;
        const schema = normalizeProSchema(raw);
        const result = validateSuperV4Schema(schema);
        if (result.ok) {
          return buildAndCache(() => result.schema, "pro_v531");
        }
      }
    }

    const freeDir = path.join(
      process.cwd(),
      "src/sectorcalc/schemas/free-v531",
    );
    if (fs.existsSync(freeDir)) {
      for (const fileName of fs
        .readdirSync(freeDir)
        .filter((file: string) => file.endsWith(".json"))) {
        const raw = JSON.parse(
          fs.readFileSync(path.join(freeDir, fileName), "utf8"),
        );
        if (raw.tool_key !== normalizedKey) continue;
        const schema = normalizeFreeSchema(raw);
        return buildAndCache(() => schema, "free_v531");
      }
    }

    const standaloneNextProDir = path.join(
      process.cwd(),
      ".next/standalone/.next/server/src/sectorcalc/schemas/pro-v531",
    );
    if (fs.existsSync(standaloneNextProDir)) {
      for (const fileName of fs
        .readdirSync(standaloneNextProDir)
        .filter((file: string) => file.endsWith(".schema.json"))) {
        const raw = JSON.parse(
          fs.readFileSync(path.join(standaloneNextProDir, fileName), "utf8"),
        );
        if (raw.tool_key !== normalizedKey) continue;
        const schema = normalizeProSchema(raw);
        const result = validateSuperV4Schema(schema);
        if (result.ok) {
          return buildAndCache(() => result.schema, "pro_v531");
        }
      }
    }
  } catch {
    // Direct file fallback failed; return the canonical not-found result below.
  }

  return {
    ok: false,
    reason: "SCHEMA_NOT_FOUND",
    errors: [`No schema found for: ${normalizedKey}`],
  };
}

export function getSchemaCacheStats(): { size: number; keys: string[] } {
  return { size: schemaCache.size, keys: [...schemaCache.keys()].slice(0, 5) };
}

export function clearSchemaCache(): void {
  schemaCache.clear();
}

export function listAllResolvableToolKeys(): string[] {
  return [...listProToolSchemaSlugs(), ...listFreeToolSchemaSlugs()];
}

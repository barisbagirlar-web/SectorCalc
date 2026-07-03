// SectorCalc V5.3.1 Canonical Schema Resolver
// Server-only. Single entry point for all tool schema resolution.
// Resolution order:
//   1. Generated Free Tool schema registry
//   2. Industrial Free Tool schema builder
//   3. Safe null for unknown tool

import type { SuperV4Schema } from "@/sectorcalc/pro-form/contract-types";
import { validateSuperV4Schema } from "@/sectorcalc/pro-form/schema-adapter";
import { getGeneratedToolSchema, listGeneratedToolSchemaSlugs } from "@/lib/features/generated-tools/schema-loader";
import { buildIndustrialFreeToolSchema, isIndustrialFreeToolSlug } from "@/lib/features/tools/industrial-free-schema-factory";
import { industrialFormulaTools } from "@/lib/features/tools/revenue-tools-industrial-formulas";
import { generatedToolSchemaToSuperV4Schema } from "@/sectorcalc/pro-form/generated-tool-to-superv4-adapter";

export type ApprovedSchemaResult =
  | { ok: true; schema: SuperV4Schema; source: "generated_free" | "industrial_free" }
  | { ok: false; reason: "SCHEMA_NOT_FOUND" | "VALIDATION_FAILED"; errors: string[] };

/**
 * Resolve and validate a tool schema to the approved V5.3.1 SuperV4Schema format.
 *
 * Resolution order:
 *   1. Generated Free Tool schema (generated/schemas/*.json)
 *   2. Industrial Free Tool schema builder (runtime-built from revenue-tools-industrial-formulas)
 *   3. Safe null for unknown tool
 *
 * Every returned schema is validated against the strict V5.3.1 contract
 * (top-level keys, input structure, formula safety, etc.).
 */
export function resolveApprovedToolSchema(toolKey: string): ApprovedSchemaResult {
  // 1. Generated Free Tool schema
  const genSchema = getGeneratedToolSchema(toolKey);
  if (genSchema) {
    const superV4 = generatedToolSchemaToSuperV4Schema(genSchema, toolKey);
    const validation = validateSuperV4Schema(superV4);
    if (!validation.ok) {
      return {
        ok: false,
        reason: "VALIDATION_FAILED",
        errors: validation.errors,
      };
    }
    return {
      ok: true,
      schema: validation.schema,
      source: "generated_free",
    };
  }

  // 2. Industrial Free Tool schema builder
  if (isIndustrialFreeToolSlug(toolKey)) {
    const indSchema = buildIndustrialFreeToolSchema(toolKey);
    if (indSchema) {
      const superV4 = generatedToolSchemaToSuperV4Schema(indSchema, toolKey);
      const validation = validateSuperV4Schema(superV4);
      if (!validation.ok) {
        return {
          ok: false,
          reason: "VALIDATION_FAILED",
          errors: validation.errors,
        };
      }
      return {
        ok: true,
        schema: validation.schema,
        source: "industrial_free",
      };
    }
  }

  // 3. Unknown tool
  return {
    ok: false,
    reason: "SCHEMA_NOT_FOUND",
    errors: [`No schema found for tool key: ${toolKey}`],
  };
}

/**
 * List all known tool keys that can be resolved.
 */
export function listAllResolvableToolKeys(): string[] {
  const genSlugs = listGeneratedToolSchemaSlugs();
  const indSlugs = industrialFormulaTools
    .map((t) => t.freeSlug)
    .filter((s): s is string => Boolean(s));

  return [...new Set([...genSlugs, ...indSlugs])];
}

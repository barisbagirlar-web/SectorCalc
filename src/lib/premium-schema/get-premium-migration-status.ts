import type { FormulaFamilyId } from "@/lib/premium-schema/formula-families";
import {
  PREMIUM_MIGRATION_MAP,
  type PremiumMigrationMapItem,
  type PremiumMigrationStatus,
} from "@/lib/premium-schema/premium-migration-map";

export interface PremiumMigrationStatusResult {
  readonly legacySlug: string;
  readonly status: PremiumMigrationStatus;
  readonly item: PremiumMigrationMapItem | null;
  /** Relative app path for schema pilot route, e.g. /tools/premium-schema/cnc-oee-loss */
  readonly schemaRoutePath: string | null;
  readonly schemaSlug: string | null;
}

export function getPremiumMigrationStatus(legacySlug: string): PremiumMigrationStatusResult {
  const item =
    PREMIUM_MIGRATION_MAP.find((entry) => entry.legacySlug === legacySlug) ?? null;

  if (!item) {
    return {
      legacySlug,
      status: "legacy",
      item: null,
      schemaRoutePath: null,
      schemaSlug: null,
    };
  }

  const schemaSlug = item.schemaSlug ?? null;
  const hasSchemaRoute =
    schemaSlug !== null &&
    (item.status === "schema_pilot" ||
      item.status === "schema_ready" ||
      item.status === "migrated");

  return {
    legacySlug,
    status: item.status,
    item,
    schemaSlug,
    schemaRoutePath: hasSchemaRoute ? `/tools/premium-schema/${schemaSlug}` : null,
  };
}

export function listSchemaPilotSlugs(): readonly string[] {
  return PREMIUM_MIGRATION_MAP.filter(
    (entry) => entry.status === "schema_pilot" && entry.schemaSlug
  ).map((entry) => entry.schemaSlug as string);
}

export function isSchemaPilotFamily(family: FormulaFamilyId): boolean {
  return PREMIUM_MIGRATION_MAP.some(
    (entry) => entry.status === "schema_pilot" && entry.family === family
  );
}

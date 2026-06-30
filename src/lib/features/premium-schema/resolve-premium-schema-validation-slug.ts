import { PREMIUM_SCHEMA_SLUG_MAP } from "@/lib/features/premium-schema/schema-registry";

/** Resolve legacy paid slug → canonical schema id for validation/oracle lookups. */
export function resolvePremiumSchemaValidationSlug(slug: string): string {
  return PREMIUM_SCHEMA_SLUG_MAP[slug] ?? slug;
}

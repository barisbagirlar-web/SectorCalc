import { getGeneratedToolSchema } from "@/lib/generated-tools/schema-loader";
import { getMigrationMapItem } from "@/lib/premium-schema/premium-migration-map";

function uniqueCandidates(routeSlug: string): readonly string[] {
  const normalized = routeSlug.replace(/-premium$/, "");
  const candidates = [routeSlug, normalized];

  const migration = getMigrationMapItem(routeSlug) ?? getMigrationMapItem(normalized);
  if (migration?.schemaSlug) {
    candidates.push(migration.schemaSlug);
  }

  return [...new Set(candidates.filter(Boolean))];
}

/** Resolve a /tools/premium/[slug] or legacy paid slug to a generated schema slug. */
export function resolveGeneratedToolRouteSlug(routeSlug: string): string | null {
  for (const candidate of uniqueCandidates(routeSlug)) {
    if (getGeneratedToolSchema(candidate)) {
      return candidate;
    }
  }
  return null;
}

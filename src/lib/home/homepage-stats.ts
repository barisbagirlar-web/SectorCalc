import { industryRegistry } from "@/lib/tools/industry-registry";

/** Live sector-area count for homepage copy (industry registry). */
export function getHomepageSectorAreaCount(): number {
  return industryRegistry.length;
}

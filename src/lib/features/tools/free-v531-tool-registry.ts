import "server-only";
import { getFreeToolSchema, listFreeToolSchemaSlugs } from "@/sectorcalc/runtime/free-schema-loader";

let _cachedFreeSlugs: string[] | null = null;

export function getFreeV531Slugs(): string[] {
  if (!_cachedFreeSlugs) {
    _cachedFreeSlugs = listFreeToolSchemaSlugs();
  }
  return _cachedFreeSlugs;
}

export function isFreeV531ToolSlug(slug: string): boolean {
  return getFreeV531Slugs().includes(slug);
}

export function getFreeV531Schema(slug: string) {
  return getFreeToolSchema(slug);
}

export function refreshFreeV531Cache(): void {
  _cachedFreeSlugs = null;
}

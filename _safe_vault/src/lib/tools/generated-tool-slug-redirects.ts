import redirects from "../../../config/generated-tool-slug-redirects.json";
import { generatedToolPathForSlug } from "@/lib/tools/calculator-slug-policy";

type GeneratedToolSlugRedirectMap = Readonly<Record<string, string>>;

const GENERATED_TOOL_SLUG_REDIRECTS = redirects as GeneratedToolSlugRedirectMap;

const GENERATED_TOOL_ROUTE_PATTERN =
  /^\/tools\/generated\/([^/]+?)(?:\.html)?\/?$/;

export function getGeneratedToolSlugRedirectMap(): GeneratedToolSlugRedirectMap {
  return GENERATED_TOOL_SLUG_REDIRECTS;
}

export function resolveGeneratedToolSlugRedirect(slug: string): string | null {
  const normalized = slug.trim().replace(/\.html$/i, "");
  if (!normalized) {
    return null;
  }
  const target = GENERATED_TOOL_SLUG_REDIRECTS[normalized];
  return target && target !== normalized ? target : null;
}

/** Migrate `/tools/generated/{slug}` when slug was renamed for SEO. */
export function migrateGeneratedToolSlugPath(pathname: string): string | null {
  const match = pathname.match(GENERATED_TOOL_ROUTE_PATTERN);
  if (!match?.[1]) {
    return null;
  }
  const targetSlug = resolveGeneratedToolSlugRedirect(match[1]);
  if (!targetSlug) {
    return null;
  }
  return generatedToolPathForSlug(targetSlug);
}

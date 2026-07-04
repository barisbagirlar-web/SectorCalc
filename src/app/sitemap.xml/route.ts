// SectorCalc — Root-only /sitemap.xml
// Uses existing manifest + XML builder from lib.
// No locale prefixes. Single canonical host: https://sectorcalc.com

import { getSitemapManifest } from "@/lib/infrastructure/seo/sitemap-manifest";
import { buildSitemapXmlResponse } from "@/lib/infrastructure/seo/sitemap-generator-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const manifest = getSitemapManifest();
  return buildSitemapXmlResponse(manifest);
}

// SectorCalc — Sitemap Index (type-split architecture)
// Returns sitemap index referencing tools.xml, guides.xml, datasets.xml,
// categories.xml. faq.xml retired (empty / no exclusive FAQ routes).
// Lastmod: resolved from source-file mtime, never request-time.

import { NextResponse } from "next/server";
import { buildSitemapIndexXml } from "@/lib/infrastructure/seo/sitemap-index-generator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const xml = buildSitemapIndexXml();

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

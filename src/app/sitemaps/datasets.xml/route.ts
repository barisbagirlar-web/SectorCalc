import { NextResponse } from "next/server";
import { buildSubSitemapXml } from "@/lib/infrastructure/seo/sitemap-index-generator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const now = new Date();
  const xml = buildSubSitemapXml("datasets", now);

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

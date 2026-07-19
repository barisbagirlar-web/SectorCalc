import { NextResponse } from "next/server";
import {
  buildSubSitemapXml,
  createSitemapLastmodResolver,
  getCaseStudyLastModMap,
} from "@/lib/infrastructure/seo/sitemap-index-generator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const caseStudyLastMod = await getCaseStudyLastModMap();
  const resolver = createSitemapLastmodResolver(caseStudyLastMod);
  const xml = buildSubSitemapXml("faq", resolver);

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

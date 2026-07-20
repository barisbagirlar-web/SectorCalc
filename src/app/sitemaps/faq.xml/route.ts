import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Empty FAQ sub-sitemap retired from the sitemap index (see SUB_SITEMAPS).
 * Keep this route as an explicit 404 so stale GSC references fail closed
 * instead of advertising zero URLs.
 */
export async function GET(): Promise<NextResponse> {
  return new NextResponse("Not Found", {
    status: 404,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "public, max-age=300",
    },
  });
}

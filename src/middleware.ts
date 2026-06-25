import { type NextRequest, NextResponse } from "next/server";
import { REGION_COOKIE, REGION_HEADER, REGION_SOURCE_HEADER } from "@/config/regions";
import { detectRegionFromRequest } from "@/lib/compliance/detect-region";

function applyRegionHeaders(response: NextResponse, request: NextRequest): NextResponse {
  const { region, source } = detectRegionFromRequest(request);
  response.headers.set(REGION_HEADER, region);
  response.headers.set(REGION_SOURCE_HEADER, source);
  response.cookies.set(REGION_COOKIE, region, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

export default function middleware(request: NextRequest) {
  const urlPath = request.nextUrl.pathname;
  
  // Strip out any legacy locale prefixes (e.g. /tr, /de, /fr, /es, /ar, /en)
  const langMatch = urlPath.match(/^\/(tr|de|fr|es|ar|en)(\/|$)(.*)/);
  if (langMatch) {
    const url = request.nextUrl.clone();
    url.pathname = '/' + (langMatch[3] || '');
    return NextResponse.redirect(url, 301);
  }

  return applyRegionHeaders(NextResponse.next(), request);
}

export const config = {
  matcher: [
    "/",
    "/((?!admin|api|_next|_vercel|.*\\..*).*)",
  ],
};

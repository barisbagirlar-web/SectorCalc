import { type NextRequest, NextResponse } from "next/server";
import { REGION_HEADER, REGION_SOURCE_HEADER } from "@/config/regions";
import { detectRegionFromRequest } from "@/lib/compliance/detect-region";

/**
 * NOTE: Region cookie (sc-region) is intentionally NOT set here.
 * Setting it would add `cookie` to the `Vary` response header,
 * causing CDN (Fastly) to fragment the cache by cookie value.
 * The region is already derivable from the URL locale path (/tr, /en).
 * Manual override is handled client-side via sc-region-manual cookie.
 */
function applyRegionHeaders(response: NextResponse, request: NextRequest): NextResponse {
  const { region, source } = detectRegionFromRequest(request);
  response.headers.set(REGION_HEADER, region);
  response.headers.set(REGION_SOURCE_HEADER, source);

  // Strip `cookie` from Vary: we don't vary by cookie value, only by URL path.
  // Next.js auto-adds `Vary: cookie` when middleware reads request.cookies,
  // but our region resolution is URL-path-based + geo headers, not cookie-dependent.
  const vary = response.headers.get("vary");
  if (vary) {
    const filtered = vary
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v.toLowerCase() !== "cookie")
      .join(", ");
    response.headers.set("vary", filtered);
  }

  return response;
}

const SW_KILL_CODE = `self.addEventListener("install",()=>self.skipWaiting());self.addEventListener("activate",(e)=>{e.waitUntil(self.clients.claim().then(()=>self.registration.unregister()))});self.addEventListener("fetch",()=>{});`;
const SW_KILL_HEADERS = {
  "Content-Type": "application/javascript",
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  "Service-Worker-Allowed": "/",
  "Pragma": "no-cache",
  "Expires": "0",
};

export default function middleware(request: NextRequest) {
  // Dev: intercept /sw.js and return self-destruct code with no-cache headers
  // This runs BEFORE any registered service worker, so old SW cannot cache it
  if (request.nextUrl.pathname === "/sw.js") {
    return new NextResponse(SW_KILL_CODE, { headers: SW_KILL_HEADERS });
  }

  return applyRegionHeaders(NextResponse.next(), request);
}

export const config = {
  matcher: [
    "/",
    "/sw.js",
    "/((?!admin|api|_next|_vercel|.*\\..*).*)",
  ],
};

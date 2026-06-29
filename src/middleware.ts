import { type NextRequest, NextResponse } from "next/server";
import { REGION_HEADER, REGION_SOURCE_HEADER } from "@/config/regions";
import { detectRegionFromRequest } from "@/lib/compliance/detect-region";

/**
 * NOTE: Does NOT read `request.cookies` — reading cookies would cause
 * Next.js to add `Vary: cookie` to the response, fragmenting CDN cache.
 * Region is resolved from URL path (/tr, /en) + CDN geo headers.
 * Manual cookie override is handled in Server Components via getServerRegion().
 */
function applyRegionHeaders(response: NextResponse, request: NextRequest): NextResponse {
  const { region, source } = detectRegionFromRequest(request);
  response.headers.set(REGION_HEADER, region);
  response.headers.set(REGION_SOURCE_HEADER, source);
  return response;
}

/** Aggressive SW kill: wipe ALL caches, unregister immediately, reload all tabs. */
const SW_KILL_CODE = [
  `self.addEventListener("install",()=>self.skipWaiting())`,
  `self.addEventListener("activate",(e)=>{e.waitUntil((async()=>{const k=await caches.keys();await Promise.all(k.map(c=>caches.delete(c)));await self.clients.claim();await self.registration.unregister();(await self.clients.matchAll({type:"window"})).forEach(c=>c.navigate(c.url))})())})`,
  `self.addEventListener("fetch",()=>{})`,
].join(";");
const SW_KILL_HEADERS = {
  "Content-Type": "application/javascript",
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  "Service-Worker-Allowed": "/",
  "Pragma": "no-cache",
  "Expires": "0",
};

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Dev: intercept /sw.js and return self-destruct code with no-cache headers
  if (pathname === "/sw.js") {
    return new NextResponse(SW_KILL_CODE, { headers: SW_KILL_HEADERS });
  }

  // EN-only: rewrite OLD locale-prefixed paths (from cached geo redirects) to /en/*
  // e.g. /tr/en → /en, /tr/free-tools → /en/free-tools, /de → /en
  // This handles the case where a user's browser still has the old geo-locale
  // bootstrap script cached and gets redirected to /<locale>/...
  if (pathname.startsWith("/tr") || pathname.startsWith("/de") || pathname.startsWith("/fr") || pathname.startsWith("/es") || pathname.startsWith("/ar")) {
    const rest = pathname.slice(3); // strip "/tr", "/de", etc.
    const url = request.nextUrl.clone();
    if (!rest || rest === "/" || rest.startsWith("/en")) {
      url.pathname = "/en";
    } else {
      url.pathname = `/en${rest}`;
    }
    return applyRegionHeaders(NextResponse.rewrite(url), request);
  }

  // Rewrite non-prefixed paths to /en/* so [locale] route group works.
  // Root / is NOT rewritten — src/app/page.tsx serves English directly.
  if (pathname !== "/" && !pathname.startsWith("/en")) {
    const url = request.nextUrl.clone();
    url.pathname = `/en${pathname}`;
    return applyRegionHeaders(NextResponse.rewrite(url), request);
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

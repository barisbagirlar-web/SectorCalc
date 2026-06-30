import { type NextRequest, NextResponse } from "next/server";
import { REGION_HEADER, REGION_SOURCE_HEADER } from "@/config/regions";
import { detectRegionFromRequest } from "@/lib/features/compliance/detect-region";

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

  // SADECE sectorcalc.com/path — hiçbir locale prefix kabul edilmez.
  // Eski locale path'leri (ör. /tr/en, /tr, /de, /fr, /es, /ar) kalıcı
  // olarak /'e yönlendir. Bunlar artık geçerli değil.
  // NOT: Tam path segment bazında kontrol (ör. /free-tools /fr ile başlamaz)
  const localePrefixes = ["/tr", "/de", "/fr", "/es", "/ar", "/en"];
  const hasLocalePrefix = localePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );
  if (hasLocalePrefix) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return applyRegionHeaders(NextResponse.redirect(url, 308), request);
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

import { type NextRequest, NextResponse } from "next/server";
import { REGION_HEADER, REGION_SOURCE_HEADER } from "@/config/regions";
import { detectRegionFromRequest } from "@/lib/features/compliance/detect-region";

function applyRegionHeaders(response: NextResponse, request: NextRequest): NextResponse {
  const { region, source } = detectRegionFromRequest(request);
  response.headers.set(REGION_HEADER, region);
  response.headers.set(REGION_SOURCE_HEADER, source);
  return response;
}

const SW_KILL_CODE = [
  `self.addEventListener("install",()=>self.skipWaiting())`,
  `self.addEventListener("activate",(e)=>{e.waitUntil((async()=>{const k=await caches.keys();await Promise.all(k.map(c=>caches.delete(c)));await self.clients.claim();await self.registration.unregister();(await self.clients.matchAll({type:"window"})).forEach(c=>c.navigate(c.url))})())})`,
  `self.addEventListener("fetch",()=>{})`,
].join(";");

const SW_KILL_HEADERS = {
  "Content-Type": "application/javascript",
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  "Service-Worker-Allowed": "/",
  Pragma: "no-cache",
  Expires: "0",
};

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/sitemap/")) {
    return new Response("Gone", {
      status: 410,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "x-robots-tag": "noindex, nofollow",
      },
    });
  }

  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return applyRegionHeaders(NextResponse.next(), request);
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return new Response("Gone", {
      status: 410,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "x-sectorcalc-route-policy": "root-only-no-en-prefix",
        "x-robots-tag": "all",
      },
    });
  }

  if (pathname === "/sw.js") {
    return new NextResponse(SW_KILL_CODE, { headers: SW_KILL_HEADERS });
  }

  if (pathname.includes(".")) {
    return applyRegionHeaders(NextResponse.next(), request);
  }

  const legacyLocalePrefixes = ["/tr", "/de", "/fr", "/es", "/ar"];
  const hasLegacyLocalePrefix = legacyLocalePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (hasLegacyLocalePrefix) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return applyRegionHeaders(NextResponse.redirect(url, 308), request);
  }

  return applyRegionHeaders(NextResponse.next(), request);
}

export const config = {
  matcher: [
    "/",
    "/sw.js",
    "/sitemap/:path*",
    "/((?!admin|api|_next|_vercel|.*\\..*).*)",
  ],
};

import { type NextRequest, NextResponse } from "next/server";
import { REGION_HEADER, REGION_SOURCE_HEADER } from "@/config/regions";
import { detectRegionFromRequest } from "@/lib/features/compliance/detect-region";

const PROTECTED_ROUTES = ["/account", "/account/", "/dashboard", "/dashboard/"];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function annotateAuthGate(request: NextRequest, response: NextResponse): void {
  if (!isProtectedRoute(request.nextUrl.pathname)) return;
  const sessionCookie = request.cookies.get("__session")?.value;
  if (!sessionCookie) {
    response.headers.set("x-auth-gate", "challenge");
  }
}

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

  const response = NextResponse.next();
  annotateAuthGate(request, response);

  if (pathname === '/en' || pathname.startsWith('/en/')) {
    return new NextResponse("Not Found", { status: 404 });
  }

  if (response.headers.get("x-auth-gate") === "challenge") {
    return applyRegionHeaders(response, request);
  }

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

  if (pathname === "/sw.js") {
    return new NextResponse(SW_KILL_CODE, { headers: SW_KILL_HEADERS });
  }

  if (pathname.includes(".")) {
    return applyRegionHeaders(NextResponse.next(), request);
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

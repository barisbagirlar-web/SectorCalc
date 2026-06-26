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

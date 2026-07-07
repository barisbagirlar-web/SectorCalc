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

/**
 * Known ISO 639-1 locale paths at root level — return 404.
 * These are not active routes; they exist only as legacy/misguided URL patterns.
 */
const LEGACY_LOCALE_ROUTES = new Set([
  "/en", "/tr", "/de", "/fr", "/es", "/ar",
  "/ru", "/zh", "/ja", "/ko", "/pt", "/it",
  "/nl", "/pl", "/sv", "/da", "/fi", "/nb",
  "/cs", "/hu", "/ro", "/uk", "/el", "/he",
  "/hi", "/th", "/vi", "/id", "/ms",
]);

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

// ── Rate limiter (defense-in-depth: POST-only, never GET/RSC) ────────────────

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30;  // 30 POST requests per minute per IP
const rateLimitMap = new Map<string, number[]>();

// Clean stale entries every 5 minutes
let lastCleanup = Date.now();
const CLEANUP_INTERVAL_MS = 300_000;

function cleanupRateLimitMap(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  const cutoff = now - RATE_LIMIT_WINDOW_MS * 2;
  for (const [key, timestamps] of rateLimitMap) {
    const recent = timestamps.filter((t) => t > cutoff);
    if (recent.length === 0) {
      rateLimitMap.delete(key);
    } else {
      rateLimitMap.set(key, recent);
    }
  }
}

/**
 * Sliding-window rate limit check per IP.
 * Returns true if request is allowed, false if rate-limited.
 */
function isBelowRateLimit(ip: string): boolean {
  cleanupRateLimitMap();
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const timestamps = rateLimitMap.get(ip) ?? [];
  const recent = timestamps.filter((t) => t > windowStart);

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  recent.push(now);
  rateLimitMap.set(ip, recent);
  return true;
}

/**
 * RSC / public navigation requests must NEVER receive 429.
 * Only POST to non-API expensive endpoints is rate-limited here.
 */
function shouldSkipRateLimit(request: NextRequest): boolean {
  // Method check: never rate-limit GET, HEAD, OPTIONS
  const method = request.method;
  if (method !== "POST") return true;

  // RSC prefetch requests must never be rate-limited
  if (request.nextUrl.searchParams.has("_rsc")) return true;

  // Static / assets / sitemap / robots / favicon
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/api")) return true;
  if (pathname.startsWith("/admin")) return true;
  if (pathname.startsWith("/sitemap")) return true;
  if (pathname === "/robots.txt" || pathname === "/favicon.ico") return true;
  if (pathname === "/sw.js") return true;
  if (pathname.includes(".")) return true;

  // Tool page routes: public GET navigation must not be rate-limited
  // Note: these normally arrive as GET, but defense-in-depth also covers POST
  if (pathname.startsWith("/tools/pro/")) return true;
  if (pathname.startsWith("/tools/free/")) return true;

  // CBAM service and verification pages
  if (pathname.startsWith("/cbam")) return true;
  if (pathname.startsWith("/verify")) return true;
  if (pathname.startsWith("/api/cbam/entitlement")) return true;

  // Public listing / catalog pages
  if (pathname === "/") return true;
  if (pathname === "/pro-tools") return true;
  if (pathname === "/free-tools") return true;
  if (pathname === "/pricing") return true;
  if (pathname === "/industries") return true;

  return false;
}

// ── Middleware ────────────────────────────────────────────────────────────────

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── www → non-www canonical redirect (Firebase SSR host match fix) ──
  const host = request.headers.get("host") ?? "";
  if (host === "www.sectorcalc.com" || host.startsWith("www.")) {
    const url = new URL(request.url);
    url.host = "sectorcalc.com";
    return NextResponse.redirect(url, 301);
  }

  // ── Defense-in-depth: rate limit POST to non-API expensive endpoints ──
  // Public GET/RSC navigation is always exempt (shouldSkipRateLimit returns true for those).
  if (!shouldSkipRateLimit(request)) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "127.0.0.1";

    if (!isBelowRateLimit(ip)) {
      return new NextResponse(
        JSON.stringify({ error: "Too many requests. Please slow down." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "60",
            "x-ratelimit-policy": "post-only",
          },
        },
      );
    }
  }

  const response = NextResponse.next();
  annotateAuthGate(request, response);

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

  // Legacy locale-only paths at root — return 404
  if (LEGACY_LOCALE_ROUTES.has(pathname)) {
    return new Response("Not Found", {
      status: 404,
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

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
 * Inject HTTP Link: <...>; rel="canonical" header (§3 MIL-STD SSOT).
 * This is the HTTP-level canonical declaration, complementing the DOM <head>
 * canonical (metadata.ts) and sitemap <loc> (sitemap-index-generator.ts).
 * All 3 SSOT components must agree.
 */
function applyCanonicalLinkHeader(response: NextResponse, request: NextRequest): void {
  const url = new URL(request.url);
  // Strip query params from the canonical URL (query params vary, canonical is bare path)
  const canonical = `${url.protocol}//${url.host}${url.pathname}`.replace(/\/+$/, "") || `${url.protocol}//${url.host}`;
  response.headers.set("Link", `<${canonical}>; rel="canonical"`);
}

function applyStandardHeaders(response: NextResponse, request: NextRequest): NextResponse {
  applyCanonicalLinkHeader(response, request);
  return applyRegionHeaders(response, request);
}

/**
 * Supported hreflang locales — /en, /tr, /de, /ar are active locale routes
 * that internally rewrite to bare paths (English content).
 * Other ISO 639-1 paths return 404 (unsupported locales).
 */
const SUPPORTED_HREFLANG_LOCALES = new Set(["en", "tr", "de", "ar"]);

const LEGACY_LANGUAGE_ROUTES = new Set([
  "/fr", "/es", "/ru", "/zh", "/ja", "/ko", "/pt", "/it",
  "/nl", "/pl", "/sv", "/da", "/fi", "/nb",
  "/cs", "/hu", "/ro", "/uk", "/el", "/he",
  "/hi", "/th", "/vi", "/id", "/ms",
]);

// ── Service Worker Kill (cache invalidation) ────────────────────────────────
// SW_KILL_VERSION: bump to force all clients to re-fetch the kill SW.
// Date-based version ensures deterministic cache-busting on every deploy.
const SW_KILL_VERSION = "2026-07-19-v2";

// Kill SW code — no reload loop. Installs, deletes all caches, claims clients,
// unregisters silently. No clients.navigate() — avoids infinite reload.
// Any stale JS chunks already loaded are cleaned on the NEXT navigation.
const SW_KILL_CODE = [
  `self.addEventListener("install",()=>self.skipWaiting())`,
  `self.addEventListener("activate",(e)=>{e.waitUntil((async()=>{const k=await caches.keys();await Promise.all(k.map(c=>caches.delete(c)));await self.clients.claim();await self.registration.unregister()})())})`,
  `self.addEventListener("fetch",()=>{})`,
  `// ${SW_KILL_VERSION}`,
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
    return applyStandardHeaders(response, request);
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

  // ── Sub-sitemaps: /sitemaps/tools.xml, /sitemaps/guides.xml, etc. ──
  // These are active index-mandated sub-sitemap routes.

  // ── Legacy singular /guide/ → /guides/ redirect ──
  if (pathname.startsWith("/guide/")) {
    const url = new URL(request.url);
    url.pathname = pathname.replace(/^\/guide\//, "/guides/");
    return NextResponse.redirect(url, 301);
  }

  // ── Legacy free-tool URL structure → canonical route (301) ──
  // Old/indexed URLs used /free-tools/{category}/{slug}; the live route is
  // /tools/free/{slug}. Strip the category segment and redirect to canonical.
  // (The /free-tools listing page and single-segment paths are untouched.)
  if (pathname.startsWith("/free-tools/")) {
    const segments = pathname.split("/").filter(Boolean); // ["free-tools", category, slug, ...]
    if (segments.length >= 3) {
      const slug = segments[segments.length - 1];
      const url = new URL(request.url);
      url.pathname = `/tools/free/${slug}`;
      return NextResponse.redirect(url, 301);
    }
  }

  // ── Hreflang locale routing: /en/..., /tr/..., /de/..., /ar/... ──
  // Internally rewrite to bare path. English content served under all prefixes.
  // /en/ is indexable (x-default). /tr/, /de/, /ar/ are noindex until translations exist
  // — serving English content under non-EN hreflang is a duplicate-content trap.
  // VETO 1 fix: only /en/ gets "index"; non-EN locales get "noindex, follow".
  const localeMatch = pathname.match(/^\/(en|tr|de|ar)(\/.*)?$/);
  if (localeMatch) {
    const locale = localeMatch[1];
    const subPath = localeMatch[2] ?? "/";
    const url = new URL(request.url);
    url.pathname = subPath;

    const response = NextResponse.rewrite(url);
    response.headers.set("x-hreflang-locale", locale);
    const robotsDirective = locale === "en" ? "index, follow" : "noindex, follow";
    response.headers.set("x-robots-tag", robotsDirective);
    return applyStandardHeaders(response, request);
  }

  // Root-level language-only paths — return 404
  if (LEGACY_LANGUAGE_ROUTES.has(pathname)) {
    return new Response("Not Found", {
      status: 404,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "x-robots-tag": "noindex, nofollow",
      },
    });
  }

  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return applyStandardHeaders(NextResponse.next(), request);
  }

  if (pathname === "/sw.js") {
    return new NextResponse(SW_KILL_CODE, { headers: SW_KILL_HEADERS });
  }

  if (pathname.includes(".")) {
    return applyStandardHeaders(NextResponse.next(), request);
  }

  return applyStandardHeaders(NextResponse.next(), request);
}

export const config = {
  matcher: [
    "/",
    "/sw.js",
    "/sitemap/:path*",
    "/sitemaps/:path*",
    "/en",
    "/en/:path*",
    "/tr",
    "/tr/:path*",
    "/de",
    "/de/:path*",
    "/ar",
    "/ar/:path*",
    "/((?!admin|api|_next|_vercel|.*\\..*).*)",
  ],
};

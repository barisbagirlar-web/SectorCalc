import { type NextRequest, NextResponse } from "next/server";
import { REGION_HEADER, REGION_SOURCE_HEADER } from "@/config/regions";
import { detectRegionFromRequest } from "@/lib/features/compliance/detect-region";
import {
  X_ROBOTS_TAG_HEADER,
  xRobotsTagValue,
} from "@/lib/infrastructure/seo/seo-indexing-control";
import { ACTIVE_FREE_TOOL_SLUGS } from "@/sectorcalc/runtime/active-tool-allowlist";

/**
 * Hardcoded public origin for Link/canonical — NEVER derive from request.url
 * or NEXT_PUBLIC_SITE_URL. Firebase SSR binds to 0.0.0.0:8080 and may inject
 * that address into env; leaking it into Link headers causes dilution.
 */
const PUBLIC_SITE_ORIGIN = "https://sectorcalc.com";

/** Request header read by root layout to keep DOM <meta robots> in sync. */
const SC_ROBOTS_REQUEST_HEADER = "x-sc-robots-policy";

const PROTECTED_ROUTES = ["/account", "/account/", "/dashboard", "/dashboard/"];

/** Industry registry slugs — middleware hard-404 for anything else. */
const ACTIVE_INDUSTRY_SLUGS = new Set<string>([
  "cnc-manufacturing",
  "construction",
  "cleaning",
  "restaurant",
  "ecommerce",
  "welding-fabrication",
  "hvac",
  "electrical-contracting",
  "landscaping-lawn-care",
  "auto-repair-shop",
  "printing-signage",
  "plumbing",
  "carpentry-millwork",
  "roofing",
  "painting",
  "sheet-metal",
  "3d-printing-service",
  "logistics-transport",
  "agriculture-crops",
  "agriculture-irrigation",
  "agriculture-feed",
  "agriculture-dairy",
  "energy-consumption",
  "energy-carbon",
  "daily-renovation",
  "daily-fuel",
  "daily-meals",
]);

/** Free-tool allowlist — middleware hard-404 for unknown/quarantined slug variants. */
const ACTIVE_FREE_TOOL_SLUG_SET = new Set<string>(ACTIVE_FREE_TOOL_SLUGS);

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
 * Resolve the client-facing hostname for robots decisions.
 * Firebase Hosting → Cloud Run rewrites often leave `Host` as *.run.app /
 * *.web.app / 0.0.0.0. The public hostname is carried in
 * `x-fh-requested-host` / `x-forwarded-host`. Prefer a public production
 * host if ANY candidate matches; only then fall back to preview/internal.
 */
function listClientHosts(request: NextRequest): string[] {
  const raw = [
    request.headers.get("x-fh-requested-host"),
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim(),
    request.headers.get("host"),
    request.nextUrl.host,
  ];
  const out: string[] = [];
  for (const value of raw) {
    const host = (value ?? "").trim().toLowerCase().split(":")[0] ?? "";
    if (host.length > 0 && !out.includes(host)) out.push(host);
  }
  return out;
}

function resolveClientHost(request: NextRequest): string {
  const hosts = listClientHosts(request);
  const publicHost = hosts.find((h) => isPublicSiteHost(h));
  if (publicHost) return publicHost;
  return hosts[0] ?? "";
}

function shouldNoindexHost(request: NextRequest): boolean {
  const hosts = listClientHosts(request);
  // Production custom domain always wins.
  if (hosts.some((h) => isPublicSiteHost(h))) return false;

  // Explicit preview / local mirrors only — NOT *.run.app (that is the
  // Firebase Hosting SSR rewrite target for production custom domains too).
  const isExplicitPreview = hosts.some(
    (h) =>
      h.endsWith(".web.app") ||
      h.endsWith(".firebaseapp.com") ||
      h === "0.0.0.0" ||
      h === "127.0.0.1" ||
      h === "localhost",
  );
  return isExplicitPreview;
}

function isPublicSiteHost(host: string): boolean {
  return host === "sectorcalc.com" || host === "www.sectorcalc.com";
}

function normalizePathname(pathname: string): string {
  if (pathname !== "/" && pathname.endsWith("/")) {
    return pathname.replace(/\/+$/, "") || "/";
  }
  return pathname || "/";
}

function publicCanonicalFor(pathname: string): string {
  const normalized = normalizePathname(pathname);
  // Match createPageMetadata: root has no trailing slash.
  return normalized === "/" ? PUBLIC_SITE_ORIGIN : `${PUBLIC_SITE_ORIGIN}${normalized}`;
}

/**
 * Inject HTTP Link: <...>; rel="canonical" locked to PUBLIC_SITE_ORIGIN.
 * Never use request.url host — Firebase SSR binds to 0.0.0.0.
 */
function applyCanonicalLinkHeader(response: NextResponse, request: NextRequest): void {
  const canonical = publicCanonicalFor(request.nextUrl.pathname || "/");
  // Preserve any existing non-canonical Link values (font preloads, etc.).
  const existing = response.headers.get("Link");
  const canonicalPart = `<${canonical}>; rel="canonical"`;
  if (!existing) {
    response.headers.set("Link", canonicalPart);
    return;
  }
  const parts = existing
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p.length > 0 && !/rel=["']?canonical["']?/i.test(p));
  parts.unshift(canonicalPart);
  response.headers.set("Link", parts.join(", "));
}

function applyRobotsHeader(
  response: NextResponse,
  request: NextRequest,
  options?: { forceNoindex?: boolean },
): void {
  if (options?.forceNoindex || shouldNoindexHost(request)) {
    // Preview / non-public hosts / explicit 404 — never indexable.
    // follow kept so link equity can still flow to the canonical domain.
    response.headers.set(X_ROBOTS_TAG_HEADER, "noindex, follow");
    return;
  }
  response.headers.set(X_ROBOTS_TAG_HEADER, xRobotsTagValue());
}

function applyStandardHeaders(
  response: NextResponse,
  request: NextRequest,
  options?: { forceNoindex?: boolean },
): NextResponse {
  // Never self-canonicalize 404/410/noindex responses — Google treats that as
  // an indexable URL signal even when status is 404.
  if (!options?.forceNoindex) {
    applyCanonicalLinkHeader(response, request);
  }
  applyRobotsHeader(response, request, options);
  return applyRegionHeaders(response, request);
}

function buildPassThroughHeaders(request: NextRequest): Headers {
  const requestHeaders = new Headers(request.headers);
  const policy = shouldNoindexHost(request) ? "noindex" : "index";
  requestHeaders.set(SC_ROBOTS_REQUEST_HEADER, policy);
  return requestHeaders;
}

function nextWithRobotsPolicy(request: NextRequest): NextResponse {
  return NextResponse.next({
    request: { headers: buildPassThroughHeaders(request) },
  });
}

function notFoundResponse(request: NextRequest): NextResponse {
  const response = new NextResponse("Not Found", {
    status: 404,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
  return applyStandardHeaders(response, request, { forceNoindex: true });
}

/**
 * Known ISO 639-1 language path prefixes — permanently retired.
 * Exact roots (/tr) and nested paths (/tr/tools/...) both hard-404 + noindex.
 * /en and /en/... redirect to bare English paths (legacy equity preservation).
 */
const LEGACY_LANGUAGE_CODES = [
  "en", "tr", "de", "fr", "es", "ar",
  "ru", "zh", "ja", "ko", "pt", "it",
  "nl", "pl", "sv", "da", "fi", "nb",
  "cs", "hu", "ro", "uk", "el", "he",
  "hi", "th", "vi", "id", "ms",
] as const;

const LEGACY_LANGUAGE_PREFIX_RE = new RegExp(
  `^/(${LEGACY_LANGUAGE_CODES.join("|")})(/|$)`,
);

// SW_KILL_VERSION: bump to force clients to re-fetch the kill SW.
const SW_KILL_VERSION = "2026-07-19-v2";

// Kill SW — no reload loop. Installs, deletes caches, claims, unregisters.
// No clients.navigate() — avoids infinite reload.
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
  const host = resolveClientHost(request);
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

  if (pathname.startsWith("/sitemap/")) {
    const gone = new NextResponse("Gone", {
      status: 410,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
    return applyStandardHeaders(gone, request, { forceNoindex: true });
  }

  // ── Legacy singular /guide/ → /guides/ redirect ──
  if (pathname.startsWith("/guide/")) {
    const url = new URL(request.url);
    url.pathname = pathname.replace(/^\/guide\//, "/guides/");
    return NextResponse.redirect(url, 301);
  }

  // ── RM-LEAN-001: /lean/{framework}/{metric} → /calculators/{metric} (301) ──
  // Exact 301 (not Next.js redirects() 308) so GSC/crawlers see permanent HTTP 301.
  {
    const leanSpoke = pathname.match(
      /^\/lean\/(pdca|gemba|a3|muda)\/(takt-time|oee|scrap-rate|cycle-time|capacity-utilization)\/?$/,
    );
    if (leanSpoke) {
      const metric = leanSpoke[2];
      const url = new URL(request.url);
      url.pathname = `/calculators/${metric}`;
      url.search = "";
      url.hash = "";
      return NextResponse.redirect(url, { status: 301 });
    }
  }

  // ── Legacy free-tool URL structure → canonical route (301) ──
  // Old/indexed URLs used /free-tools/{category}/{slug}; live route is
  // /tools/free/{slug}. Strip the category segment and redirect.
  if (pathname.startsWith("/free-tools/")) {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length >= 3) {
      const slug = segments[segments.length - 1];
      const url = new URL(request.url);
      url.pathname = `/tools/free/${slug}`;
      return NextResponse.redirect(url, 301);
    }
  }

  // ── Legacy language prefixes (English-only apex site) ──
  // /en and /en/... → 301 to bare path (preserve crawl equity).
  // /tr|/de|/fr|/es|/ar|... (exact + nested) → hard 404 + noindex.
  {
    const languagePrefixMatch = pathname.match(LEGACY_LANGUAGE_PREFIX_RE);
    if (languagePrefixMatch) {
      const code = languagePrefixMatch[1];
      if (code === "en") {
        const rest =
          pathname === "/en" || pathname === "/en/"
            ? "/"
            : pathname.slice("/en".length) || "/";
        const url = request.nextUrl.clone();
        url.host = "sectorcalc.com";
        url.protocol = "https:";
        url.pathname = rest.startsWith("/") ? rest : `/${rest}`;
        return NextResponse.redirect(url, 301);
      }
      return notFoundResponse(request);
    }
  }

  // Industry detail: unknown slug → hard 404 + noindex at the edge (before soft shells)
  if (pathname.startsWith("/industries/")) {
    const slug = pathname.slice("/industries/".length).replace(/\/+$/, "");
    if (!slug || slug.includes("/") || !ACTIVE_INDUSTRY_SLUGS.has(slug)) {
      return notFoundResponse(request);
    }
  }

  // Free tools: unknown / quarantined / underscore variants → hard 404 at the edge.
  // Firebase SSR otherwise emits HTTP 200 + noindex soft shells (crawl-budget waste).
  if (pathname.startsWith("/tools/free/")) {
    const slug = pathname.slice("/tools/free/".length).replace(/\/+$/, "");
    if (!slug || slug.includes("/") || !ACTIVE_FREE_TOOL_SLUG_SET.has(slug)) {
      return notFoundResponse(request);
    }
  }

  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return applyStandardHeaders(nextWithRobotsPolicy(request), request);
  }

  if (pathname === "/sw.js") {
    return new NextResponse(SW_KILL_CODE, { headers: SW_KILL_HEADERS });
  }

  if (pathname.includes(".")) {
    return applyStandardHeaders(nextWithRobotsPolicy(request), request);
  }

  const response = nextWithRobotsPolicy(request);
  annotateAuthGate(request, response);

  if (response.headers.get("x-auth-gate") === "challenge") {
    return applyStandardHeaders(response, request, { forceNoindex: true });
  }

  return applyStandardHeaders(response, request);
}

export const config = {
  matcher: [
    "/",
    "/sw.js",
    "/sitemap/:path*",
    "/((?!admin|api|_next|_vercel|.*\\..*).*)",
  ],
};

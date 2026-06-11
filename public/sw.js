/*
 * SectorCalc service worker — conservative field-mode shell.
 *
 * Safety rules:
 * - Never cache navigation (HTML document) responses → no stale paywall/auth/result pages.
 * - Navigations are network-first; on failure serve the offline shell only.
 * - Only immutable, content-hashed assets are cache-first.
 * - /api and /admin are never intercepted.
 * - Offline mode is a shell, not a calculation engine.
 */

const CACHE_VERSION = "sectorcalc-shell-v1";
const OFFLINE_URL = "/offline.html";
const PRECACHE = [OFFLINE_URL, "/img/brand/sectorcalc-favicon-180.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

function isImmutableAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/img/") ||
    /\.(?:woff2?|ttf|otf)$/.test(url.pathname)
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }
  if (url.pathname.startsWith("/api") || url.pathname.startsWith("/admin")) {
    return;
  }

  // Navigations: network-first, offline shell fallback only. Never cache HTML.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(OFFLINE_URL).then((cached) => cached ?? new Response("Offline", { status: 503 })),
      ),
    );
    return;
  }

  // Immutable assets: cache-first with background refresh.
  if (isImmutableAsset(url)) {
    event.respondWith(
      caches.open(CACHE_VERSION).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) {
          return cached;
        }
        try {
          const response = await fetch(request);
          if (response && response.ok) {
            cache.put(request, response.clone());
          }
          return response;
        } catch {
          return cached ?? Response.error();
        }
      }),
    );
  }
});

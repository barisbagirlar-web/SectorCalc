/* SectorCalc SW — self-destruct kill-switch */
/* Clears ALL previously cached app-shell data from any prior PWA version */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Wipe every cache this origin ever created (old SectorCalc app-shell caches)
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      // Claim all open clients so this SW is active immediately
      await self.clients.claim();
      // Unregister — we do not want a long-lived SW on this site
      await self.registration.unregister();
      // Force-reload every open tab so they go through normal network path
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((c) => c.navigate(c.url));
    })(),
  );
});
self.addEventListener("fetch", () => {
  // No-op: immediately self-destructed, no fetch interception
});

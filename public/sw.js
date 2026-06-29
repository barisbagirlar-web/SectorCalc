/* SectorCalc SW — self-destruct kill-switch */
/* Clears ALL previously cached app-shell data from any prior PWA version */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      await self.clients.claim();
      await self.registration.unregister();
      // Reload ALL open tabs so they bypass SW cache immediately
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((c) => c.navigate(c.url));
    })(),
  );
});
self.addEventListener("fetch", () => {});

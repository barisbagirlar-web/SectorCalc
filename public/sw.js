/* SectorCalc SW — self-destruct in dev, production mode below */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(
    self.clients.claim().then(() => self.registration.unregister()),
  );
});
self.addEventListener("fetch", (event) => {
  // No-op: immediately self-destructed
});

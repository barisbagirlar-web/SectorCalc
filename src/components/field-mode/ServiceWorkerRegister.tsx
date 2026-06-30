"use client";

import { useEffect } from "react";

/** Registers the offline-shell service worker. Dev: aggressively unregisters all. */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }
    // Dev: unregister all SWs immediately (middleware already nukes /sw.js)
    if (typeof window !== "undefined" && window.location.hostname === "localhost") {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((reg) => reg.unregister());
      });
      return;
    }
    // Production (Temporary Fix): Unregister all SWs to fix caching and ReferenceError bugs
    const nukeServiceWorkers = () => {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((reg) => reg.unregister());
        // Reload page once if we had active workers to clear out old chunks
        if (regs.length > 0) {
          window.location.reload();
        }
      });
    };
    if (document.readyState === "complete") {
      nukeServiceWorkers();
    } else {
      window.addEventListener("load", nukeServiceWorkers, { once: true });
    }
  }, []);

  return null;
}

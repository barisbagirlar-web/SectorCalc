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
    // Production: register SW
    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* registration failure is non-fatal */
      });
    };
    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
    }
  }, []);

  return null;
}

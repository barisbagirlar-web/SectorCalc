"use client";

import { useEffect } from "react";

/** Registers the conservative offline-shell service worker. Non-fatal on failure. */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }
    // Dev: force-kill any service worker immediately
    if (typeof window !== "undefined" && window.location.hostname === "localhost") {
      // Unregister all existing SWs
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((reg) => reg.unregister());
      });
      // Re-fetch /sw.js to trigger update check; the new file self-destructs
      navigator.serviceWorker.register("/sw.js").then((reg) => {
        reg.unregister();
      }).catch(() => {});
      return;
    }
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

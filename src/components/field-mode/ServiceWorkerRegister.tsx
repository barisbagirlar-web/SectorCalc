"use client";

import { useEffect } from "react";

/**
 * Service Worker cache invalidation — client-side fallback.
 *
 * Primary gate: middleware intercepts /sw.js and returns a kill SW that
 * deletes all caches, claims clients, and unregisters silently (no reload).
 *
 * This component is the fallback: if a legacy SW somehow survived the
 * middleware kill (e.g., network error during SW update check), it
 * unregisters it once per browser session. No page reload — the next
 * navigation will be clean.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    // Session-scoped guard: only run once per tab session.
    const CLEANUP_KEY = "sc-sw-cleanup-done";
    if (sessionStorage.getItem(CLEANUP_KEY) === "1") return;

    navigator.serviceWorker.getRegistrations().then((regs) => {
      if (regs.length === 0) {
        sessionStorage.setItem(CLEANUP_KEY, "1");
        return;
      }
      // Unregister all surviving SWs (legacy escapee from middleware kill).
      Promise.all(regs.map((r) => r.unregister())).then(() => {
        sessionStorage.setItem(CLEANUP_KEY, "1");
      });
    });
  }, []);

  return null;
}

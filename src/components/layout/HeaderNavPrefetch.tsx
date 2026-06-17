"use client";

import { useEffect } from "react";
import { isAuthRequiredBrowserPath } from "@/lib/auth/auth-required-path";
import { warmUserSubscriptionStore } from "@/lib/billing/use-user-subscription";

/** Warm shared auth store after idle — keeps Firebase iframe off the homepage critical path. */
export function HeaderNavPrefetch() {
  useEffect(() => {
    let cancelled = false;
    let cancelIdle: (() => void) | undefined;

    if (isAuthRequiredBrowserPath()) {
      warmUserSubscriptionStore();
      return;
    }

    const scheduleWarm = () => {
      if (!cancelled) {
        warmUserSubscriptionStore();
      }
    };

    if (typeof window.requestIdleCallback === "function") {
      const idleId = window.requestIdleCallback(scheduleWarm, { timeout: 5000 });
      cancelIdle = () => window.cancelIdleCallback(idleId);
    } else {
      const timer = setTimeout(scheduleWarm, 4000);
      cancelIdle = () => clearTimeout(timer);
    }

    return () => {
      cancelled = true;
      cancelIdle?.();
    };
  }, []);

  return null;
}

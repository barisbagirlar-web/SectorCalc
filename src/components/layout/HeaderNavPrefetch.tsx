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

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(
        () => {
          if (!cancelled) {
            warmUserSubscriptionStore();
          }
        },
        { timeout: 5000 },
      );
      cancelIdle = () => window.cancelIdleCallback(idleId);
    } else {
      const timer = window.setTimeout(() => {
        if (!cancelled) {
          warmUserSubscriptionStore();
        }
      }, 4000);
      cancelIdle = () => window.clearTimeout(timer);
    }

    return () => {
      cancelled = true;
      cancelIdle?.();
    };
  }, []);

  return null;
}

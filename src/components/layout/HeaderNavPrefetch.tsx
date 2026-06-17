"use client";

import { useEffect } from "react";
import { warmUserSubscriptionStore } from "@/lib/billing/use-user-subscription";

function stripLocalePrefix(pathname: string): string {
  return pathname.replace(/^\/(tr|de|fr|es|ar)(?=\/|$)/, "") || "/";
}

function isAuthRequiredPath(): boolean {
  const bare = stripLocalePrefix(window.location.pathname);
  return (
    /^\/(account|login|pricing)(\/|$)/.test(bare) ||
    /^\/tools\/(premium|premium-schema)\//.test(bare) ||
    /^\/admin(\/|$)/.test(bare)
  );
}

/** Warm shared auth store after idle — keeps Firebase iframe off the homepage critical path. */
export function HeaderNavPrefetch() {
  useEffect(() => {
    let cancelled = false;
    let cancelIdle: (() => void) | undefined;

    if (isAuthRequiredPath()) {
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
      const timer = setTimeout(() => {
        if (!cancelled) {
          warmUserSubscriptionStore();
        }
      }, 4000);
      cancelIdle = () => clearTimeout(timer);
    }

    return () => {
      cancelled = true;
      cancelIdle?.();
    };
  }, []);

  return null;
}

"use client";

import { useEffect } from "react";
import { isAuthRequiredBrowserPath } from "@/lib/auth/auth-required-path";
import { warmUserSubscriptionStore } from "@/lib/billing/use-user-subscription";

function scheduleIdleWarm(task: () => void, delayMs: number): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const idleId = window.requestIdleCallback(task, { timeout: delayMs + 1000 });
    return () => window.cancelIdleCallback(idleId);
  }

  const timer = setTimeout(task, delayMs);
  return () => clearTimeout(timer);
}

/** Warm shared auth store after idle — keeps Firebase iframe off the homepage critical path. */
export function HeaderNavPrefetch() {
  useEffect(() => {
    let cancelled = false;

    if (isAuthRequiredBrowserPath()) {
      warmUserSubscriptionStore();
      return;
    }

    const cancelScheduled = scheduleIdleWarm(() => {
      if (!cancelled) {
        warmUserSubscriptionStore();
      }
    }, 4000);

    return () => {
      cancelled = true;
      cancelScheduled();
    };
  }, []);

  return null;
}

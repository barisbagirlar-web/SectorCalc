"use client";

import { useEffect } from "react";
import { warmUserSubscriptionStore } from "@/lib/billing/use-user-subscription";

/** Warm shared auth store only — avoid parallel RSC prefetches that close SSR connections. */
export function HeaderNavPrefetch() {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      warmUserSubscriptionStore();
    }, 500);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return null;
}

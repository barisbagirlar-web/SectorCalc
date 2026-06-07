"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { warmUserSubscriptionStore } from "@/lib/billing/use-user-subscription";

/** Primary header destinations — prefetch on mount for instant navigation. */
const HEADER_PREFETCH_ROUTES = [
  "/",
  "/free-tools",
  "/industries",
  "/categories",
  "/premium-tools",
  "/account/reports",
  "/pricing",
  "/account",
  "/login",
] as const;

export function HeaderNavPrefetch() {
  const router = useRouter();

  useEffect(() => {
    warmUserSubscriptionStore();

    for (const href of HEADER_PREFETCH_ROUTES) {
      router.prefetch(href);
    }
  }, [router]);

  return null;
}

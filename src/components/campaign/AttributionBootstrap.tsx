"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { captureAttributionFromLocation } from "@/lib/infrastructure/analytics/attribution-storage";
import { stripLocalePrefix } from "@/i18n/routing";

/**
 * Captures UTM/referrer on every client navigation so funnel events
 * can read session attribution without each page re-implementing capture.
 */
export function AttributionBootstrap() {
  const pathname = usePathname();

  useEffect(() => {
    const pagePath = stripLocalePrefix(pathname);
    const params = new URLSearchParams(window.location.search);
    captureAttributionFromLocation(params, pagePath);
  }, [pathname]);

  return null;
}

"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  captureAttributionFromLocation,
  readStoredAttributionContext,
} from "@/lib/infrastructure/analytics/attribution-storage";
import { stripLocalePrefix } from "@/i18n/routing";
import type { AttributionContext } from "@/lib/infrastructure/analytics/attribution";

/**
 * Reads UTM/referrer attribution after mount to avoid useSearchParams hydration
 * failures on statically generated pages (homepage, tool catalogs).
 */
export function useAttributionContext(): AttributionContext {
  const pathname = usePathname();
  const pagePath = stripLocalePrefix(pathname);
  const [context, setContext] = useState<AttributionContext>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    captureAttributionFromLocation(params, pagePath);
    setContext(readStoredAttributionContext());
  }, [pagePath]);

  return context;
}

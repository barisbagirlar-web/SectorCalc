"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import {
  captureAttributionFromLocation,
  readStoredAttributionContext,
} from "@/lib/analytics/attribution-storage";
import { stripLocalePrefix } from "@/i18n/routing";
import type { AttributionContext } from "@/lib/analytics/attribution";

export function useAttributionContext(): AttributionContext {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const pagePath = stripLocalePrefix(pathname);

  useEffect(() => {
    captureAttributionFromLocation(searchParams, pagePath);
  }, [searchParams, pagePath]);

  return readStoredAttributionContext();
}

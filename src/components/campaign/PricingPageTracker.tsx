"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/routing";
import { stripLocalePrefix } from "@/i18n/locales";
import { trackSectorCalcEvent } from "@/lib/analytics/event-taxonomy";
import { useAttributionContext } from "@/lib/analytics/use-attribution-context";

export function PricingPageTracker() {
  const locale = useLocale();
  const pathname = usePathname();
  const attribution = useAttributionContext();

  useEffect(() => {
    trackSectorCalcEvent({
      eventName: "pricing_view",
      locale,
      pagePath: stripLocalePrefix(pathname),
      campaignId: attribution.utmCampaign,
      source: attribution.utmSource,
      medium: attribution.utmMedium,
    });
  }, [attribution.utmCampaign, attribution.utmMedium, attribution.utmSource, locale, pathname]);

  return null;
}

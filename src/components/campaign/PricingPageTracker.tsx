"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { stripLocalePrefix } from "@/i18n/locales";
import { trackConversionEvent } from "@/lib/infrastructure/analytics/conversion-funnel";
import { useAttributionContext } from "@/lib/infrastructure/analytics/use-attribution-context";

export function PricingPageTracker() {
  const locale = useLocale();
  const pathname = usePathname();
  const attribution = useAttributionContext();

  useEffect(() => {
    trackConversionEvent({
      stage: "pricing_intent",
      eventName: "pricing_view",
      locale,
      pagePath: stripLocalePrefix(pathname),
      campaignId: attribution.utmCampaign,
      source: attribution.utmSource,
      medium: attribution.utmMedium,
      valueType: "premium",
    });
  }, [attribution.utmCampaign, attribution.utmMedium, attribution.utmSource, locale, pathname]);

  return null;
}

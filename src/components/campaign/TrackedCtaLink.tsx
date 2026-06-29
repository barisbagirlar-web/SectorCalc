"use client";

import type { ReactNode } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { useAttributionContext } from "@/lib/analytics/use-attribution-context";
import { trackConversionEvent, mapEventToStage } from "@/lib/analytics/conversion-funnel";
import type { SectorCalcEventName } from "@/lib/analytics/event-taxonomy";
import { buildTrackedCtaHref } from "@/lib/campaigns/campaign-links";
import { usePathname } from "next/navigation";
import { stripLocalePrefix } from "@/i18n/routing";

export type TrackedCtaLinkProps = {
  readonly href: string;
  readonly children: ReactNode;
  readonly className?: string;
  readonly eventName: SectorCalcEventName;
  readonly ctaId: string;
  readonly campaignId?: string;
  readonly source?: string;
  readonly medium?: string;
  readonly toolSlug?: string;
  readonly premiumSlug?: string;
};

export function TrackedCtaLink({
  href,
  children,
  className,
  eventName,
  ctaId,
  campaignId,
  source = "cta",
  medium = "internal",
  toolSlug,
  premiumSlug,
}: TrackedCtaLinkProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const attribution = useAttributionContext();
  const trackedHref = buildTrackedCtaHref(href, campaignId ?? attribution.utmCampaign, source, medium, attribution);

  return (
    <Link
      href={trackedHref}
      className={className}
      onClick={() => {
        trackConversionEvent({
          stage: mapEventToStage(eventName),
          eventName,
          locale,
          pagePath: stripLocalePrefix(pathname),
          campaignId: campaignId ?? attribution.utmCampaign,
          source: attribution.utmSource ?? source,
          medium: attribution.utmMedium ?? medium,
          ctaId,
          toolSlug,
          premiumSlug,
        });
      }}
    >
      {children}
    </Link>
  );
}

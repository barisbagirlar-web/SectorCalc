"use client";

import type { ReactNode } from "react";
import { useLocale } from "@/lib/i18n-stub";
import { Link } from "@/i18n/routing";
import { useAttributionContext } from "@/lib/infrastructure/analytics/use-attribution-context";
import { trackConversionEvent, mapEventToStage } from "@/lib/infrastructure/analytics/conversion-funnel";
import type { SectorCalcEventName } from "@/lib/infrastructure/analytics/event-taxonomy";
import { buildTrackedCtaHref } from "@/lib/features/campaigns/campaign-links";
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
          pagePath: stripLocalePrefix(pathname ?? "/"),
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

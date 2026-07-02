"use client";

import { useTranslations } from "@/lib/i18n-stub";
import { TrackedCtaLink } from "@/components/campaign/TrackedCtaLink";
import { useAttributionContext } from "@/lib/infrastructure/analytics/use-attribution-context";

export type SeoHubCampaignLink = {
  readonly href: string;
  readonly label: string;
};

export type SeoHubCampaignActionsProps = {
  readonly freeToolLinks: readonly SeoHubCampaignLink[];
  readonly premiumAnalyzerLinks: readonly SeoHubCampaignLink[];
  readonly industryLinks: readonly SeoHubCampaignLink[];
};

export function SeoHubCampaignActions({
  freeToolLinks,
  premiumAnalyzerLinks,
  industryLinks,
}: SeoHubCampaignActionsProps) {
  const t = useTranslations("campaign.seoHub");
  const attribution = useAttributionContext();
  const campaignId = attribution.utmCampaign;

  return (
    <div className="sc-craft-grid sc-craft-grid--2">
      <div className="sc-industrial-panel p-4">
        <h2 className="sc-pro-headline text-lg">{t("freeCalculators")}</h2>
        <ul className="mt-3 space-y-2">
          {freeToolLinks.map((link) => (
            <li key={link.href}>
              <TrackedCtaLink
                href={link.href}
                eventName="seo_landing_cta_click"
                ctaId="seo_free_tool"
                campaignId={campaignId}
                source="seo_hub"
                medium="free_tool"
                className="sc-crawl-index__link"
              >
                {link.label}
              </TrackedCtaLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="sc-industrial-panel p-4">
        <h2 className="sc-pro-headline text-lg">{t("premiumAnalyzers")}</h2>
        <ul className="mt-3 space-y-2">
          {premiumAnalyzerLinks.map((link) => (
            <li key={link.href}>
              <TrackedCtaLink
                href={link.href}
                eventName="seo_landing_cta_click"
                ctaId="seo_premium_analyzer"
                campaignId={campaignId}
                source="seo_hub"
                medium="premium_analyzer"
                className="sc-crawl-index__link"
              >
                {link.label}
              </TrackedCtaLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 flex flex-wrap gap-3 sm:col-span-2">
        {industryLinks.map((link) => (
          <TrackedCtaLink
            key={link.href}
            href={link.href}
            eventName="seo_landing_cta_click"
            ctaId="seo_industry"
            campaignId={campaignId}
            source="seo_hub"
            medium="industry"
            className="sc-cta-secondary"
          >
            {link.label}
          </TrackedCtaLink>
        ))}
        <TrackedCtaLink
          href="/pricing"
          eventName="pricing_cta_click"
          ctaId="seo_pricing"
          campaignId={campaignId}
          source="seo_hub"
          medium="pricing"
          className="sc-cta-primary"
        >
          {t("viewPricing")}
        </TrackedCtaLink>
      </div>
    </div>
  );
}

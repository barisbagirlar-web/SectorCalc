"use client";

import { useTranslations } from "next-intl";
import { TrackedCtaLink } from "@/components/campaign/TrackedCtaLink";
import { getPrimaryCampaignCtas } from "@/lib/campaigns/campaign-links";

export function HomepageCampaignStrip() {
  const t = useTranslations("campaign");
  const ctas = getPrimaryCampaignCtas();

  return (
    <section className="sc-home-hybrid__section" aria-labelledby="campaign-strip-heading">
      <div className="sc-pro-container mx-auto max-w-5xl px-4">
        <h2 id="campaign-strip-heading" className="sc-home-hybrid__section-title">
          {t("homepageStrip.title")}
        </h2>
        <p className="sc-home-hybrid__section-lead">{t("homepageStrip.lead")}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {ctas.map((cta) => (
            <li key={cta.clusterId}>
              <TrackedCtaLink
                href={cta.href}
                eventName="homepage_cta_click"
                ctaId={cta.ctaId}
                campaignId={cta.clusterId}
                source="homepage"
                medium="campaign_strip"
                className="sc-cta-secondary inline-flex min-h-[44px] items-center px-4 py-2 text-sm"
              >
                {t(`clusters.${cta.clusterId}`)}
              </TrackedCtaLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

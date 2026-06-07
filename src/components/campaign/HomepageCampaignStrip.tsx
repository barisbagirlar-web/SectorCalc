"use client";

import { TrackedCtaLink } from "@/components/campaign/TrackedCtaLink";
import { getPrimaryCampaignCtas } from "@/lib/campaigns/campaign-links";

export function HomepageCampaignStrip() {
  const ctas = getPrimaryCampaignCtas();

  return (
    <section className="sc-home-hybrid__section" aria-labelledby="campaign-strip-heading">
      <div className="sc-pro-container mx-auto max-w-5xl px-4">
        <h2 id="campaign-strip-heading" className="sc-home-hybrid__section-title">
          Start with a sector guide
        </h2>
        <p className="sc-home-hybrid__section-lead">
          Pick a campaign landing page for manufacturing, construction, logistics or energy.
        </p>
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
                {cta.label}
              </TrackedCtaLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

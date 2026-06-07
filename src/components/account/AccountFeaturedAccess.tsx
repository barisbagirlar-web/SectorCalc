"use client";

import Link from "next/link";
import { FEATURED_PREMIUM_SLUGS } from "@/lib/catalog/build-catalog-groups";
import { getIndustryDisplayName } from "@/lib/tools/industry-registry";
import { revenueTools } from "@/lib/tools/revenue-tools";
import {
  getFreeToolHref,
  getFreeToolsHref,
  getPremiumToolHref,
  getPremiumToolsHref,
  getPricingHref,
} from "@/lib/tools/tool-links";

const FEATURED_FREE_COUNT = 4;

type AccountFeaturedAccessProps = {
  isActive: boolean;
};

export function AccountFeaturedAccess({ isActive }: AccountFeaturedAccessProps) {
  const featuredPremium = FEATURED_PREMIUM_SLUGS.flatMap((slug) => {
    const tool = revenueTools.find((entry) => entry.paidSlug === slug);
    return tool ? [tool] : [];
  }).slice(0, 6);

  const featuredFree = revenueTools.slice(0, FEATURED_FREE_COUNT);

  return (
    <aside className="sc-account-hub__featured min-w-0">
      <section className="sc-account-hub__panel" aria-labelledby="account-premium-heading">
        <div className="sc-account-hub__panel-head">
          <div>
            <h2 id="account-premium-heading" className="sc-account-hub__panel-title">
              Premium access
            </h2>
            <p className="sc-account-hub__panel-lead">
              {isActive
                ? "Open sector analyzers with full verdict reports."
                : "Unlock safe price floors and accept / reprice verdicts."}
            </p>
          </div>
          {!isActive ? <span className="sc-omni-hub__pro-badge">Pro</span> : null}
        </div>
        <ul className="sc-account-hub__link-list">
          {featuredPremium.map((tool) => (
            <li key={tool.paidSlug}>
              <Link
                href={isActive ? getPremiumToolHref(tool) : getPricingHref(tool)}
                className="sc-account-hub__link-row group"
              >
                <span className="min-w-0 flex-1">
                  <span className="sc-account-hub__link-eyebrow">
                    {getIndustryDisplayName(tool.sector)}
                  </span>
                  <span className="sc-account-hub__link-title">{tool.paidTitle}</span>
                </span>
                <span className="sc-account-hub__link-cta">
                  {isActive ? "Open →" : "Unlock →"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href={isActive ? getPremiumToolsHref() : getPricingHref()} className="sc-account-hub__panel-footer">
          {isActive ? "Browse all premium analyzers →" : "View Pro pricing →"}
        </Link>
      </section>

      <section className="sc-account-hub__panel sc-account-hub__panel--muted" aria-labelledby="account-free-heading">
        <h2 id="account-free-heading" className="sc-account-hub__panel-title">
          Free quick checks
        </h2>
        <ul className="sc-account-hub__chip-list">
          {featuredFree.map((tool) => (
            <li key={tool.freeSlug}>
              <Link href={getFreeToolHref(tool)} className="sc-account-hub__chip">
                {tool.freeTitle}
              </Link>
            </li>
          ))}
        </ul>
        <Link href={getFreeToolsHref()} className="sc-account-hub__panel-footer">
          Browse 100 free calculators →
        </Link>
      </section>
    </aside>
  );
}

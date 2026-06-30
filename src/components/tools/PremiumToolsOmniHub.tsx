"use client";

import { useMemo, useRef, useState } from "react";
import { Lock } from "lucide-react";
import Link from "@/lib/ui-shared/navigation/next-link";
import { Link as I18nLink } from "@/i18n/routing";
import type { CatalogGroup } from "@/lib/catalog/catalog-types";
import {
  DEFAULT_PREMIUM_REPORT_FAMILY,
  FEATURED_PREMIUM_SLUGS,
} from "@/lib/catalog/build-catalog-groups";
import { getSampleReportHref } from "@/lib/features/tools/tool-links";
import { sectorCalcProPricing } from "@/lib/features/tools/revenue-tools";

export type PremiumToolsOmniHubProps = {
  groups: readonly CatalogGroup[];
  toolCount: number;
};

function AnalyzerListRows({ items }: { items: readonly CatalogGroup["items"][number][] }) {
  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <li key={item.href} className="min-w-0">
          <I18nLink
            href={item.href}
            className="group block text-premium-velvet hover:text-deep-navy"
          >
            <span className="flex items-start gap-2">
              <span className="flex-1 min-w-0">
                <span className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold leading-tight transition-colors group-hover:underline">
                    {item.title}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1 font-sans text-[9px] font-semibold uppercase tracking-wider text-sc-copper">
                    <Lock className="h-2.5 w-2.5" aria-hidden />
                    PRO
                  </span>
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-body-charcoal">
                  {item.description}
                </span>
                {item.meta ? (
                  <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-wider text-sc-copper">
                    {item.meta}
                  </span>
                ) : null}
              </span>
            </span>
          </I18nLink>
        </li>
      ))}
    </ul>
  );
}

export function PremiumToolsOmniHub({ groups, toolCount }: PremiumToolsOmniHubProps) {
  const toolsRef = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<string>(DEFAULT_PREMIUM_REPORT_FAMILY);

  const visibleGroups = useMemo(
    () => groups.filter((group) => group.items.length > 0),
    [groups]
  );

  const resolvedSelected = visibleGroups.some((group) => group.id === selected)
    ? selected
    : (visibleGroups[0]?.id ?? DEFAULT_PREMIUM_REPORT_FAMILY);

  const featuredLinks = useMemo(() => {
    const allItems = groups.flatMap((group) => group.items);
    return FEATURED_PREMIUM_SLUGS.flatMap((slug) => {
      const item = allItems.find((entry) => entry.href.endsWith(`/${slug}`));
      if (!item) {
        return [];
      }
      return [{ title: item.title, href: item.href }];
    });
  }, [groups]);

  const selectCategory = (categoryId: string) => {
    setSelected(categoryId);
    toolsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activeGroup =
    visibleGroups.find((group) => group.id === resolvedSelected) ?? visibleGroups[0];

  return (
    <div className="sc-omni-hub sc-omni-hub--premium">
      <header className="sc-omni-hub__hero sc-omni-hub__hero--premium">
        <div className="sc-omni-hub__premium-ribbon">
          <span className="sc-omni-hub__premium-ribbon-badge">Premium</span>
          <span className="sc-omni-hub__premium-ribbon-copy">
            {sectorCalcProPricing.planName} · ${sectorCalcProPricing.priceMonthly}/month · verdict
            reports included
          </span>
        </div>
        <p className="sc-pro-eyebrow">Premium decision reports</p>
        <h1 className="sc-omni-hub__headline">
          <span className="sc-omni-hub__headline-lead">Your sector in</span>
          <span className="sc-omni-hub__headline-stat sc-omni-hub__headline-stat--premium">
            {toolCount}
          </span>
          <span className="sc-omni-hub__headline-tail">paid calculators</span>
        </h1>
        <p className="sc-pro-lead sc-omni-hub__sub">
          Loss detection, safe price floors and accept / reprice verdicts — pick a report family,
          then open the sector calculator you need.
        </p>
        <div className="sc-omni-hub__premium-actions">
          <Link href={getSampleReportHref()} className="sc-cta-secondary text-sm">
            View sample report
          </Link>
        </div>
      </header>

      {featuredLinks.length > 0 ? (
        <section
          className="sc-omni-hub__featured sc-omni-hub__featured--premium"
          aria-labelledby="premium-featured-heading"
        >
          <h2 id="premium-featured-heading" className="sc-omni-hub__section-title">
            Featured decision calculators
          </h2>
          <p className="sc-omni-hub__section-lead">
            Most-used premium reports across manufacturing, logistics, energy and field services.
          </p>
          <ul className="sc-omni-hub__featured-grid">
            {featuredLinks.map((item) => (
              <li key={item.href}>
                <I18nLink
                  href={item.href}
                  className="sc-omni-hub__featured-link sc-omni-hub__featured-link--premium"
                >
                  <span className="sc-omni-hub__featured-link-label">{item.title}</span>
                  <span className="sc-omni-hub__pro-badge sc-omni-hub__pro-badge--inline">Pro</span>
                </I18nLink>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="sc-omni-hub__categories" aria-labelledby="premium-categories-heading">
        <h2 id="premium-categories-heading" className="sc-omni-hub__section-title">
          Report categories
        </h2>
        <p className="sc-omni-hub__section-lead">
          Each calculator pairs with a free quick check in the same industry.
        </p>
        <ul className="sc-omni-hub__category-grid sc-omni-hub__category-grid--premium">
          {visibleGroups.map((group) => {
            const isActive = resolvedSelected === group.id;
            const count = group.items.length;

            return (
              <li key={group.id}>
                <button
                  type="button"
                  className={`sc-omni-hub__category-tile sc-omni-hub__category-tile--premium w-full text-left${
                    isActive ? " sc-omni-hub__category-tile--active" : ""
                  }`}
                  aria-pressed={isActive}
                  aria-controls={`premium-tools-${group.id}`}
                  onClick={() => selectCategory(group.id)}
                >
                  <span className="sc-omni-hub__category-count">
                    {count} {count === 1 ? "calculator" : "calculators"}
                  </span>
                  <span className="sc-omni-hub__category-label">{group.label}</span>
                  <span className="sc-omni-hub__category-desc">{group.description}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section
        ref={toolsRef}
        className="sc-omni-hub__tools"
        aria-labelledby="premium-tools-active-heading"
      >
        {activeGroup ? (
          <div className="sc-omni-hub__tools-active">
            <div className="sc-omni-hub__tools-heading-row">
              <h2 id="premium-tools-active-heading" className="sc-omni-hub__tools-heading">
                {activeGroup.label}
              </h2>
              <span className="sc-omni-hub__pro-badge">Pro reports</span>
            </div>
            <p className="sc-omni-hub__tools-lead">{activeGroup.description}</p>
            <AnalyzerListRows items={activeGroup.items} />
          </div>
        ) : null}

        {visibleGroups
          .filter((group) => group.id !== activeGroup?.id)
          .map((group) => (
            <section
              key={group.id}
              id={`premium-tools-${group.id}`}
              hidden
              aria-labelledby={`premium-tools-heading-${group.id}`}
              className="sc-omni-hub__tools-panel"
            >
              <h2 id={`premium-tools-heading-${group.id}`} className="sc-omni-hub__tools-heading">
                {group.label}
              </h2>
              <p className="sc-omni-hub__tools-lead">{group.description}</p>
              <AnalyzerListRows items={group.items} />
            </section>
          ))}
      </section>
    </div>
  );
}

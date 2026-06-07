"use client";

import { useMemo, useRef, useState } from "react";
import { Link as I18nLink } from "@/i18n/routing";
import { ScIcon } from "@/components/icons/ScIcon";
import { UI_ICON } from "@/lib/icons/icon-registry";
import type { CatalogGroup } from "@/lib/catalog/catalog-types";
import {
  FEATURED_INDUSTRY_SLUGS,
  getAllIndustryCategories,
  INDUSTRY_CATEGORY_LABELS,
  type IndustryCategory,
} from "@/lib/tools/industry-registry";
import { INDUSTRY_CATEGORY_DESCRIPTIONS } from "@/lib/catalog/build-catalog-groups";
import { getIndustryBySlug, type IndustrySlug } from "@/data/industries";

export type IndustriesOmniHubProps = {
  groups: readonly CatalogGroup[];
  sectorCount: number;
};

const DEFAULT_INDUSTRY_CATEGORY: IndustryCategory = "heavy-industry";

function SectorListRows({ items }: { items: readonly CatalogGroup["items"][number][] }) {
  return (
    <ul className="sc-omni-hub__tool-list">
      {items.map((item) => (
        <li key={item.href}>
          <I18nLink href={item.href} className="sc-omni-hub__tool-row group">
            <span className="sc-omni-hub__tool-copy min-w-0 flex-1">
              <span className="sc-omni-hub__tool-title-row">
                <span className="sc-omni-hub__tool-title">{item.title}</span>
                <span className="sc-omni-hub__sector-pack-badge">Sector pack</span>
              </span>
              <span className="sc-omni-hub__tool-desc">{item.description}</span>
              {item.meta ? <span className="sc-omni-hub__tool-meta">{item.meta}</span> : null}
            </span>
            <ScIcon
              icon={UI_ICON.chevronRight}
              size="compact"
              className="sc-omni-hub__tool-chevron shrink-0 text-body-charcoal transition group-hover:translate-x-0.5 group-hover:text-sc-copper"
            />
          </I18nLink>
        </li>
      ))}
    </ul>
  );
}

export function IndustriesOmniHub({ groups, sectorCount }: IndustriesOmniHubProps) {
  const toolsRef = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<string>(DEFAULT_INDUSTRY_CATEGORY);

  const visibleGroups = useMemo(
    () => groups.filter((group) => group.items.length > 0),
    [groups]
  );

  const resolvedSelected = visibleGroups.some((group) => group.id === selected)
    ? selected
    : (visibleGroups[0]?.id ?? DEFAULT_INDUSTRY_CATEGORY);

  const featuredLinks = useMemo(
    () =>
      FEATURED_INDUSTRY_SLUGS.flatMap((slug) => {
        const industry = getIndustryBySlug(slug as IndustrySlug);
        if (!industry) {
          return [];
        }
        return [
          {
            title: industry.name,
            href: `/industries/${industry.slug}`,
          },
        ];
      }),
    []
  );

  const selectCategory = (categoryId: string) => {
    setSelected(categoryId);
    toolsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activeGroup =
    visibleGroups.find((group) => group.id === resolvedSelected) ?? visibleGroups[0];

  return (
    <div className="sc-omni-hub sc-omni-hub--industries">
      <header className="sc-omni-hub__hero">
        <p className="sc-pro-eyebrow">Industry packs</p>
        <h1 className="sc-omni-hub__headline">
          <span className="sc-omni-hub__headline-lead">Loss starts across</span>
          <span className="sc-omni-hub__headline-stat">{sectorCount}</span>
          <span className="sc-omni-hub__headline-tail">active sectors</span>
        </h1>
        <p className="sc-pro-lead sc-omni-hub__sub">
          Free quick check plus premium decision report in every pack — pick your sector group
          first.
        </p>
      </header>

      {featuredLinks.length > 0 ? (
        <section className="sc-omni-hub__featured" aria-labelledby="industries-featured-heading">
          <h2 id="industries-featured-heading" className="sc-omni-hub__section-title">
            Featured sectors
          </h2>
          <p className="sc-omni-hub__section-lead">
            High-traffic industry packs with free tools and premium analyzers.
          </p>
          <ul className="sc-omni-hub__featured-grid">
            {featuredLinks.map((item) => (
              <li key={item.href}>
                <I18nLink href={item.href} className="sc-omni-hub__featured-link">
                  {item.title}
                </I18nLink>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="sc-omni-hub__categories" aria-labelledby="industries-categories-heading">
        <h2 id="industries-categories-heading" className="sc-omni-hub__section-title">
          Sector groups
        </h2>
        <ul className="sc-omni-hub__category-grid">
          {getAllIndustryCategories()
            .filter((category) => visibleGroups.some((group) => group.id === category))
            .map((category) => {
              const group = visibleGroups.find((entry) => entry.id === category);
              if (!group) {
                return null;
              }
              const isActive = resolvedSelected === category;
              const count = group.items.length;

              return (
                <li key={category}>
                  <button
                    type="button"
                    className={`sc-omni-hub__category-tile w-full text-left${
                      isActive ? " sc-omni-hub__category-tile--active" : ""
                    }`}
                    aria-pressed={isActive}
                    aria-controls={`industries-panel-${category}`}
                    onClick={() => selectCategory(category)}
                  >
                    <span className="sc-omni-hub__category-count">
                      {count} {count === 1 ? "sector" : "sectors"}
                    </span>
                    <span className="sc-omni-hub__category-label">
                      {INDUSTRY_CATEGORY_LABELS[category]}
                    </span>
                    <span className="sc-omni-hub__category-desc">
                      {INDUSTRY_CATEGORY_DESCRIPTIONS[category]}
                    </span>
                  </button>
                </li>
              );
            })}
        </ul>
      </section>

      <section
        ref={toolsRef}
        className="sc-omni-hub__tools"
        aria-labelledby="industries-active-heading"
      >
        {activeGroup ? (
          <div className="sc-omni-hub__tools-active">
            <h2 id="industries-active-heading" className="sc-omni-hub__tools-heading">
              {activeGroup.label}
            </h2>
            <p className="sc-omni-hub__tools-lead">{activeGroup.description}</p>
            <SectorListRows items={activeGroup.items} />
          </div>
        ) : null}

        {visibleGroups
          .filter((group) => group.id !== activeGroup?.id)
          .map((group) => (
            <section
              key={group.id}
              id={`industries-panel-${group.id}`}
              hidden
              aria-labelledby={`industries-heading-${group.id}`}
              className="sc-omni-hub__tools-panel"
            >
              <h2 id={`industries-heading-${group.id}`} className="sc-omni-hub__tools-heading">
                {group.label}
              </h2>
              <p className="sc-omni-hub__tools-lead">{group.description}</p>
              <SectorListRows items={group.items} />
            </section>
          ))}
      </section>
    </div>
  );
}

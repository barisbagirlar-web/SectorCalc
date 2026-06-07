"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/routing";
import type {
  CatalogGroup,
  CategoryExplorerLabels,
  CategoryExplorerVariant,
} from "@/lib/catalog/catalog-types";
import { resolveDefaultGroupId } from "@/lib/catalog/build-catalog-groups";

export type CategoryExplorerProps = {
  groups: readonly CatalogGroup[];
  defaultGroupId?: string;
  variant: CategoryExplorerVariant;
  labels: CategoryExplorerLabels;
};

function CatalogItemCard({
  item,
  openLabel,
  variant,
}: {
  item: CatalogGroup["items"][number];
  openLabel: string;
  variant: CategoryExplorerVariant;
}) {
  const ctaLabel =
    variant === "premium-tools"
      ? "View analyzer →"
      : variant === "industries"
        ? "Open sector hub →"
        : openLabel;

  return (
    <article className="sc-ledger-card sc-craft-card sc-ledger-letterpress sc-catalog-explorer__item-card">
      {item.badge ? (
        <p className="sc-craft-eyebrow line-clamp-1">{item.badge}</p>
      ) : null}
      <h3 className="sc-craft-card__title mt-1 line-clamp-2">{item.title}</h3>
      <p className="sc-craft-card__body line-clamp-3">{item.description}</p>
      {item.meta ? (
        <p className="mt-2 text-[10px] font-medium uppercase tracking-wide text-sc-navy line-clamp-2">
          {item.meta}
        </p>
      ) : null}
      <Link href={item.href} className="sc-craft-card__cta">
        {ctaLabel}
      </Link>
    </article>
  );
}

function ItemGrid({
  items,
  openLabel,
  variant,
}: {
  items: readonly CatalogGroup["items"][number][];
  openLabel: string;
  variant: CategoryExplorerVariant;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <ul className="sc-craft-grid sc-craft-grid--3 sc-catalog-explorer__item-grid">
      {items.map((item) => (
        <li key={item.href} className="min-w-0">
          <CatalogItemCard item={item} openLabel={openLabel} variant={variant} />
        </li>
      ))}
    </ul>
  );
}

export function CategoryExplorer({
  groups,
  defaultGroupId,
  variant,
  labels,
}: CategoryExplorerProps) {
  const visibleGroups = useMemo(
    () => groups.filter((group) => group.items.length > 0),
    [groups]
  );
  const initialGroupId = defaultGroupId ?? resolveDefaultGroupId(visibleGroups) ?? "";
  const [selected, setSelected] = useState(initialGroupId);
  const activeGroupId =
    visibleGroups.some((group) => group.id === selected) ? selected : initialGroupId;

  if (visibleGroups.length === 0) {
    return null;
  }

  const panelPrefix = `catalog-${variant}`;

  return (
    <div className="sc-catalog-explorer" data-variant={variant}>
      <div className="sc-catalog-explorer__mobile lg:hidden">
        {visibleGroups.map((group) => {
          const isOpen = activeGroupId === group.id;
          const count = group.items.length;

          return (
            <div key={group.id} className="sc-catalog-explorer__accordion-item">
              <button
                type="button"
                className={`sc-catalog-explorer__category-btn w-full text-left${
                  isOpen ? " sc-catalog-explorer__category-btn--active" : ""
                }`}
                aria-expanded={isOpen}
                aria-controls={`${panelPrefix}-panel-${group.id}`}
                id={`${panelPrefix}-trigger-${group.id}`}
                onClick={() => setSelected(group.id)}
              >
                <span className="sc-pro-eyebrow">{labels.countLabel(count)}</span>
                <span className="mt-1 block text-base font-semibold text-premium-velvet">
                  {group.label}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-body-charcoal">
                  {group.description}
                </span>
                <span className="mt-2 inline-flex min-h-[44px] items-center text-xs font-semibold uppercase tracking-wide text-sc-copper">
                  {isOpen ? labels.viewCategoryOpen : labels.viewCategory}
                </span>
              </button>
              <section
                id={`${panelPrefix}-panel-${group.id}`}
                role="region"
                aria-labelledby={`${panelPrefix}-trigger-${group.id}`}
                hidden={!isOpen}
                className="sc-catalog-explorer__accordion-panel"
              >
                <ItemGrid items={group.items} openLabel={labels.openItem} variant={variant} />
              </section>
            </div>
          );
        })}
      </div>

      <div className="sc-catalog-explorer__desktop hidden lg:grid">
        <nav className="sc-catalog-explorer__sidebar" aria-label={labels.navLabel}>
          <ul className="space-y-2">
            {visibleGroups.map((group) => {
              const isActive = activeGroupId === group.id;
              const count = group.items.length;

              return (
                <li key={group.id}>
                  <button
                    type="button"
                    className={`sc-catalog-explorer__category-btn w-full text-left${
                      isActive ? " sc-catalog-explorer__category-btn--active" : ""
                    }`}
                    aria-current={isActive ? "true" : undefined}
                    aria-controls={`${panelPrefix}-desktop-${group.id}`}
                    onClick={() => setSelected(group.id)}
                  >
                    <span className="sc-pro-eyebrow">{labels.countLabel(count)}</span>
                    <span className="mt-1 block text-sm font-semibold leading-snug text-premium-velvet">
                      {group.label}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-body-charcoal line-clamp-2">
                      {group.description}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sc-catalog-explorer__panels min-w-0">
          {visibleGroups.map((group) => {
            const isActive = activeGroupId === group.id;

            return (
              <section
                key={group.id}
                id={`${panelPrefix}-desktop-${group.id}`}
                hidden={!isActive}
                aria-labelledby={`${panelPrefix}-desktop-heading-${group.id}`}
                className="sc-catalog-explorer__panel sc-pro-panel sc-pro-letterpress p-4 sm:p-5"
              >
                <h2
                  id={`${panelPrefix}-desktop-heading-${group.id}`}
                  className="sc-pro-title text-xl sm:text-2xl"
                >
                  {group.label}
                </h2>
                <p className="sc-pro-lead text-sm">{group.description}</p>
                <hr className="sc-ledger-separator" />
                <ItemGrid items={group.items} openLabel={labels.openItem} variant={variant} />
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

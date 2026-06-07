"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { getToolHref } from "@/lib/tools/paths";
import {
  DEFAULT_FREE_TRAFFIC_CATEGORY,
  FREE_TRAFFIC_CATEGORY_META,
  countToolsInCategory,
} from "@/lib/tools/free-traffic-categories";
import type { FreeTrafficCategory, FreeTrafficTool } from "@/lib/tools/free-traffic-catalog";

export interface FreeToolsCategoryExplorerProps {
  tools: readonly FreeTrafficTool[];
}

function groupToolsByCategory(
  tools: readonly FreeTrafficTool[]
): Map<FreeTrafficCategory, FreeTrafficTool[]> {
  const map = new Map<FreeTrafficCategory, FreeTrafficTool[]>();
  for (const meta of FREE_TRAFFIC_CATEGORY_META) {
    map.set(meta.id, []);
  }
  for (const tool of tools) {
    const list = map.get(tool.category);
    if (list) {
      list.push(tool);
    }
  }
  return map;
}

function ToolCard({
  tool,
  openLabel,
  premiumNote,
}: {
  tool: FreeTrafficTool;
  openLabel: string;
  premiumNote: string;
}) {
  return (
    <article className="sc-ledger-card sc-craft-card sc-ledger-letterpress sc-free-tools-explorer__tool-card">
      <h3 className="sc-craft-card__title line-clamp-2">{tool.title}</h3>
      <p className="sc-craft-card__body line-clamp-3">{tool.description}</p>
      {tool.relatedPremiumSlug ? (
        <p className="mt-2 text-[10px] font-medium uppercase tracking-wide text-sc-navy">
          {premiumNote}
        </p>
      ) : null}
      <Link href={getToolHref("free", tool.slug)} className="sc-craft-card__cta">
        {openLabel}
      </Link>
    </article>
  );
}

function ToolGrid({
  categoryTools,
  openLabel,
  premiumNote,
}: {
  categoryTools: readonly FreeTrafficTool[];
  openLabel: string;
  premiumNote: string;
}) {
  return (
    <ul className="sc-craft-grid sc-craft-grid--3 sc-free-tools-explorer__tool-grid">
      {categoryTools.map((tool) => (
        <li key={tool.slug} className="min-w-0">
          <ToolCard tool={tool} openLabel={openLabel} premiumNote={premiumNote} />
        </li>
      ))}
    </ul>
  );
}

export function FreeToolsCategoryExplorer({ tools }: FreeToolsCategoryExplorerProps) {
  const t = useTranslations("freeTrafficCatalog");
  const [selected, setSelected] = useState<FreeTrafficCategory>(DEFAULT_FREE_TRAFFIC_CATEGORY);
  const toolsByCategory = useMemo(() => groupToolsByCategory(tools), [tools]);

  const openLabel = t("openCalculator");
  const premiumNote = t("decisionAnalyzerNote");

  return (
    <div className="sc-free-tools-explorer">
      {/* Mobile — accordion, one category open at a time; all links stay in DOM */}
      <div className="sc-free-tools-explorer__mobile lg:hidden">
        {FREE_TRAFFIC_CATEGORY_META.map((meta) => {
          const categoryTools = toolsByCategory.get(meta.id) ?? [];
          const isOpen = selected === meta.id;
          const count = countToolsInCategory(tools, meta.id);

          return (
            <div key={meta.id} className="sc-free-tools-explorer__accordion-item">
              <button
                type="button"
                className={`sc-free-tools-explorer__category-btn w-full text-left${
                  isOpen ? " sc-free-tools-explorer__category-btn--active" : ""
                }`}
                aria-expanded={isOpen}
                aria-controls={`free-tools-panel-${meta.id}`}
                id={`free-tools-trigger-${meta.id}`}
                onClick={() => setSelected(meta.id)}
              >
                <span className="sc-pro-eyebrow">{t("categoryCount", { count })}</span>
                <span className="mt-1 block text-base font-semibold text-premium-velvet">
                  {t(meta.labelKey)}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-body-charcoal">
                  {t(meta.descriptionKey)}
                </span>
                <span className="mt-2 inline-flex min-h-[44px] items-center text-xs font-semibold uppercase tracking-wide text-sc-copper">
                  {isOpen ? t("viewCalculatorsOpen") : t("viewCalculators")}
                </span>
              </button>
              <section
                id={`free-tools-panel-${meta.id}`}
                role="region"
                aria-labelledby={`free-tools-trigger-${meta.id}`}
                hidden={!isOpen}
                className="sc-free-tools-explorer__accordion-panel"
              >
                <ToolGrid
                  categoryTools={categoryTools}
                  openLabel={openLabel}
                  premiumNote={premiumNote}
                />
              </section>
            </div>
          );
        })}
      </div>

      {/* Desktop — sticky sidebar + tools panel; all panels in DOM for SEO */}
      <div className="sc-free-tools-explorer__desktop hidden lg:grid">
        <nav
          className="sc-free-tools-explorer__sidebar"
          aria-label={t("categoryNavLabel")}
        >
          <ul className="space-y-2">
            {FREE_TRAFFIC_CATEGORY_META.map((meta) => {
              const isActive = selected === meta.id;
              const count = countToolsInCategory(tools, meta.id);

              return (
                <li key={meta.id}>
                  <button
                    type="button"
                    className={`sc-free-tools-explorer__category-btn w-full text-left${
                      isActive ? " sc-free-tools-explorer__category-btn--active" : ""
                    }`}
                    aria-current={isActive ? "true" : undefined}
                    aria-controls={`free-tools-desktop-${meta.id}`}
                    onClick={() => setSelected(meta.id)}
                  >
                    <span className="sc-pro-eyebrow">{t("categoryCount", { count })}</span>
                    <span className="mt-1 block text-sm font-semibold leading-snug text-premium-velvet">
                      {t(meta.labelKey)}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-body-charcoal line-clamp-2">
                      {t(meta.descriptionKey)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sc-free-tools-explorer__panels min-w-0">
          {FREE_TRAFFIC_CATEGORY_META.map((meta) => {
            const categoryTools = toolsByCategory.get(meta.id) ?? [];
            const isActive = selected === meta.id;

            return (
              <section
                key={meta.id}
                id={`free-tools-desktop-${meta.id}`}
                hidden={!isActive}
                aria-labelledby={`free-tools-desktop-heading-${meta.id}`}
                className="sc-free-tools-explorer__panel sc-pro-panel sc-pro-letterpress p-4 sm:p-5"
              >
                <h2
                  id={`free-tools-desktop-heading-${meta.id}`}
                  className="sc-pro-title text-xl sm:text-2xl"
                >
                  {t(meta.labelKey)}
                </h2>
                <p className="sc-pro-lead text-sm">{t(meta.descriptionKey)}</p>
                <hr className="sc-ledger-separator" />
                <ToolGrid
                  categoryTools={categoryTools}
                  openLabel={openLabel}
                  premiumNote={premiumNote}
                />
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useRef, useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ScIcon } from "@/components/icons/ScIcon";
import { UI_ICON } from "@/lib/icons/icon-registry";
import {
  DEFAULT_FREE_TRAFFIC_CATEGORY,
  FREE_TRAFFIC_CATEGORY_META,
  countToolsInCategory,
} from "@/lib/tools/free-traffic-categories";
import {
  FEATURED_TRAFFIC_SLUGS,
  type FreeTrafficCategory,
  type FreeTrafficTool,
} from "@/lib/tools/free-traffic-catalog";
import { getToolHref } from "@/lib/tools/paths";

export type FreeToolsOmniHubProps = {
  tools: readonly FreeTrafficTool[];
};

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

function ToolListRows({
  categoryTools,
  premiumNote,
}: {
  categoryTools: readonly FreeTrafficTool[];
  premiumNote: string;
}) {
  return (
    <ul className="sc-omni-hub__tool-list">
      {categoryTools.map((tool) => (
        <li key={tool.slug}>
          <Link href={getToolHref("free", tool.slug)} className="sc-omni-hub__tool-row group">
            <span className="sc-omni-hub__tool-copy min-w-0 flex-1">
              <span className="sc-omni-hub__tool-title">{tool.title}</span>
              <span className="sc-omni-hub__tool-desc">{tool.description}</span>
              {tool.relatedPremiumSlug ? (
                <span className="sc-omni-hub__tool-meta">{premiumNote}</span>
              ) : null}
            </span>
            <ScIcon
              icon={UI_ICON.chevronRight}
              size="compact"
              className="sc-omni-hub__tool-chevron shrink-0 text-body-charcoal transition group-hover:translate-x-0.5 group-hover:text-sc-copper"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function FreeToolsOmniHub({ tools }: FreeToolsOmniHubProps) {
  const t = useTranslations("freeTrafficCatalog");
  const toolsRef = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<FreeTrafficCategory>(DEFAULT_FREE_TRAFFIC_CATEGORY);

  const toolsByCategory = useMemo(() => groupToolsByCategory(tools), [tools]);
  const premiumNote = t("decisionAnalyzerNote");

  const featuredTools = useMemo(
    () =>
      FEATURED_TRAFFIC_SLUGS.map((slug) => tools.find((tool) => tool.slug === slug)).filter(
        (tool): tool is FreeTrafficTool => tool !== undefined
      ),
    [tools]
  );

  const selectCategory = (categoryId: FreeTrafficCategory) => {
    setSelected(categoryId);
    toolsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activeMeta = FREE_TRAFFIC_CATEGORY_META.find((meta) => meta.id === selected);
  const activeTools = toolsByCategory.get(selected) ?? [];

  return (
    <div className="sc-omni-hub">
      <header className="sc-omni-hub__hero">
        <p className="sc-pro-eyebrow">{t("eyebrow")}</p>
        <h1 className="sc-omni-hub__headline">
          <span className="sc-omni-hub__headline-lead">{t("hubHeadlineLead")}</span>
          <span className="sc-omni-hub__headline-stat">{tools.length}</span>
          <span className="sc-omni-hub__headline-tail">{t("hubHeadlineTail")}</span>
        </h1>
        <p className="sc-pro-lead sc-omni-hub__sub">{t("hubSub")}</p>
      </header>

      {featuredTools.length > 0 ? (
        <section className="sc-omni-hub__featured" aria-labelledby="omni-featured-heading">
          <h2 id="omni-featured-heading" className="sc-omni-hub__section-title">
            {t("featuredTitle")}
          </h2>
          <p className="sc-omni-hub__section-lead">{t("featuredLead")}</p>
          <ul className="sc-omni-hub__featured-grid">
            {featuredTools.map((tool) => (
              <li key={tool.slug}>
                <Link href={getToolHref("free", tool.slug)} className="sc-omni-hub__featured-link">
                  {tool.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="sc-omni-hub__categories" aria-labelledby="omni-categories-heading">
        <h2 id="omni-categories-heading" className="sc-omni-hub__section-title">
          {t("hubCategoriesTitle")}
        </h2>
        <ul className="sc-omni-hub__category-grid">
          {FREE_TRAFFIC_CATEGORY_META.filter(
            (meta) => countToolsInCategory(tools, meta.id) > 0,
          ).map((meta) => {
            const count = countToolsInCategory(tools, meta.id);
            const isActive = selected === meta.id;

            return (
              <li key={meta.id}>
                <button
                  type="button"
                  className={`sc-omni-hub__category-tile w-full text-left${
                    isActive ? " sc-omni-hub__category-tile--active" : ""
                  }`}
                  aria-pressed={isActive}
                  aria-controls={`omni-tools-${meta.id}`}
                  onClick={() => selectCategory(meta.id)}
                >
                  <span className="sc-omni-hub__category-count">
                    {t("categoryCount", { count })}
                  </span>
                  <span className="sc-omni-hub__category-label">{t(meta.labelKey)}</span>
                  <span className="sc-omni-hub__category-desc">{t(meta.descriptionKey)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section
        ref={toolsRef}
        className="sc-omni-hub__tools"
        aria-labelledby="omni-tools-active-heading"
      >
        {activeMeta ? (
          <div className="sc-omni-hub__tools-active">
            <h2 id="omni-tools-active-heading" className="sc-omni-hub__tools-heading">
              {t(activeMeta.labelKey)}
            </h2>
            <p className="sc-omni-hub__tools-lead">{t(activeMeta.descriptionKey)}</p>
            <ToolListRows categoryTools={activeTools} premiumNote={premiumNote} />
          </div>
        ) : null}

        {FREE_TRAFFIC_CATEGORY_META.filter((meta) => meta.id !== selected).map((meta) => {
          const categoryTools = toolsByCategory.get(meta.id) ?? [];

          return (
            <section
              key={meta.id}
              id={`omni-tools-${meta.id}`}
              hidden
              aria-labelledby={`omni-tools-heading-${meta.id}`}
              className="sc-omni-hub__tools-panel"
            >
              <h2 id={`omni-tools-heading-${meta.id}`} className="sc-omni-hub__tools-heading">
                {t(meta.labelKey)}
              </h2>
              <p className="sc-omni-hub__tools-lead">{t(meta.descriptionKey)}</p>
              <ToolListRows categoryTools={categoryTools} premiumNote={premiumNote} />
            </section>
          );
        })}
      </section>
    </div>
  );
}

"use client";

import { useMemo } from "react";
import { useTranslations } from "@/lib/i18n-stub";
import { CategoryExplorer } from "@/components/catalog/CategoryExplorer";
import {
  DEFAULT_FREE_TRAFFIC_CATEGORY,
  FREE_TRAFFIC_CATEGORY_META,
} from "@/lib/features/tools/free-traffic-categories";
import { getToolHref } from "@/lib/features/tools/paths";
import type { FreeTrafficCategory, FreeTrafficTool } from "@/lib/features/tools/free-traffic-catalog";

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

export function FreeToolsCategoryExplorer({ tools }: FreeToolsCategoryExplorerProps) {
  const t = useTranslations("freeTrafficCatalog");
  const toolsByCategory = useMemo(() => groupToolsByCategory(tools), [tools]);

  const groups = useMemo(
    () =>
      FREE_TRAFFIC_CATEGORY_META.map((meta) => ({
        id: meta.id,
        label: t(meta.labelKey),
        description: t(meta.descriptionKey),
        items: (toolsByCategory.get(meta.id) ?? []).map((tool) => ({
          title: tool.title,
          description: tool.description,
          href: getToolHref("free", tool.slug),
          meta: tool.relatedPremiumSlug ? t("decisionAnalyzerNote") : undefined,
        })),
      })),
    [t, toolsByCategory]
  );

  return (
    <CategoryExplorer
      groups={groups}
      variant="free-tools"
      defaultGroupId={DEFAULT_FREE_TRAFFIC_CATEGORY}
      labels={{
        navLabel: t("categoryNavLabel"),
        countLabel: (count) => t("categoryCount", { count }),
        viewCategory: t("viewCalculators"),
        viewCategoryOpen: t("viewCalculatorsOpen"),
        openItem: t("openCalculator"),
      }}
    />
  );
}

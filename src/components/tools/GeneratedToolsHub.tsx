"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "@/lib/i18n-stub";
import { Search } from "lucide-react";
import type { Tool } from "@/data/tools";
import { ToolsTileGrid } from "@/components/tools/ToolsTileGrid";

type GeneratedToolsHubProps = {
  readonly tools: readonly Tool[];
};

function normalizeSearch(value: string): string {
  return value
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

export function GeneratedToolsHub({ tools }: GeneratedToolsHubProps) {
  const t = useTranslations("generatedToolCatalog");
  const [query, setQuery] = useState("");

  const visibleTools = useMemo(() => {
    const normalized = normalizeSearch(query);
    if (normalized.length === 0) {
      return tools;
    }
    return tools.filter((tool) => {
      const haystack = normalizeSearch(
        [tool.name, tool.slug, tool.shortDescription].join(" "),
      );
      return haystack.includes(normalized);
    });
  }, [query, tools]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("searchPlaceholder")}
          aria-label={t("searchPlaceholder")}
          className="w-full min-h-[44px] rounded-lg border border-technical-gray bg-white py-2.5 pl-10 pr-4 text-sm text-premium-velvet placeholder:text-body-charcoal focus:border-premium-copper focus:outline-none"
        />
      </div>

      <p className="text-sm text-body-charcoal" role="status">
        {t("resultsCount", { count: visibleTools.length })}
      </p>

      {visibleTools.length === 0 ? (
        <p className="rounded-lg border border-dashed border-technical-gray bg-surface-cream px-4 py-10 text-center text-sm text-body-charcoal">
          {t("noResults")}
        </p>
      ) : (
        <ToolsTileGrid tools={visibleTools} />
      )}
    </div>
  );
}

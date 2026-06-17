"use client";

import { type ReactNode } from "react";
import { Search } from "lucide-react";
import { ToolsPageSearchProvider, useToolsPageSearch } from "@/components/tools/tools-page-search-context";

type ToolsPageLayoutProps = {
  readonly title: string;
  readonly subtitle: string;
  readonly children: ReactNode;
  readonly searchPlaceholder?: string;
  readonly categoryTitle?: string;
};

function ToolsPageLayoutChrome({
  title,
  subtitle,
  children,
  searchPlaceholder = "Ara...",
  categoryTitle = "KATEGORİYE GÖRE GÖZ AT",
}: ToolsPageLayoutProps) {
  const { searchQuery, setSearchQuery } = useToolsPageSearch();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="mt-1 text-base text-gray-500">{subtitle}</p>
      </div>

      <div className="relative mb-6">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="w-full min-h-[44px] rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
        />
      </div>

      <div className="mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          {categoryTitle}
        </h2>
        <div className="mt-1 h-px w-full bg-gray-200" />
      </div>

      <div>{children}</div>
    </div>
  );
}

export function ToolsPageLayout(props: ToolsPageLayoutProps) {
  return (
    <ToolsPageSearchProvider>
      <ToolsPageLayoutChrome {...props} />
    </ToolsPageSearchProvider>
  );
}

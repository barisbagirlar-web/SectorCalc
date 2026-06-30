"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/routing";
import { useToolsPageSearch } from "@/components/tools/tools-page-search-context";

/** Keeps hub search in ?q= so catalog grids can filter on the server during SSG. */
export function CatalogSearchUrlSync() {
  const { searchQuery, setSearchQuery } = useToolsPageSearch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hydratedFromUrl = useRef(false);

  useEffect(() => {
    const urlQuery = searchParams?.get("q") ?? "";
    if (!hydratedFromUrl.current) {
      hydratedFromUrl.current = true;
      if (urlQuery !== searchQuery) {
        setSearchQuery(urlQuery);
      }
      return;
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      const trimmed = searchQuery.trim();
      if (trimmed) {
        params.set("q", trimmed);
      } else {
        params.delete("q");
      }
      const nextQuery = params.toString();
      const currentQuery = searchParams?.toString() ?? "";
      if (nextQuery === currentQuery) {
        return;
      }
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
    }, 250);

    return () => clearTimeout(timer);
  }, [pathname, router, searchParams, searchQuery, setSearchQuery]);

  return null;
}

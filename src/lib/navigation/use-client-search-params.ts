"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

function getSearchSnapshot(): string {
  if (typeof window === "undefined") {
    return "";
  }
  return window.location.search;
}

function subscribeToSearch(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const sync = () => onStoreChange();

  window.addEventListener("popstate", sync);

  const originalPushState = window.history.pushState.bind(window.history);
  const originalReplaceState = window.history.replaceState.bind(window.history);

  window.history.pushState = (...args) => {
    originalPushState(...args);
    sync();
  };
  window.history.replaceState = (...args) => {
    originalReplaceState(...args);
    sync();
  };

  return () => {
    window.removeEventListener("popstate", sync);
    window.history.pushState = originalPushState;
    window.history.replaceState = originalReplaceState;
  };
}

/**
 * Read URL search params after mount — avoids useSearchParams() hydration/RSC
 * failures on statically generated pages (pricing, catalogs, account).
 * Syncs on pathname changes and soft navigations that only update the query string.
 */
export function useClientSearchParams(): URLSearchParams {
  const pathname = usePathname();
  const search = useSyncExternalStore(
    subscribeToSearch,
    getSearchSnapshot,
    () => "",
  );

  void pathname;

  return new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
}

export function useClientSearchParam(key: string): string | null {
  const params = useClientSearchParams();
  return params.get(key);
}

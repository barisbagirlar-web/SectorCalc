"use client";

import { useEffect, useState } from "react";

/**
 * Read URL search params after mount — avoids useSearchParams() hydration/RSC
 * failures on statically generated pages (pricing, catalogs).
 */
export function useClientSearchParams(): URLSearchParams {
  const [params, setParams] = useState<URLSearchParams>(
    () => new URLSearchParams(),
  );

  useEffect(() => {
    setParams(new URLSearchParams(window.location.search));
  }, []);

  return params;
}

export function useClientSearchParam(key: string): string | null {
  const params = useClientSearchParams();
  return params.get(key);
}

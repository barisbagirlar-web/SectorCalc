"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Read URL search params after mount — avoids useSearchParams() hydration/RSC
 * failures on statically generated pages (pricing, catalogs, account).
 */
export function useClientSearchParams(): URLSearchParams {
  const pathname = usePathname();
  const [params, setParams] = useState<URLSearchParams>(
    () => new URLSearchParams(),
  );

  useEffect(() => {
    setParams(new URLSearchParams(window.location.search));
  }, [pathname]);

  return params;
}

export function useClientSearchParam(key: string): string | null {
  const params = useClientSearchParams();
  return params.get(key);
}

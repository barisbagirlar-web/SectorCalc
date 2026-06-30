/**
 * Build locale-aware catalog filter URLs (`?category=…`) without hardcoding locale prefixes.
 */
export function buildCatalogFilterHref(
  pathname: string,
  paramKey: string,
  value: string,
  allValue = "all",
): string {
  if (value === allValue) {
    return `${pathname}?${paramKey}=${encodeURIComponent(allValue)}`;
  }
  if (value === "") {
    return pathname;
  }
  const params = new URLSearchParams();
  params.set(paramKey, value);
  return `${pathname}?${params.toString()}`;
}

import { cookies, headers } from "next/headers";
import {
  isRegionCode,
  REGION_HEADER,
  REGION_MANUAL_COOKIE,
  REGION_SOURCE_HEADER,
  resolveActiveRegion,
  type RegionCode,
} from "@/config/regions";
import type { RegionSource } from "@/lib/compliance/detect-region";

export interface ServerRegionResult {
  region: RegionCode;
  source: RegionSource;
}

/** Server Components / Server Actions — locale-aware region with source. */
export async function getServerRegion(locale: string): Promise<ServerRegionResult> {
  const headerStore = await headers();
  const fromHeader = headerStore.get(REGION_HEADER);
  const sourceHeader = headerStore.get(REGION_SOURCE_HEADER);

  let region: RegionCode;
  let source: RegionSource;

  if (fromHeader && isRegionCode(fromHeader)) {
    region = fromHeader;
    source = (sourceHeader as RegionSource) ?? "locale-fallback";
  } else {
    const cookieStore = await cookies();
    const manual = cookieStore.get(REGION_MANUAL_COOKIE)?.value;
    region = resolveActiveRegion(manual, locale);
    source = manual && isRegionCode(manual) ? "manual-cookie" : "locale-fallback";
  }

  return { region, source };
}

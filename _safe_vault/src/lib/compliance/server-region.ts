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

function localeFallbackRegion(locale: string): ServerRegionResult {
  return {
    region: resolveActiveRegion(undefined, locale),
    source: "locale-fallback",
  };
}

function isStaticProductionBuild(): boolean {
  return process.env.NEXT_PHASE === "phase-production-build";
}

/** Server Components / Server Actions — locale-aware region with source. */
export async function getServerRegion(locale: string): Promise<ServerRegionResult> {
  if (isStaticProductionBuild()) {
    return localeFallbackRegion(locale);
  }

  let headerStore: Awaited<ReturnType<typeof headers>>;
  let cookieStore: Awaited<ReturnType<typeof cookies>>;

  try {
    headerStore = await headers();
    cookieStore = await cookies();
  } catch {
    // force-static prerender has no request scope — locale-derived region only.
    return localeFallbackRegion(locale);
  }

  const fromHeader = headerStore.get(REGION_HEADER);
  const sourceHeader = headerStore.get(REGION_SOURCE_HEADER);

  if (fromHeader && isRegionCode(fromHeader)) {
    return {
      region: fromHeader,
      source: (sourceHeader as RegionSource) ?? "locale-fallback",
    };
  }

  const manual = cookieStore.get(REGION_MANUAL_COOKIE)?.value;
  return {
    region: resolveActiveRegion(manual, locale),
    source: manual && isRegionCode(manual) ? "manual-cookie" : "locale-fallback",
  };
}

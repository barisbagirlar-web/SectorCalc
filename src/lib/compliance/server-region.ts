import { cookies, headers } from "next/headers";
import {
  isRegionCode,
  REGION_HEADER,
  REGION_MANUAL_COOKIE,
  resolveActiveRegion,
  type RegionCode,
} from "@/config/regions";

/** Server Components / Server Actions — locale-aware region. */
export async function getServerRegion(locale: string): Promise<RegionCode> {
  const headerStore = await headers();
  const fromHeader = headerStore.get(REGION_HEADER);
  if (fromHeader && isRegionCode(fromHeader)) {
    return fromHeader;
  }

  const cookieStore = await cookies();
  const manual = cookieStore.get(REGION_MANUAL_COOKIE)?.value;
  return resolveActiveRegion(manual, locale);
}

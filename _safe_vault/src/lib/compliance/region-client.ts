"use client";

import {
  isRegionCode,
  REGION_MANUAL_COOKIE,
  type RegionCode,
} from "@/config/regions";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function writeCookie(name: string, value: string): void {
  document.cookie = `${name}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

function deleteCookie(name: string): void {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

/** Persist manual region override and refresh RSC region context. */
export function setManualRegion(region: RegionCode | "auto"): void {
  if (region === "auto") {
    deleteCookie(REGION_MANUAL_COOKIE);
  } else if (isRegionCode(region)) {
    writeCookie(REGION_MANUAL_COOKIE, region);
  }
  window.location.reload();
}

export function readManualRegionCookie(): RegionCode | null {
  if (typeof document === "undefined") {
    return null;
  }
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${REGION_MANUAL_COOKIE}=`));
  if (!match) {
    return null;
  }
  const value = match.split("=")[1];
  return isRegionCode(value) ? value : null;
}

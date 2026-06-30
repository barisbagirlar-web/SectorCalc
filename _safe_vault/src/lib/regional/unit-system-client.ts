"use client";

import {
  isUnitSystemPreference,
  UNIT_SYSTEM_COOKIE,
  UNIT_SYSTEM_MANUAL_COOKIE,
  type UnitSystemPreference,
} from "@/config/measurement";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function writeCookie(name: string, value: string): void {
  document.cookie = `${name}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

function deleteCookie(name: string): void {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  if (!match) {
    return null;
  }
  return match.split("=")[1] ?? null;
}

export function readUnitSystemCookie(): UnitSystemPreference | null {
  const value = readCookie(UNIT_SYSTEM_COOKIE);
  return isUnitSystemPreference(value) ? value : null;
}

export function readManualUnitSystemCookie(): UnitSystemPreference | null {
  const value = readCookie(UNIT_SYSTEM_MANUAL_COOKIE);
  return isUnitSystemPreference(value) ? value : null;
}

/** Persist manual unit system override and refresh the page context. */
export function setManualUnitSystem(preference: UnitSystemPreference | "auto"): void {
  if (preference === "auto") {
    deleteCookie(UNIT_SYSTEM_MANUAL_COOKIE);
  } else {
    writeCookie(UNIT_SYSTEM_MANUAL_COOKIE, preference);
    writeCookie(UNIT_SYSTEM_COOKIE, preference);
  }
  window.location.reload();
}

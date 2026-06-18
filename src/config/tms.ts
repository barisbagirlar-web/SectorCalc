/**
 * Translation Management System (TMS) — Lokalise integration flags.
 */

export const TMS_PROVIDER = "lokalise" as const;

export function isTmsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_TMS_ENABLED === "true";
}

/** Server-side live pull from Lokalise (uses LOKALISE_TOKEN, not OTA SDK token). */
export function isTmsLivePullEnabled(): boolean {
  return isTmsEnabled() && process.env.LOKALISE_LIVE_PULL === "true";
}

export function resolveOtaApiToken(): string | null {
  return (
    process.env.LOKALISE_OTA_TOKEN?.trim() ||
    process.env.NEXT_PUBLIC_LOKALISE_OTA_TOKEN?.trim() ||
    null
  );
}

export function resolveLokaliseProjectId(): string | null {
  return process.env.LOKALISE_PROJECT_ID?.trim() || null;
}

export function resolveLokaliseApiToken(): string | null {
  return process.env.LOKALISE_TOKEN?.trim() || null;
}

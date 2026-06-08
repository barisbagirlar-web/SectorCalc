/**
 * Smart Form pilot feature flag — Phase 5H-G-D.
 * Default off; no secrets; safe build-time fallback.
 */

export const SMART_FORM_PILOT_SLUG = "3d-print-cost-check" as const;

export function isSmartFormPilotEnabled(): boolean {
  const raw = process.env.NEXT_PUBLIC_SMART_FORM_PILOT?.trim().toLowerCase();
  return raw === "true" || raw === "1";
}

export function isSmartFormPilotSlug(slug: string): boolean {
  return slug === SMART_FORM_PILOT_SLUG;
}

export function shouldUseSmartFormPilot(slug: string): boolean {
  return isSmartFormPilotEnabled() && isSmartFormPilotSlug(slug);
}

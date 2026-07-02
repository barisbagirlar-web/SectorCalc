/**
 * Enterprise report branding types - data model only, no upload/storage.
 */

export type ReportBrandingPlan = "business" | "enterprise";

export type WatermarkMode = "none" | "sectorcalc_footer" | "custom_footer";

export type ReportBrandingProfile = {
  readonly organizationName: string;
  readonly logoUrl?: string;
  readonly reportFooter?: string;
  readonly brandColor?: string;
  readonly allowedPlan: ReportBrandingPlan;
  readonly watermarkMode: WatermarkMode;
};

export const DEFAULT_REPORT_BRANDING: ReportBrandingProfile = {
  organizationName: "SectorCalc",
  allowedPlan: "business",
  watermarkMode: "sectorcalc_footer",
};

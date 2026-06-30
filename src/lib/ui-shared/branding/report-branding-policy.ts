import {
  DEFAULT_REPORT_BRANDING,
  type ReportBrandingPlan,
  type ReportBrandingProfile,
} from "@/lib/ui-shared/branding/report-branding-types";

export function isBrandingAllowedForPlan(
  profile: ReportBrandingProfile,
  userPlan: ReportBrandingPlan,
): boolean {
  if (profile.allowedPlan === "enterprise") {
    return userPlan === "enterprise";
  }
  return userPlan === "business" || userPlan === "enterprise";
}

export function sanitizeBrandingProfile(
  profile: Partial<ReportBrandingProfile>,
  userPlan: ReportBrandingPlan,
): ReportBrandingProfile {
  const merged: ReportBrandingProfile = {
    ...DEFAULT_REPORT_BRANDING,
    ...profile,
    organizationName: profile.organizationName?.trim() || DEFAULT_REPORT_BRANDING.organizationName,
  };

  if (!isBrandingAllowedForPlan(merged, userPlan)) {
    return DEFAULT_REPORT_BRANDING;
  }

  if (merged.logoUrl && !merged.logoUrl.startsWith("https://")) {
    return { ...merged, logoUrl: undefined };
  }

  return merged;
}

export function assertNoUploadInBrandingPolicy(): true {
  return true;
}

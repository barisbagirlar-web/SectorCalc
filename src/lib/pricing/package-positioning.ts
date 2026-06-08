/**
 * Package positioning copy model — does NOT modify Stripe or live pricing UI.
 */

export type PackageTierId = "pro" | "business" | "enterprise";

export type PackageFeatureKey =
  | "trust_trace"
  | "validation_seal"
  | "pdf_report"
  | "public_verify"
  | "white_label_reports"
  | "saved_history"
  | "sector_catalog";

export type PackagePositioningEntry = {
  readonly id: PackageTierId;
  readonly displayName: string;
  readonly priceLabel: string;
  readonly billingNote: string;
  readonly features: readonly PackageFeatureKey[];
  readonly positioningLine: string;
};

/** Copy draft only — live checkout uses plan-catalog.ts separately. */
export const PACKAGE_POSITIONING: readonly PackagePositioningEntry[] = [
  {
    id: "pro",
    displayName: "Pro",
    priceLabel: "$19 / month (positioning draft)",
    billingNote: "Reference positioning; live Stripe prices configured server-side.",
    features: ["trust_trace", "validation_seal", "pdf_report", "saved_history", "sector_catalog"],
    positioningLine:
      "Individual operators who need verdict-grade reports, trust trace exports, and saved history.",
  },
  {
    id: "business",
    displayName: "Business",
    priceLabel: "$99 / month (positioning draft)",
    billingNote: "Reference positioning; live Stripe prices configured server-side.",
    features: [
      "trust_trace",
      "validation_seal",
      "pdf_report",
      "public_verify",
      "white_label_reports",
      "saved_history",
      "sector_catalog",
    ],
    positioningLine:
      "Teams that share decision reports, verify exports, and need business-tier branding hooks.",
  },
  {
    id: "enterprise",
    displayName: "Enterprise",
    priceLabel: "Custom",
    billingNote: "Sales-assisted; feature flags and branding negotiated per account.",
    features: [
      "trust_trace",
      "validation_seal",
      "pdf_report",
      "public_verify",
      "white_label_reports",
      "saved_history",
      "sector_catalog",
    ],
    positioningLine:
      "Multi-site operators needing custom branding policy, verification workflows, and governance review.",
  },
];

export function getPackagePositioning(tierId: PackageTierId): PackagePositioningEntry | undefined {
  return PACKAGE_POSITIONING.find((entry) => entry.id === tierId);
}

export function listPackageFeatures(tierId: PackageTierId): readonly PackageFeatureKey[] {
  return getPackagePositioning(tierId)?.features ?? [];
}

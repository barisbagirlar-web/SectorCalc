/**
 * Commercial model data contract — Phase 6B (no payment integration).
 */

export type CommercialTierId =
  | "free"
  | "premium_report"
  | "sector_pack"
  | "pro_workspace"
  | "enterprise";

export type CommercialTier = {
  readonly id: CommercialTierId;
  readonly name: string;
  readonly priceLabel: string;
  readonly period: string;
  readonly summary: string;
  readonly includes: readonly string[];
  readonly checkoutLive: boolean;
};

export type PaywallLockedFeature =
  | "premium_insight"
  | "trust_trace_report"
  | "pdf_export"
  | "excel_export"
  | "word_export"
  | "scenario_analysis"
  | "recommendation_layer";

export const COMMERCIAL_TIERS: readonly CommercialTier[] = [
  {
    id: "free",
    name: "Free Check",
    priceLabel: "$0",
    period: "forever",
    summary: "Quick sector estimate with visible risk signal.",
    includes: ["3–5 structured inputs", "Risk level headline", "Browser-side processing"],
    checkoutLive: false,
  },
  {
    id: "premium_report",
    name: "Premium Report",
    priceLabel: "$19",
    period: "per report",
    summary: "One-off decision report with verdict and safe price where applicable.",
    includes: ["Full verdict structure", "Margin leak drivers", "Suggested action", "PDF export when subscribed"],
    checkoutLive: true,
  },
  {
    id: "sector_pack",
    name: "Sector Pack",
    priceLabel: "From $29/mo",
    period: "monthly or annual",
    summary: "Sector-specific analyzer access with saved history.",
    includes: ["Premium analyzers in pack", "Saved reports", "Export-ready outputs"],
    checkoutLive: true,
  },
  {
    id: "pro_workspace",
    name: "Pro Workspace",
    priceLabel: "$29/mo",
    period: "billed monthly",
    summary: "Multiple tools, saved reports, and export for recurring operators.",
    includes: ["Cross-sector tools", "Report history", "PDF export", "Priority support path"],
    checkoutLive: true,
  },
  {
    id: "enterprise",
    name: "Enterprise / Team",
    priceLabel: "Custom",
    period: "annual contract",
    summary: "Team workspace, inquiry-led onboarding, and API discussion.",
    includes: ["Team seats", "Custom sector rollout", "API / integration inquiry"],
    checkoutLive: false,
  },
] as const;

export const PAYWALL_LOCKED_FEATURES: readonly {
  readonly id: PaywallLockedFeature;
  readonly label: string;
  readonly freeVisible: boolean;
}[] = [
  { id: "premium_insight", label: "Premium insight and verdict", freeVisible: false },
  { id: "trust_trace_report", label: "Calculation summary preview", freeVisible: false },
  { id: "pdf_export", label: "PDF export", freeVisible: false },
  { id: "excel_export", label: "Excel export", freeVisible: false },
  { id: "word_export", label: "Word export", freeVisible: false },
  { id: "scenario_analysis", label: "Scenario analysis rows", freeVisible: false },
  { id: "recommendation_layer", label: "Recommendation layer", freeVisible: false },
] as const;

export const LEAD_CAPTURE_INTENTS = [
  "request_early_access",
  "premium_report_preview",
  "talk_to_us",
] as const;

export type LeadCaptureIntent = (typeof LEAD_CAPTURE_INTENTS)[number];

export type LeadCaptureContract = {
  readonly intent: LeadCaptureIntent;
  readonly fields: readonly ("email" | "company" | "sector" | "message")[];
  readonly backendWired: false;
  readonly storage: "ui_only";
};

export const LEAD_CAPTURE_CONTRACTS: readonly LeadCaptureContract[] = [
  {
    intent: "request_early_access",
    fields: ["email", "company", "sector"],
    backendWired: false,
    storage: "ui_only",
  },
  {
    intent: "premium_report_preview",
    fields: ["email", "sector"],
    backendWired: false,
    storage: "ui_only",
  },
  {
    intent: "talk_to_us",
    fields: ["email", "company", "message"],
    backendWired: false,
    storage: "ui_only",
  },
] as const;

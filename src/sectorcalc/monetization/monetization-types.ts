// SectorCalc V5.3.1 — Monetary Loss Hook Types
// Metadata-only shapes. No function fields. No Stripe price IDs. No exact formula expressions.

export type MonetizationPainMetricKind =
  | "MONTHLY_DOWNTIME_LOSS"
  | "ANNUAL_SETUP_COST"
  | "SCRAP_COST"
  | "REWORK_COST"
  | "ENERGY_LEAKAGE"
  | "CARBON_COST_EXPOSURE"
  | "QUOTE_MARGIN_LEAKAGE"
  | "INVENTORY_CASH_LOCK"
  | "LOGISTICS_DELAY_COST"
  | "QUALITY_ESCAPE_RISK";

export type PremiumUnlockType =
  | "MACHINE_LEVEL_BREAKDOWN"
  | "COST_DRIVER_BREAKDOWN"
  | "PDF_PROOF_PACK"
  | "SCENARIO_COMPARISON"
  | "SENSITIVITY_ANALYSIS"
  | "FMEA_DETAIL"
  | "JSON_AUDIT_EXPORT";

export type CheckoutIntent = "FREE_TOOL_PREMIUM_UPSELL";

export interface MonetizationConfig {
  toolKey: string;
  freeOutputKey: string;
  painMetricKey: string;
  painMetricKind: MonetizationPainMetricKind;
  impactModelId: string;
  premiumUnlockType: PremiumUnlockType;
  ctaLabel: string;
  ctaSubtext: string;
  priceLookupKey: string;
  safetyLabel: "ESTIMATED_DECISION_SUPPORT_ONLY";
  publicMethodologySummary: string;
  requiredCommercialInputs: string[];
}

export interface ServerImpactInput {
  toolKey: string;
  normalizedInputs: Record<string, number>;
  freeOutputs: Record<string, number>;
  displayCurrency: string | null;
}

export interface ServerImpactOutput {
  painMetricKey: string;
  value: number | null;
  unit: string;
  displayCurrency: string | null;
  confidence: "HIGH" | "MEDIUM" | "LOW" | "INSUFFICIENT_INPUT";
  status: "AVAILABLE" | "INSUFFICIENT_INPUT" | "NOT_APPLICABLE";
  publicLabel: string;
  publicExplanation: string;
  safetyNote: string;
}

export interface PremiumHookPublic {
  free_output_key: string;
  pain_metric_key: string;
  pain_metric: {
    value: number | null;
    unit: string;
    display_currency: string | null;
    confidence: "HIGH" | "MEDIUM" | "LOW" | "INSUFFICIENT_INPUT";
    status: "AVAILABLE" | "INSUFFICIENT_INPUT" | "NOT_APPLICABLE";
    label: string;
    explanation: string;
    safety_note: string;
  };
  cta: {
    label: string;
    subtext: string;
    unlock_type: PremiumUnlockType;
    checkout_intent: CheckoutIntent;
    price_lookup_key: string;
  };
  redaction_status: "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED";
}

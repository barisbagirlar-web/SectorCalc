import type { IndustrySlug } from "@/data/industries";
import type { ToolSlug, ToolTier } from "@/data/tools";

export type ToolInputType = "number" | "select";

export type ResultTone = "neutral" | "success" | "warning" | "danger";

export interface ToolInputOption {
  value: string;
  label: string;
}

export interface ToolInput {
  id: string;
  label: string;
  type: ToolInputType;
  unit?: string;
  currency?: boolean;
  defaultValue: number | string;
  min?: number;
  max?: number;
  step?: number;
  helperText: string;
  required: boolean;
  options?: ToolInputOption[];
}

export interface ToolOutputMeta {
  id: string;
  label: string;
  unit?: string;
  currency?: boolean;
}

export interface ToolResult {
  id: string;
  label: string;
  value: number;
  unit?: string;
  currency?: boolean;
  description?: string;
  tone: ResultTone;
}

export interface ToolSeo {
  title: string;
  description: string;
  canonicalPath: string;
}

export interface ToolPremiumTeaser {
  title: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
}

export type CalculatorId =
  | "machine-hour-estimator"
  | "cnc-minimum-safe-quote-analyzer"
  | "project-cost-estimator"
  | "cleaning-cost-estimator"
  | "food-cost-calculator"
  | "product-margin-calculator"
  | "change-order-impact-analyzer"
  | "office-cleaning-bid-optimizer"
  | "menu-profit-leak-detector"
  | "return-rate-profit-erosion-tool";

export interface ToolFeatures {
  /** Premium decision report, scenarios, and risk verdict */
  decisionReport?: boolean;
}

export interface ToolDefinition {
  id: ToolSlug;
  slug: ToolSlug;
  tier: ToolTier;
  industryId: IndustrySlug;
  title: string;
  shortDescription: string;
  longDescription: string;
  inputs: ToolInput[];
  outputs: ToolOutputMeta[];
  /** Upsell panel for free tools; omit on premium tools with decision report */
  premiumTeaser?: ToolPremiumTeaser;
  relatedToolIds: ToolSlug[];
  seo: ToolSeo;
  calculatorId: CalculatorId;
  interpretationNote: string;
  faqPlaceholder?: string;
  features?: ToolFeatures;
}

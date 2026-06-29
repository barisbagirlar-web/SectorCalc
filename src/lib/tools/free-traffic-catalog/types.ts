/**
 * Free Traffic Catalog — 230 active browser-side calculators (Omni-style library).
 */

export type FreeTrafficCategory = string;

export type FreeTrafficInput = {
  readonly key: string;
  readonly label: string;
  readonly unit: string;
  readonly type: "number" | "select";
  readonly options?: readonly { readonly label: string; readonly value: string }[];
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly defaultValue?: number | string;
  readonly helper: string;
};

export type FreeTrafficResultType =
  | "quantity"
  | "cost"
  | "ratio"
  | "conversion"
  | "time"
  | "health"
  | "statistics";

export type FreeTrafficTool = {
  readonly slug: string;
  readonly title: string;
  readonly category: FreeTrafficCategory;
  readonly description: string;
  readonly seoTitle: string;
  readonly seoDescription: string;
  readonly inputs: readonly FreeTrafficInput[];
  readonly resultType: FreeTrafficResultType;
  readonly relatedPremiumSlug?: string;
  readonly relatedIndustrySlug?: string;
  readonly missingFactors: readonly string[];
};

/** @deprecated All catalog tools are active; kept for backward compatibility */
export type FreeTrafficToolInput = FreeTrafficInput;

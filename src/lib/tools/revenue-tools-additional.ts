import type { IndustrySlug } from "@/lib/tools/industry-registry";

type RevenueInputType = "number" | "currency" | "percent" | "select";

type RevenueToolInput = {
 key: string;
 label: string;
 type: RevenueInputType;
 unit?: string;
 required: boolean;
 defaultValue?: number | string;
 helperText?: string;
 options?: readonly { value: string; label: string }[];
};

export type AdditionalRevenueTool = {
 sector: IndustrySlug;
 freeSlug: string;
 paidSlug: string;
 freeTitle: string;
 paidTitle: string;
 painStatement: string;
 freeValue: string;
 paidValue: string;
 freeInputs: RevenueToolInput[];
 paidInputs: RevenueToolInput[];
 freeResultPromise: string;
 paidResultPromise: string;
 verdictLabels: string[];
 legalDisclaimer: string;
 seoKeywords: string[];
 freeCalculatorInputIds: readonly string[];
 freeResultIds: readonly string[];
 freeMissingFactors: readonly string[];
 premiumCtaLabel: string;
 premiumTeaserTitle: string;
 premiumTeaserText: string;
};

export const additionalRevenueTools: AdditionalRevenueTool[] = [];

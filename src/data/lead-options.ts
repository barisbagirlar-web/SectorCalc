import { industryRegistry } from "@/lib/tools/industry-registry";
import { ALL_TOOLS } from "@/data/tools";
import type { IndustrySlug } from "@/lib/tools/industry-registry";
import { INDUSTRIES } from "@/data/industries";
import type { LeadPlan } from "@/lib/leads/types";

export interface SelectOption {
  value: string;
  label: string;
}

export const LEAD_INDUSTRY_OPTIONS: SelectOption[] = [
  ...industryRegistry.map((entry) => ({
    value: entry.name,
    label: entry.name,
  })),
  { value: "Consulting / Agency", label: "Consulting / Agency" },
  { value: "Other", label: "Other" },
];

export const LEAD_INTENDED_USE_OPTIONS: SelectOption[] = [
  { value: "Price a job", label: "Price a job" },
  { value: "Check margin risk", label: "Check margin risk" },
  { value: "Prepare a client report", label: "Prepare a client report" },
  { value: "Compare scenarios", label: "Compare scenarios" },
  { value: "Evaluate a business decision", label: "Evaluate a business decision" },
  { value: "Other", label: "Other" },
];

export const LEAD_TOOL_OPTIONS: SelectOption[] = ALL_TOOLS.map((tool) => ({
  value: tool.name,
  label: `${tool.name} (${tool.tier})`,
}));

const INDUSTRY_SLUG_TO_LEAD: Record<IndustrySlug, string> = Object.fromEntries(
  industryRegistry.map((entry) => [entry.slug, entry.name])
) as Record<IndustrySlug, string>;

export function industrySlugToLeadValue(slug: IndustrySlug): string {
  return INDUSTRY_SLUG_TO_LEAD[slug];
}

export function getIndustryNameBySlug(slug: string): string | undefined {
  return INDUSTRIES.find((i) => i.slug === slug)?.name;
}

export function pricingPlanIdToLeadPlan(planId: string): LeadPlan {
  switch (planId) {
    case "single-report":
      return "single_report";
    case "sector-pass":
      return "sector_pass";
    case "pro":
      return "pro";
    case "free":
      return "free";
    default:
      return "unknown";
  }
}

export const LEAD_STORAGE_KEY = "sectorcalc:lead-intents";
